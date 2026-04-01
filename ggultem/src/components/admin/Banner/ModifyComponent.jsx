import { useRef, useState, useEffect } from "react";
import { postBannerModify, getOne } from "../../../api/BannerApi";
import { useNavigate } from "react-router";
import "./ModifyComponent.css";

const initState = {
  no: 0,
  title: "",
  content: "",
  link: "",
  enabled: 0,
  regDate: null,
  endDate: null,
  files: [],
  uploadFileNames: [],
};

const ModifyComponent = ({ no }) => {
  const navigate = useNavigate();
  const uploadRef = useRef();

  const [fetching, setFetching] = useState(false);
  const [banner, setBanner] = useState({ ...initState });
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    getOne(no).then((data) => {
      setBanner(data);
      if (data.uploadFileNames && data.uploadFileNames.length > 0) {
        const serverPreviews = data.uploadFileNames.map((fileName) => ({
          file: null, // 기존 파일은 File 객체가 없음
          url: `http://localhost:8080/admin/banner/view/${fileName}`, // 서버 이미지 경로
          isServerFile: true, // 기존 파일임을 표시 (삭제 시 활용 가능)
          fileName: fileName, // 파일명 저장
        }));
        setImagePreviews(serverPreviews);
      }
    });
  }, [no]);

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
    const target = imagePreviews[index];

    // 1. 메모리 해제 (Blob URL인 경우)
    if (target.url.startsWith("blob:")) {
      URL.revokeObjectURL(target.url);
    }

    // 2. 서버에서 온 기존 이미지라면 item.uploadFileNames에서도 제거
    if (target.isServerFile) {
      const updatedFileNames = banner.uploadFileNames.filter(
        (name) => name !== target.fileName,
      );

      // item 상태를 업데이트하여 나중에 handleClickModify에서
      // 줄어든 리스트가 formData에 담기게 합니다.
      setBanner((prev) => ({
        ...prev,
        uploadFileNames: updatedFileNames,
      }));
    }

    // 3. 화면 미리보기 리스트에서 제거
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangeItem = (e) => {
    setBanner({ ...banner, [e.target.name]: e.target.value });
  };

  const handleClickModify = () => {
    const formData = new FormData();

    // 1. 이미지 처리 분기 (중요!)
    imagePreviews.forEach((imgObj) => {
      if (imgObj.file) {
        // 새로 추가된 '진짜 파일' 객체만 files에 담습니다.
        formData.append("files", imgObj.file);
      }
      // 기존 서버 이미지는 files에 담지 않습니다.
      // 이미 useEffect에서 item.uploadFileNames에 담겨 있습니다.
    });

    // 2. 유지할 기존 파일명 전송
    if (banner.uploadFileNames) {
      banner.uploadFileNames.forEach((name) => {
        formData.append("uploadFileNames", name);
      });
    }

    // 2. DTO 필드명과 일치시키기 (중요)
    formData.append("title", banner.title);
    formData.append("content", banner.content);
    formData.append("link", banner.link);
    formData.append("enabled", banner.enabled);

    formData.append("endDate", banner.endDate || "9999-12-31 23:59:59");

    // 4. 날짜 형식 보정 (LocalDateTime에 맞게 T 추가 및 공백 제거)
    let formattedDate = banner.endDate;
    if (formattedDate) {
      // ' '를 'T'로 바꾸고, 초 정보가 없다면 붙여줍니다.
      formattedDate = formattedDate.replace(" ", "T");
      if (formattedDate.length === 16) formattedDate += ":00";
    } else {
      formattedDate = "9999-12-31T23:59:59";
    }
    formData.append("endDate", formattedDate);

    setFetching(true);
    postBannerModify(no, formData)
      .then((data) => {
        setFetching(false);
        alert("배너 수정이 완료되었습니다.");
        navigate(`/admin/banner/${no}`);
      })
      .catch((err) => {
        setFetching(false);
        // 서버에서 보낸 상세 에러 메시지 출력
        console.error("에러 상세:", err.response?.data);
        alert("등록 중 오류 발생!");
      });
  };

  return (
    <div className="banner-register-container">
      <div className="banner-register-form">
        <h2 className="banner-form-title">광고 배너 수정</h2>

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

          {/* 🚩 광고 종료일 설정 영역 */}
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
          <label>실제 상품 URL</label>
          <input
            name="link"
            type="text"
            value={banner.link}
            onChange={handleChangeItem}
            placeholder="배너와 연결할 URL을 입력해 주세요"
          ></input>
        </div>
        <div className="banner-form-group">
          <label>배너 활성/비활성</label>
          <select
            name="enabled"
            value={banner.enabled}
            onChange={handleChangeItem}
          >
            <option value={"1"}>활성</option>
            <option value={"0"}>비활성</option>
          </select>
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
            onClick={handleClickModify}
            disabled={fetching}
          >
            {fetching ? "수정 처리중 ..." : "배너 수정"}
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

export default ModifyComponent;
