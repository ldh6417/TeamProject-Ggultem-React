import { useRef, useState, useEffect } from "react";
import { postAdd } from "../../../api/ItemBoardApi";
import { useNavigate } from "react-router";
import useCustomLogin from "../../../hooks/useCustomLogin";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import "./AdminRegisterComponent.css";

const initState = {
  title: "",
  price: 0,
  content: "",
  category: "",
  location: "",
  // 초기값 서울시청
  lat: 37.5665,
  lng: 126.978,
};

const ItemBoardRegister = () => {
  const { loginState, isLogin, moveToLogin } = useCustomLogin();
  const navigate = useNavigate();
  const uploadRef = useRef();
  const [searchKey, setSearchKey] = useState("");

  const [fetching, setFetching] = useState(false);
  const [item, setItem] = useState({ ...initState });
  const [imagePreviews, setImagePreviews] = useState([]);

  // 로그인 여부 체크
  useEffect(() => {
    if (!isLogin) {
      alert("로그인이 필요한 서비스입니다.");
      moveToLogin();
    }
  }, [isLogin, moveToLogin]);

  // 이미지 선택 시 미리보기 생성
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // 브라우저 메모리에 임시 URL 생성
    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    // 기존 미리보기와 합치기 (새로 선택할 때마다 추가됨)
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  // 특정 미리보기 삭제
  const removeImage = (index) => {
    setImagePreviews((prev) => {
      const target = prev[index];
      URL.revokeObjectURL(target.url); // 메모리 해제
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleChangeItem = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleClickAdd = () => {
    // 1. 전송 전 데이터 로그 확인
    console.log("전송할 이메일:", loginState.email);

    if (!loginState.email) {
      alert("로그인 정보가 없습니다. 다시 로그인 해주세요.");
      return;
    }

    const formData = new FormData();

    // 이미지 추가
    imagePreviews.forEach((imgObj) => {
      formData.append("files", imgObj.file);
    });

    // 2. DTO 필드명과 일치시키기 (중요)
    formData.append("email", loginState.email); // 백엔드 ItemBoardDTO의 private String email; 과 매칭
    formData.append("writer", loginState.nickname || loginState.name);
    formData.append("title", item.title);
    formData.append("price", Number(item.price));
    formData.append("content", item.content);
    formData.append("category", item.category);
    formData.append("location", item.location);
    formData.append("lat", item.lat);
    formData.append("lng", item.lng);
    // status는 서비스에서 강제로 "판매중"을 넣기로 했으므로 여기서 안 보내도 무관함

    setFetching(true);
    postAdd(formData)
      .then((data) => {
        setFetching(false);
        alert("등록 완료!");
        navigate("/admin/itemBoard/list");
      })
      .catch((err) => {
        setFetching(false);
        // 서버에서 보낸 상세 에러 메시지 출력
        console.error("에러 상세:", err.response?.data);
        alert("등록 중 오류 발생!");
      });
  };
  if (!isLogin) return null;

  // 2. 주소 검색 함수
  const handleSearchAddress = () => {
    if (!searchKey.trim()) {
      alert("검색어를 입력하세요!");
      return;
    }
    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(searchKey, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const newLat = result[0].y;
        const newLng = result[0].x;

        // 검색된 주소에서 '구' 또는 '동' 이름 추출 (DB의 location 규격에 맞게 선택)
        // address_name 전체를 쓰거나, region_2depth_name(구 단위)을 사용하세요.
        const regionName =
          result[0].address.region_2depth_name ||
          result[0].address.region_3depth_name;

        setItem((prev) => ({
          ...prev,
          lat: parseFloat(newLat),
          lng: parseFloat(newLng),
          location: regionName, // 검색된 지역명을 location에 자동 할당
        }));
      } else {
        alert("검색 결과가 없습니다.");
      }
    });
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>상품 등록</h2>

        <div className="form-group">
          <label>판매자</label>
          <input
            type="text"
            value={`${loginState.nickname} (${loginState.email})`}
            readOnly
            className="read-only-input"
          />
        </div>

        <div className="form-group">
          <label>제목</label>
          <input
            name="title"
            type="text"
            value={item.title}
            onChange={handleChangeItem}
            placeholder="상품 제목을 입력하세요"
          />
        </div>

        <div className="form-group">
          <label>가격</label>
          <input
            name="price"
            type="number"
            value={item.price}
            onChange={handleChangeItem}
          />
        </div>

        <div className="form-group">
          <label>카테고리</label>
          <select
            name="category"
            value={item.category}
            onChange={handleChangeItem}
          >
            <option value="">선택하세요</option>
            <option value="electronics">전자제품</option>
            <option value="clothing">의류</option>
            <option value="sports">스포츠</option>
            <option value="books">도서</option>
            <option value="health">건강식품</option>
            <option value="furniture">가구</option>
          </select>
        </div>

        <div className="form-group">
          <label>거래 희망 장소 (검색 후 마커를 조정하세요)</label>

          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <input
              type="text"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchAddress()}
              placeholder="동네 이름이나 주소 검색 (예: 강남역, 화양동)"
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <button
              type="button"
              onClick={handleSearchAddress}
              style={{
                padding: "8px 15px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
            >
              검색
            </button>
          </div>

          <div style={{ width: "100%", height: "300px", marginBottom: "10px" }}>
            <Map
              center={{ lat: item.lat, lng: item.lng }}
              style={{ width: "100%", height: "100%", borderRadius: "8px" }}
              level={3}
            >
              <MapMarker
                position={{ lat: item.lat, lng: item.lng }}
                draggable={true}
                onDragEnd={(marker) => {
                  const newLat = marker.getPosition().getLat();
                  const newLng = marker.getPosition().getLng();

                  // 마커를 직접 옮겼을 때도 해당 위치의 주소를 가져와서 location 업데이트 가능 (역지오코딩)
                  const geocoder = new window.kakao.maps.services.Geocoder();
                  geocoder.coord2Address(newLng, newLat, (result, status) => {
                    if (status === window.kakao.maps.services.Status.OK) {
                      const regionName = result[0].address.region_2depth_name;
                      setItem((prev) => ({
                        ...prev,
                        lat: newLat,
                        lng: newLng,
                        location: regionName,
                      }));
                    }
                  });
                }}
              />
            </Map>
          </div>

          {/* 현재 선택된 지역 확인용 (수정 가능하게 하려면 input으로 두셔도 됩니다) */}
          <div style={{ marginTop: "5px" }}>
            <span
              style={{ fontSize: "13px", fontWeight: "bold", color: "#2d8cf0" }}
            >
              설정된 지역:{" "}
              {item.location || "지도에서 검색하거나 마커를 옮겨주세요."}
            </span>
            <input type="hidden" name="location" value={item.location} />
          </div>
        </div>

        <div className="form-group">
          <label>상세 설명</label>
          <textarea
            name="content"
            value={item.content}
            onChange={handleChangeItem}
            rows="5"
            placeholder="상품에 대한 상세 설명을 작성해주세요"
          ></textarea>
        </div>

        <div className="form-group">
          <label>이미지 첨부</label>
          <input
            ref={uploadRef}
            type="file"
            multiple={true}
            accept="image/*"
            onChange={handleFileChange}
            id="file-upload"
          />
          <label htmlFor="file-upload" className="file-label">
            이미지 선택하기
          </label>
        </div>

        {/* 이미지 미리보기 영역 */}
        {imagePreviews.length > 0 && (
          <div className="image-preview-container">
            {imagePreviews.map((imgObj, index) => (
              <div key={index} className="preview-item">
                <img src={imgObj.url} alt={`preview-${index}`} />
                <button
                  type="button"
                  className="remove-prev-btn"
                  onClick={() => removeImage(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="button-group">
          <button
            className="submit-btn"
            type="button"
            onClick={handleClickAdd}
            disabled={fetching}
          >
            {fetching ? "등록 중..." : "상품 등록하기"}
          </button>
          <button
            className="submit-btn"
            type="button"
            onClick={() => navigate(-1)}
            disabled={fetching}
          >
            취소하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemBoardRegister;
