import { useRef, useState, useEffect } from "react";
import { postAdd } from "../../api/ItemBoardApi";
import { useNavigate } from "react-router";
import useCustomLogin from "../../hooks/useCustomLogin";
import "./ItemBoardRegisterComponent.css";

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
    const formData = new FormData();

    // 미리보기 상태에 담긴 실제 파일(file)들을 추가
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
        alert("상품이 등록되었습니다!");
        navigate("/itemBoard/list");
      })
      .catch((err) => {
        setFetching(false);
        console.error(err);
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
            <option value="furniture">스포츠</option>
            <option value="furniture">도서</option>
            <option value="furniture">건강식품</option>
            <option value="furniture">가구</option>
          </select>
        </div>

        <div className="form-group">
          <label>거래 지역</label>
          <input
            name="location"
            type="text"
            value={item.location}
            onChange={handleChangeItem}
            placeholder="예: 서울시 강남구"
          />
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
