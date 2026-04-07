import React, { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PageComponent from "../common/PageComponent";
import { addCart, removeByItem } from "../../api/CartApi";
import "./ItemBoardMapComponent.css";
import useCustomLogin from "../../hooks/useCustomLogin";

const KakaoMap = ({
  currentFilters,
  status,
  category,
  categories,
  handleFilterChange,
}) => {
  const [inputText, setInputText] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [position, setPosition] = useState({ lat: 37.5665, lng: 126.978 });
  const [mapLevel, setMapLevel] = useState(9);
  const { loginState, isLogin } = useCustomLogin();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const size = 24;

  const [serverData, setServerData] = useState({
    dtoList: [],
    pageNumList: [],
    totalCount: 0,
    current: 1,
  });

  // 장바구니 등록/해제 토글 함수
  const handleWishClick = async (item) => {
    if (!isLogin || !loginState.email) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }
    const isSoldOut = item.status === "true";

    if (item.email === loginState.email || item.writer === loginState.email) {
      alert("본인이 등록한 상품은 찜할 수 없습니다.");
      return;
    }
    if (isSoldOut) {
      alert("판매된 상품입니다.");
      return;
    }

    try {
      if (item.favorite) {
        await removeByItem(item.id, loginState.email);
        setServerData((prevData) => ({
          ...prevData,
          dtoList: prevData.dtoList.map(
            (d) => (d.id === item.id ? { ...d, favorite: false } : d), // 여기도 favorite
          ),
        }));
      } else {
        const cartData = { itemId: item.id, email: loginState.email };
        await addCart(cartData);
        setServerData((prevData) => ({
          ...prevData,
          dtoList: prevData.dtoList.map(
            (d) => (d.id === item.id ? { ...d, favorite: true } : d), // 여기도 favorite
          ),
        }));
      }
    } catch (error) {
      console.error("처리 실패:", error);
    }
  };

  const handleReset = () => {
    setSelectedRegion("");
    setPage(1);
    setInputText("");
    setPosition({ lat: 37.5665, lng: 126.978 });
    setMapLevel(9);
  };

  // ★ 데이터 로드 로직 (새로고침 시 유지 핵심)
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
              email: loginState.email, // ★ 서버에 로그인한 이메일을 보내서 찜 여부를 받아옴
            },
          },
        );
        if (response.data) setServerData(response.data);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      }
    };
    loadData();
    // loginState.email이 바뀔 때(로그인/로그아웃)도 데이터를 다시 불러와야 별표가 갱신됨
  }, [selectedRegion, currentFilters, page, loginState.email]);

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
        const regionName = result[0].address.region_2depth_name;
        if (regionName) {
          setSelectedRegion(regionName);
          setPage(1);
        }
        setMapLevel(5);
      } else {
        alert("검색 결과가 없습니다.");
      }
    });
  };

  const moveToCurrentLocation = () => {
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const newPos = { lat, lng };
          setPosition(newPos);
          setMapLevel(4);
          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.coord2RegionCode(lng, lat, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const address =
                result.find((item) => item.region_type === "H") || result[0];
              const regionName = address.region_2depth_name;
              if (regionName) {
                setSelectedRegion(regionName);
                setPage(1);
              }
            }
          });
        },
        (error) => alert("위치 정보를 가져올 수 없습니다."),
        options,
      );
    }
  };

  return (
    <div className="kakao-map-page-container">
      <aside className="map-sidebar">
        <div className="sidebar-search-box">
          <input
            className="sidebar-search-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="동네 입력 (예: 강남구)"
            onKeyDown={(e) => e.key === "Enter" && searchAddress()}
          />
          <div className="sidebar-btn-group">
            <button className="sidebar-search-btn" onClick={searchAddress}>
              검색
            </button>
            <button className="sidebar-reset-btn" onClick={handleReset}>
              초기화
            </button>
            <button
              className="sidebar-location-btn"
              onClick={moveToCurrentLocation}
            >
              위치
            </button>
          </div>
        </div>
        <div className="sidebar-status">
          선택 지역:{" "}
          <b className="highlight">{selectedRegion || "전체 지역"}</b>
        </div>
        <div className="sidebar-map-wrapper">
          <Map
            center={position}
            level={mapLevel}
            onZoomChanged={(map) => setMapLevel(map.getLevel())}
            className="kakao-map-canvas"
          >
            <MapMarker position={position} />
          </Map>
        </div>
      </aside>

      <main className="item-section">
        <div className="content-wrapper">
          <div className="item-header">
            <h3 className="item-title">
              {selectedRegion ? `${selectedRegion} 꿀템` : "전체 지역 꿀템"}
            </h3>
            <div className="item-filter-group">
              <select
                className="list-filter-select"
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
                className="list-filter-select"
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
              <button
                className="write-btn"
                onClick={() => navigate("/itemBoard/Register")}
              >
                상품 등록
              </button>
            </div>
          </div>

          <div className="item-grid">
            {serverData.dtoList && serverData.dtoList.length > 0 ? (
              serverData.dtoList.map((item) => (
                <div
                  key={item.id}
                  className="item-card"
                  onClick={() => navigate(`/itemBoard/read/${item.id}`)}
                >
                  <div className="item-img-box">
                    {(item.status === "판매완료" || item.status === "true") && (
                      <div className="sold-out">SOLD OUT</div>
                    )}
                    <img
                      className="item-img"
                      src={
                        item.uploadFileNames?.length > 0
                          ? `http://localhost:8080/itemBoard/view/s_${item.uploadFileNames[0]}`
                          : `http://localhost:8080/itemBoard/view/default.jpg`
                      }
                      alt={item.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/img/default.jpg";
                      }}
                    />
                    <button
                      className={`wish-btn ${item.favorite ? "active" : ""}`} // favorite으로 변경
                      style={{ color: item.favorite ? "yellow" : "white" }} // favorite으로 변경
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWishClick(item);
                      }}
                    >
                      {item.favorite ? "★" : "☆"}
                    </button>
                  </div>

                  <div className="item-details">
                    <div className="item-details-top">
                      <span className="item-loc">{item.location}</span>
                      <span className="item-view">
                        <span className="view-icon">👁️</span>{" "}
                        {item.viewCount || 0}
                      </span>
                    </div>
                    <p className="item-name">{item.title}</p>
                    <p className="item-price">
                      {item.price?.toLocaleString()}원
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data">등록된 꿀템이 없습니다.</div>
            )}
          </div>

          <div className="list-pagination">
            <PageComponent
              serverData={serverData}
              moveToList={(p) => {
                setPage(p.page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default KakaoMap;
