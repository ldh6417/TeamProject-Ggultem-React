import { useRef, useState, useEffect } from "react";
import { postAdd, API_SERVER_HOST } from "../../api/ItemBoardApi"; // API_SERVER_HOST 추가
import { useNavigate } from "react-router";
import { getListByGroup } from "../../api/admin/CodeDetailApi"; // 상세 코드 API 추가
import useCustomLogin from "../../hooks/useCustomLogin";
import axios from "axios";
import "./ItemBoardRegisterComponent.css";

const host = API_SERVER_HOST;

const initState = {
  title: "",
  price: 0,
  content: "",
  category: "",
  location: "",
};

const ItemBoardRegister = () => {
  const { loginState, isLogin, moveToLogin } = useCustomLogin();
  const navigate = useNavigate();
  const uploadRef = useRef();

  const [fetching, setFetching] = useState(false);
  const [item, setItem] = useState({ ...initState });
  const [imagePreviews, setImagePreviews] = useState([]);

  // ✅ DB에서 가져올 공통 코드 상태
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  // 1️⃣ 로그인 체크 및 공통 코드 데이터 로드
  useEffect(() => {
    if (!isLogin) {
      alert("로그인이 필요한 서비스입니다.");
      moveToLogin();
      return;
    }

    // 필터링 했을때 1페이지에 몰아서 보이게
    const pageParam = { page: 1, size: 100 };

    axios
      .get(`${host}/api/codegroup/list`, { params: pageParam })
      .then((res) => {
        const allGroups = res.data.dtoList || [];

        allGroups.forEach((group) => {
          const gCode = group.groupCode.toUpperCase();

          if (gCode.includes("ITEM_CATEGORY") || gCode.includes("ITEM_CAT")) {
            getListByGroup(pageParam, group.groupCode).then((data) => {
              if (data?.dtoList) {
                setCategories(data.dtoList);
              }
            });
          }

          if (gCode.includes("ITEM_LOCATION") || gCode.includes("ITEM_LOC")) {
            getListByGroup(pageParam, group.groupCode).then((data) => {
              if (data?.dtoList) {
                setLocations(data.dtoList);
              }
            });
          }
        });
      })
      .catch((err) => console.error("코드 로드 실패:", err));
  }, [isLogin, moveToLogin]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => {
      const target = prev[index];
      URL.revokeObjectURL(target.url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleChangeItem = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleClickAdd = () => {
    if (!loginState.email) {
      alert("로그인 정보가 없습니다.");
      return;
    }

    const formData = new FormData();
    imagePreviews.forEach((imgObj) => {
      formData.append("files", imgObj.file);
    });

    formData.append("email", loginState.email);
    formData.append("writer", loginState.nickname || loginState.name);
    formData.append("title", item.title);
    formData.append("price", Number(item.price));
    formData.append("content", item.content);
    formData.append("category", item.category);
    formData.append("location", item.location);

    setFetching(true);
    postAdd(formData)
      .then(() => {
        setFetching(false);
        alert("등록 완료!");
        navigate("/itemBoard/list");
      })
      .catch((err) => {
        setFetching(false);
        alert("등록 중 오류 발생!");
      });
  };

  if (!isLogin) return null;

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

        {/* ✅ 카테고리 셀렉트박스 (DB 연동) */}
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

        {/* ✅ 거래 지역 셀렉트박스 (DB 연동) */}
        <div className="form-group">
          <label>거래 지역</label>
          <select
            name="location"
            value={item.location}
            onChange={handleChangeItem}
          >
            <option value="">지역 선택</option>
            {locations.map((code) => (
              <option key={code.codeValue} value={code.codeValue}>
                {code.codeName}
              </option>
            ))}
          </select>
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
