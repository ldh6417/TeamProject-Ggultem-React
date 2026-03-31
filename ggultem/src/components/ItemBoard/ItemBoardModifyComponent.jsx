import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { getOne, putOne, API_SERVER_HOST } from "../../api/ItemBoardApi";
import { getListByGroup } from "../../api/admin/CodeDetailApi";
import useCustomLogin from "../../hooks/useCustomLogin";
import axios from "axios";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import "./ItemBoardModifyComponent.css";

const host = API_SERVER_HOST;

const initState = {
  id: 0,
  title: "",
  price: 0,
  content: "",
  category: "",
  location: "",
  // 초기값 서울시청
  lat: 37.5665,
  lng: 126.978,
  uploadFileNames: [],
  status: "false",
};

const ItemBoardModifyComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loginState } = useCustomLogin();
  const uploadRef = useRef();

  const [item, setItem] = useState({ ...initState });
  const [fetching, setFetching] = useState(false);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    getOne(id).then((data) => {
      if (loginState.email !== data.email) {
        alert("수정 권한이 없습니다.");
        navigate(`/itemBoard/read/${id}`);
        return;
      }
      setItem(data);
      setFetching(false);
    });

    const pageParam = { page: 1, size: 100 };
    axios
      .get(`${host}/api/codegroup/list`, { params: pageParam })
      .then((res) => {
        const allGroups = res.data.dtoList || [];
        allGroups.forEach((group) => {
          const gCode = group.groupCode.toUpperCase();
          if (gCode.includes("ITEM_CATEGORY") || gCode.includes("ITEM_CAT")) {
            getListByGroup(pageParam, group.groupCode).then((data) => {
              if (data?.dtoList) setCategories(data.dtoList);
            });
          }
          if (gCode.includes("ITEM_LOCATION") || gCode.includes("ITEM_LOC")) {
            getListByGroup(pageParam, group.groupCode).then((data) => {
              if (data?.dtoList) setLocations(data.dtoList);
            });
          }
        });
      })
      .catch((err) => console.error("그룹 목록 로드 실패:", err));
  }, [id, loginState.email, navigate]);

  const handleChangeItem = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleClickRemoveFile = (fileName) => {
    const updatedFiles = item.uploadFileNames.filter(
      (name) => name !== fileName,
    );
    setItem({ ...item, uploadFileNames: updatedFiles });
  };

  const handleClickModify = () => {
    const files = uploadRef.current.files;
    const formData = new FormData();

    // 1. 새로 추가할 파일들이 있는 경우에만 추가
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
    }

    // 2. 일반 텍스트 데이터 추가
    formData.append("title", item.title);
    formData.append("price", Number(item.price));
    formData.append("content", item.content);
    formData.append("category", item.category);
    formData.append("location", item.location);
    formData.append("lat", item.lat);
    formData.append("lng", item.lng);

    const statusToSend =
      item.status === "판매완료" || item.status === "true" ? "true" : "false";
    formData.append("status", statusToSend);

    // 3. ⭐ 중요: 유지할 기존 파일명 리스트를 보냄
    // 만약 이미지를 삭제하지 않았다면 item.uploadFileNames에 기존 이름들이 그대로 들어있습니다.
    if (item.uploadFileNames && item.uploadFileNames.length > 0) {
      item.uploadFileNames.forEach((fileName) => {
        formData.append("uploadFileNames", fileName);
      });
    } else {
      // 만약 기존 이미지를 다 지우고 새로도 안 올렸다면 빈 값을 보내서 처리가 필요할 수 있음
      formData.append("uploadFileNames", []);
    }

    setFetching(true);
    putOne(id, formData)
      .then(() => {
        setFetching(false);
        alert("상품 정보가 수정되었습니다.");
        navigate(`/itemBoard/read/${id}`);
      })
      .catch((err) => {
        setFetching(false);
        console.error(err);
        alert("수정 중 오류가 발생했습니다.");
      });
  };
  // 주소 검색함수
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
    <div className="modify-container">
      <div className="modify-form">
        <h2>상품 정보 수정</h2>
        <div className="form-group">
          <label>제목</label>
          <input
            name="title"
            type="text"
            value={item.title}
            onChange={handleChangeItem}
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
            {categories.map((code) => (
              <option key={code.codeValue} value={code.codeValue}>
                {code.codeName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>판매 상태</label>
          <div className="status-radio-group">
            <label>
              <input
                type="radio"
                name="status"
                value="false"
                checked={item.status === "판매중" || item.status === "false"}
                onChange={handleChangeItem}
              />{" "}
              판매 중
            </label>
            <label>
              <input
                type="radio"
                name="status"
                value="true"
                checked={item.status === "판매완료" || item.status === "true"}
                onChange={handleChangeItem}
              />{" "}
              판매 완료
            </label>
          </div>
        </div>

        {/* 거래 희망 장소 섹션 - 구조 수정됨 */}
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
          {/* 현재 선택된 지역 텍스트 표시 */}
          <div
            style={{ fontSize: "14px", color: "#2d8cf0", fontWeight: "bold" }}
          >
            선택된 지역: {item.location}
          </div>
        </div>

        <div className="form-group">
          <label>상세 설명</label>
          <textarea
            name="content"
            value={item.content}
            onChange={handleChangeItem}
            rows="5"
          ></textarea>
        </div>
        <div className="form-group">
          <label>이미지 추가</label>
          <input ref={uploadRef} type="file" multiple={true} accept="image/*" />
        </div>
        <div className="form-group">
          <label>기존 이미지 (클릭 시 삭제)</label>
          <div className="modify-image-list">
            {item.uploadFileNames.map((fileName, idx) => (
              <div
                key={idx}
                className="modify-image-item"
                onClick={() => handleClickRemoveFile(fileName)}
              >
                <img src={`${host}/itemBoard/view/s_${fileName}`} alt="item" />
                <div className="delete-overlay">삭제</div>
              </div>
            ))}
          </div>
        </div>
        <div className="modify-btn-group">
          <button
            className="modify-submit-btn"
            onClick={handleClickModify}
            disabled={fetching}
          >
            수정 완료
          </button>
          <button className="modify-cancel-btn" onClick={() => navigate(-1)}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemBoardModifyComponent;
