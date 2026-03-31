import React, { useEffect, useMemo, useState } from "react";
import { Map, MapMarker, Polygon } from "react-kakao-maps-sdk";
import regionData from "../../data/skorea-municipalities-2018-geo.json";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PageComponent from "../common/PageComponent";
import "./ItemBoardMapComponent.css";

const KakaoMap = ({
  currentFilters,
  status,
  category,
  categories,
  handleFilterChange,
}) => {
  const [address, setAddress] = useState("");
  const [inputText, setInputText] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [position, setPosition] = useState({ lat: 37.5665, lng: 126.978 });
  const [mapLevel, setMapLevel] = useState(9);
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const size = 12;

  const [serverData, setServerData] = useState({
    dtoList: [],
    pageNumList: [],
    pageRequestDTO: null,
    prev: false,
    next: false,
    totalCount: 0,
    prevPage: 0,
    nextPage: 0,
    totalPage: 0,
    current: 1,
  });

  const handleReset = () => {
    setSelectedRegion(""); // 지역 선택 해제
    setPage(1); // 페이지 1로 초기화
    setInputText(""); // 검색어 초기화
  };

  useEffect(() => {
    const loadData = async () => {
      const locationParam =
        selectedRegion && selectedRegion !== "all" ? selectedRegion : "";
      try {
        const response = await axios.get(
          `http://localhost:8080/itemBoard/list`,
          {
            params: {
              location: locationParam,
              category:
                currentFilters?.category === "all"
                  ? ""
                  : currentFilters?.category,
              status:
                currentFilters?.status === "all" ? "" : currentFilters?.status,
              searchType: currentFilters?.searchType || "all",
              keyword: currentFilters?.keyword || "",
              page: page,
              size: size,
            },
          },
        );
        if (response.data) setServerData(response.data);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      }
    };
    loadData();
  }, [selectedRegion, currentFilters, page]);

  const processedRegions = useMemo(() => {
    return regionData.features.map((feature) => {
      const coordinates = feature.geometry.coordinates[0];
      const path = Array.isArray(coordinates[0][0])
        ? coordinates[0].map((coord) => ({ lat: coord[1], lng: coord[0] }))
        : coordinates.map((coord) => ({ lat: coord[1], lng: coord[0] }));
      return { name: feature.properties.name, path: path };
    });
  }, []);

  const searchAddress = () => {
    if (!inputText.trim()) {
      alert("동네 이름을 입력하세요!");
      return;
    }
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(inputText, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const newPos = { lat: result[0].y, lng: result[0].x };
        setPosition(newPos);
        setAddress(result[0].address_name);
        const regionName = result[0].address.region_2depth_name;
        if (regionName) {
          setSelectedRegion(regionName);
          setPage(1);
        }
      } else {
        alert("검색 결과가 없습니다.");
      }
    });
  };

  return (
    <div className="kakao-map-container">
      {/* 검색창 */}
      <div className="search-box">
        <input
          className="search-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="동네 이름을 입력하세요 (예: 강남구, 역삼동)"
          onKeyDown={(e) => e.key === "Enter" && searchAddress()}
        />
        <button className="search-button" onClick={searchAddress}>
          검색
        </button>
        <button className="reset-button" onClick={handleReset}>
          초기화
        </button>
      </div>

      {/* 상태 표시 */}
      <div className="status-display">
        <div className="status-text">
          선택된 지역(구):{" "}
          <b className="highlight-text">
            {selectedRegion || "구역을 클릭해주세요"}
          </b>
        </div>
      </div>

      {/* 지도 영역 */}
      <div className="map-wrapper">
        <Map
          center={position}
          level={mapLevel}
          onZoomChanged={(map) => setMapLevel(map.getLevel())}
          className="kakao-map-canvas"
        >
          <MapMarker position={position} />
          {mapLevel <= 10 &&
            processedRegions.map((region, index) => (
              <Polygon
                key={`${region.name}-${index}`}
                path={region.path}
                fillColor={selectedRegion === region.name ? "#e74c3c" : "#39f"}
                fillOpacity={0.3}
                strokeWeight={2}
                strokeColor="#004c80"
                onClick={() => {
                  setSelectedRegion(region.name);
                  setPage(1);
                }}
              />
            ))}
        </Map>
      </div>

      {/* 상품 목록 섹션 */}
      <div className="item-section">
        <div className="item-header">
          <h3 className="item-title">
            🎁 {selectedRegion ? `${selectedRegion}의 꿀템` : "전체 지역 상품"}
          </h3>
          <div className="filter-group">
            <select
              className="filter-select"
              value={status}
              onChange={(e) => {
                handleFilterChange("status", e.target.value);
                setPage(1);
              }}
            >
              <option value="all">전체 상태</option>
              <option value="false">판매중</option>
              <option value="true">판매완료</option>
            </select>
            <select
              className="filter-select"
              value={category}
              onChange={(e) => {
                handleFilterChange("category", e.target.value);
                setPage(1);
              }}
            >
              <option value="all">모든 카테고리</option>
              {categories?.map((item) => (
                <option key={item.codeValue} value={item.codeValue}>
                  {item.codeName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 상품 그리드 */}
        {serverData.dtoList.length > 0 ? (
          <div className="item-grid">
            {serverData.dtoList.map((item) => (
              <div
                key={item.id}
                className="item-card"
                onClick={() => navigate(`/itemBoard/read/${item.id}`)}
              >
                <div className="item-image-wrapper">
                  {(item.status === "판매완료" || item.status === "true") && (
                    <div className="sold-out-overlay">SOLD OUT</div>
                  )}
                  <img
                    className="item-image"
                    src={
                      item.uploadFileNames?.length > 0
                        ? `http://localhost:8080/itemBoard/view/s_${item.uploadFileNames[0]}`
                        : `http://localhost:8080/itemBoard/view/default.jpg`
                    }
                    alt={item.title}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150";
                    }}
                  />
                </div>
                <div className="item-info">
                  <div className="item-location">{item.location}</div>
                  <div className="item-name">{item.title}</div>
                  <div className="item-price">
                    {item.price?.toLocaleString()}원
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            {selectedRegion
              ? `아직 ${selectedRegion}에 조건에 맞는 꿀템이 없어요. 😢`
              : "지도를 클릭해 동네 꿀템을 찾아보세요!"}
          </div>
        )}

        {/* 페이징 */}
        <div className="pagination-wrapper">
          <PageComponent
            serverData={serverData}
            moveToList={(p) => {
              setPage(p.page);
              window.scrollTo({ top: 600, behavior: "smooth" });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default KakaoMap;
