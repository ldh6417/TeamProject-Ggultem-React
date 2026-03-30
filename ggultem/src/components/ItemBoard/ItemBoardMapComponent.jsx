import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Map, MapMarker, Polygon } from "react-kakao-maps-sdk";
import regionData from "../../data/skorea-municipalities-2018-geo.json";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const KakaoMap = () => {
  const [address, setAddress] = useState("");
  const [inputText, setInputText] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [items, setItems] = useState([]); // 서버에서 받아온 상품 목록
  const [position, setPosition] = useState({ lat: 37.5665, lng: 126.978 }); // 지도 중심
  const [mapLevel, setMapLevel] = useState(9);
  const navigate = useNavigate();

  // 서버에서 지역별 아이템 가져오기
  const fetchItemsByRegion = useCallback(async (regionName) => {
    console.log("서버로 보내는 지역명:", regionName);
    try {
      const response = await axios.get(`http://localhost:8080/itemBoard/list`, {
        params: {
          location: regionName,
          page: 1,
          size: 12,
          searchType: "all",
        },
      });

      console.log("서버 응답 데이터 전체:", response.data);

      if (response.data && response.data.dtoList) {
        setItems(response.data.dtoList);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error);
      setItems([]);
    }
  }, []);

  // 선택된 지역이 변경될 때마다 데이터 요청
  useEffect(() => {
    if (selectedRegion) {
      const timer = setTimeout(() => {
        fetchItemsByRegion(selectedRegion);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [selectedRegion, fetchItemsByRegion]);

  // 행정구역 데이터 가공
  const processedRegions = useMemo(() => {
    return regionData.features.map((feature) => {
      const coordinates = feature.geometry.coordinates[0];
      const path = Array.isArray(coordinates[0][0])
        ? coordinates[0].map((coord) => ({ lat: coord[1], lng: coord[0] }))
        : coordinates.map((coord) => ({ lat: coord[1], lng: coord[0] }));

      return {
        name: feature.properties.name,
        path: path,
      };
    });
  }, []);

  // 주소 검색 함수
  const searchAddress = () => {
    if (!inputText.trim()) {
      alert("동네 이름을 입력하세요!");
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(inputText, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const newPos = { lat: result[0].y, lng: result[0].x };

        // 1. 지도 중심 이동
        setPosition(newPos);

        // 2. 검색된 전체 주소 저장
        setAddress(result[0].address_name);

        // 3. ⭐ 핵심: 검색 결과에서 '구' 단위 이름 추출 (예: 강남구)
        // 주소 체계에 따라 region_2depth_name이 구 이름을 담고 있습니다.
        const regionName = result[0].address.region_2depth_name;

        if (regionName) {
          console.log("검색으로 찾은 지역명:", regionName);
          setSelectedRegion(regionName); // 이 코드가 실행되면 useEffect가 작동해 상품을 가져옵니다.
        }
      } else {
        alert("검색 결과가 없습니다.");
      }
    });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      {/* 1. 검색창 영역 */}
      <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="동네 이름을 입력하세요 (예: 강남구, 역삼동)"
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: "14px",
          }}
          onKeyDown={(e) => e.key === "Enter" && searchAddress()}
        />
        <button
          onClick={searchAddress}
          style={{
            padding: "10px 25px",
            backgroundColor: "#2d8cf0",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          검색
        </button>
      </div>

      {/* 2. 상태 표시 영역 */}
      <div
        style={{
          marginBottom: "15px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          border: "1px solid #eee",
        }}
      >
        <div style={{ fontSize: "14px", color: "#666" }}>
          선택된 지역(구):{" "}
          <b style={{ color: "#e74c3c", fontSize: "16px" }}>
            {selectedRegion || "구역을 클릭해주세요"}
          </b>
        </div>
        <div style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>
          검색된 주소: <b>{address || "없음"}</b>
        </div>
      </div>

      {/* 3. 지도 영역 */}
      <div
        style={{
          width: "100%",
          height: "500px",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #ddd",
          position: "relative",
        }}
      >
        <Map
          center={position}
          level={mapLevel}
          onZoomChanged={(map) => setMapLevel(map.getLevel())}
          style={{ width: "100%", height: "100%" }}
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
                onClick={() => setSelectedRegion(region.name)}
              />
            ))}
        </Map>
      </div>

      {/* 4. 필터링된 상품 리스트 영역 */}
      <div style={{ marginTop: "30px" }}>
        <h3
          style={{ borderBottom: "2px solid #2d8cf0", paddingBottom: "10px" }}
        >
          🎁 {selectedRegion ? `${selectedRegion}의 꿀템` : "전체 지역 상품"}
        </h3>

        {items.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            {/* ⭐ 중첩 map을 제거하고 깔끔하게 수정했습니다 */}
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/itemBoard/read/${item.id}`)}
                style={{
                  border: "1px solid #eee",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "150px",
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  <img
                    src={
                      item.uploadFileNames &&
                      item.uploadFileNames[0] !== "default.jpg"
                        ? `http://localhost:8080/itemBoard/view/${item.uploadFileNames[0]}`
                        : "https://via.placeholder.com/150"
                    }
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150";
                    }}
                  />
                </div>
                <div style={{ padding: "12px" }}>
                  <div style={{ fontSize: "12px", color: "#999" }}>
                    {item.location}
                  </div>
                  <div
                    style={{
                      fontWeight: "bold",
                      margin: "5px 0",
                      fontSize: "15px",
                    }}
                  >
                    {item.title}
                  </div>
                  <div style={{ color: "#2d8cf0", fontWeight: "bold" }}>
                    {item.price ? item.price.toLocaleString() : 0}원
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "50px 0",
              color: "#999",
              backgroundColor: "#f9f9f9",
              borderRadius: "12px",
              marginTop: "20px",
            }}
          >
            {selectedRegion
              ? `아직 ${selectedRegion}에 등록된 꿀템이 없어요. 😢`
              : "지도를 클릭해 동네 꿀템을 찾아보세요!"}
          </div>
        )}
      </div>
    </div>
  );
};

export default KakaoMap;
