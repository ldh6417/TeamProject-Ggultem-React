import { useRef, useState, useEffect } from "react";
import { postItemBoardModify, getOne } from "../../../api/BusinessApi";
import { useNavigate } from "react-router";
import useCustomLogin from "../../../hooks/useCustomLogin";
import "./RegisterComponent.css";

const initState = {
  title: "",
  price: 0,
  content: "",
  category: "",
  email: "",
  writer: "",
  moveUrl: "",
  sign: false,
  regDate: null,
  endDate: "",
  files: [],
  uploadFileNames: [],
};

const ModifyComponent = ({ no }) => {
  const navigate = useNavigate();
  const uploadRef = useRef();

  const [fetching, setFetching] = useState(false);
  const [item, setItem] = useState({ ...initState });
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    getOne(no).then((data) => {
      setItem(data);
      if (data.uploadFileNames && data.uploadFileNames.length > 0) {
        const serverPreviews = data.uploadFileNames.map((fileName) => ({
          file: null, // 기존 파일은 File 객체가 없음
          url: `https://api.ggultem.shop/business/board/view/${fileName}`, // 서버 이미지 경로
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
      const updatedFileNames = item.uploadFileNames.filter(
        (name) => name !== target.fileName,
      );

      // item 상태를 업데이트하여 나중에 handleClickModify에서
      // 줄어든 리스트가 formData에 담기게 합니다.
      setItem((prev) => ({
        ...prev,
        uploadFileNames: updatedFileNames,
      }));
    }

    // 3. 화면 미리보기 리스트에서 제거
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangeItem = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleClickModify = () => {
    console.log("현재 item 상태:", item);
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
    if (item.uploadFileNames) {
      item.uploadFileNames.forEach((name) => {
        formData.append("uploadFileNames", name);
      });
    }

    // 2. DTO 필드명과 일치시키기 (중요)
    formData.append("email", item.email); // 백엔드 ItemBoardDTO의 private String email; 과 매칭
    formData.append("writer", item.writer);
    formData.append("title", item.title);
    formData.append("price", Number(item.price));
    formData.append("content", item.content);
    formData.append("category", item.category);
    formData.append("moveUrl", item.moveUrl);

    // 4. 날짜 형식 보정 (LocalDateTime에 맞게 T 추가 및 공백 제거)
    let formattedDate = item.endDate;
    if (formattedDate) {
      // ' '를 'T'로 바꾸고, 초 정보가 없다면 붙여줍니다.
      formattedDate = formattedDate.replace(" ", "T");
      if (formattedDate.length === 16) formattedDate += ":00";
    } else {
      formattedDate = "9999-12-31T23:59:59";
    }
    formData.append("endDate", formattedDate);

    console.log("폼데이터 확인용:", formData.get("endDate"));

    setFetching(true);
    postItemBoardModify(no, formData)
      .then((data) => {
        setFetching(false);
        alert("수정 완료! 관리자 승인 후 게시됩니다. 🍯");
        navigate(`/business/board/${no}`);
      })
      .catch((err) => {
        setFetching(false);
        // 서버에서 보낸 상세 에러 메시지 출력
        console.error("에러 상세:", err.response?.data);
        alert("등록 중 오류 발생!");
      });
  };

  return (
    <div className="business-register-container">
      <div className="business-register-form">
        <h2 className="business-form-title">광고 상품 수정</h2>

        <div className="business-form-group">
          <label>판매자 정보</label>
          <input
            type="text"
            value={`${item.writer} (${item.email})`}
            readOnly
            className="business-read-only-input"
          />
        </div>

        <div className="business-form-row">
          <div className="business-form-group">
            <label>상품 제목</label>
            <input
              name="title"
              type="text"
              value={item.title}
              onChange={handleChangeItem}
              placeholder="노출될 상품 제목"
            />
          </div>
          <div className="business-form-group">
            <label>광고 종류</label>
            <input
              name="category"
              type="text"
              value={item.category}
              readOnly
              className="business-read-only-input"
            />
          </div>
        </div>

        <div className="business-form-row">
          <div className="business-form-group">
            <label>판매 가격 (원)</label>
            <input
              name="price"
              type="number"
              value={item.price}
              onChange={handleChangeItem}
            />
          </div>
          {/* 🚩 광고 종료일 설정 영역 */}
          <div className="business-form-group">
            <label>광고 종료일</label>
            <input
              name="endDate"
              type="datetime-local"
              value={item.endDate || ""}
              onChange={handleChangeItem}
              // 현재 시간(분 단위까지) 이전은 선택 못하게 설정
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        </div>

        <div className="business-form-group">
          <label>실제 상품 URL</label>
          <input
            name="moveUrl"
            type="text"
            value={item.moveUrl}
            onChange={handleChangeItem}
            placeholder="상품을 연결할 URL을 입력해 주세요"
          ></input>
        </div>
        <div className="business-form-group">
          <label>상세 설명</label>
          <textarea
            name="content"
            value={item.content}
            onChange={handleChangeItem}
            rows="6"
            placeholder="상품에 대한 전문적인 설명을 작성해주세요."
          ></textarea>
        </div>

        <div className="business-form-group">
          <label>상품 이미지 (다중 선택 가능)</label>
          <input
            ref={uploadRef}
            type="file"
            multiple={true}
            accept="image/*"
            onChange={handleFileChange}
            id="business-file-upload"
            hidden
          />
          <label htmlFor="business-file-upload" className="business-file-label">
            파일 탐색기 열기
          </label>
        </div>

        {/* 이미지 미리보기 */}
        {imagePreviews.length > 0 && (
          <div className="business-image-preview-container">
            {imagePreviews.map((imgObj, index) => (
              <div key={index} className="business-preview-item">
                <img src={imgObj.url} alt={`preview-${index}`} />
                <button type="button" onClick={() => removeImage(index)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="business-button-group">
          <button
            className="business-submit-btn"
            type="button"
            onClick={handleClickModify}
            disabled={fetching}
          >
            {fetching ? "수정 처리중 ..." : "광고 수정 승인 요청"}
          </button>
          <button
            className="business-cancel-btn"
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
