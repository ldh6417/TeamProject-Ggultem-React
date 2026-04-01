import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { postAdd, API_SERVER_HOST } from "../../../api/BannerApi";
import "./RegisterComponent.css";

const host = API_SERVER_HOST;

const initState = {
  title: "",
  content: "",
  link: "",
  enabled: 0,
  regDate: null,
  endDate: null,
  files: [],
  uploadFileNames: [],
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const uploadRef = useRef();

  const [fetching, setFetching] = useState(false);
  const [banner, setBanner] = useState({ ...initState });
  const [imagePreviews, setImagePreviews] = useState([]);

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
    setBanner({ ...banner, [e.target.name]: e.target.value });
  };

  const handleClickAdd = () => {
    console.log("현재 banner 상태:", banner);
    const formData = new FormData();

    // 이미지 추가
    imagePreviews.forEach((imgObj) => {
      formData.append("files", imgObj.file);
    });

    // 2. DTO 필드명과 일치시키기 (중요)
    formData.append("title", banner.title);
    formData.append("content", banner.content);
    formData.append("link", banner.link);

    formData.append("endDate", banner.endDate || "9999-12-31 23:59:59");

    console.log("폼데이터 확인용:", formData.get("endDate"));

    setFetching(true);
    postAdd(formData)
      .then((data) => {
        setFetching(false);
        alert("등록 완료!");
        navigate("/admin/banner/list");
      })
      .catch((err) => {
        setFetching(false);
        console.error("에러 상세:", err.response?.data);
        alert("등록 중 오류 발생!");
      });
  };

  return (
    <div className="banner-register-container">
      <div className="banner-register-form">
        <h2 className="banner-form-title">광고 배너 등록</h2>

        <div className="banner-form-row">
          <div className="banner-form-group">
            <label>배너 제목</label>
            <input
              name="title"
              type="text"
              value={banner.title}
              onChange={handleChangeItem}
              placeholder="배너 제목"
            />
          </div>

          {/* 🚩 배너 종료일 설정 영역 */}
          <div className="banner-form-group">
            <label>광고 종료일</label>
            <input
              name="endDate"
              type="datetime-local"
              value={banner.endDate || ""}
              onChange={handleChangeItem}
              // 현재 시간(분 단위까지) 이전은 선택 못하게 설정
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        </div>

        <div className="banner-form-group">
          <label>실제 배너 URL</label>
          <input
            name="link"
            type="text"
            value={banner.link}
            onChange={handleChangeItem}
            placeholder="배너에 연결할 URL을 입력해 주세요"
          ></input>
        </div>
        <div className="banner-form-group">
          <label>상세 설명</label>
          <textarea
            name="content"
            value={banner.content}
            onChange={handleChangeItem}
            rows="6"
            placeholder="배너에 대한 설명을 작성해주세요."
          ></textarea>
        </div>

        <div className="banner-form-group">
          <label>배너 이미지</label>
          <input
            ref={uploadRef}
            type="file"
            multiple={true}
            accept="image/*"
            onChange={handleFileChange}
            id="banner-file-upload"
            hidden
          />
          <label htmlFor="banner-file-upload" className="banner-file-label">
            파일 탐색기 열기
          </label>
        </div>

        {/* 이미지 미리보기 */}
        {imagePreviews.length > 0 && (
          <div className="banner-image-preview-container">
            {imagePreviews.map((imgObj, index) => (
              <div key={index} className="banner-preview-item">
                <img src={imgObj.url} alt={`preview-${index}`} />
                <button type="button" onClick={() => removeImage(index)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="banner-button-group">
          <button
            className="banner-submit-btn"
            type="button"
            onClick={handleClickAdd}
            disabled={fetching}
          >
            {fetching ? "등록 처리 중..." : "배너 등록"}
          </button>
          <button
            className="banner-cancel-btn"
            type="button"
            onClick={() => navigate(-1)}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
