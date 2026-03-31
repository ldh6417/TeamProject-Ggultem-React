import { useRef, useState } from "react";
import { postAdd } from "../../../api/NoticeApi"; // ✅ config.js 대신 noticeApi.js에서 가져오기
import useCustomMove from "../../../hooks/useCustomMove";
import "./RegisterComponent.css";

const RegisterComponent = () => {
  const [notice, setNotice] = useState({
    title: "",
    content: "",
    isPinned: 0,
  });

  const [files, setFiles] = useState([]);
  const uploadRef = useRef();
  const { moveToAdminNoticeList } = useCustomMove();

  const handleChangeNotice = (e) => {
    const { name, value, type, checked } = e.target;
    setNotice({
      ...notice,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    if (uploadRef.current) uploadRef.current.value = "";
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleClickAdd = () => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("title", notice.title);
    formData.append("content", notice.content);
    formData.append("memberEmail", "admin@honey.com");
    formData.append("enabled", 1);
    formData.append("isPinned", notice.isPinned);

    postAdd(formData)
      .then(() => {
        alert("공지사항이 등록되었습니다.");
        moveToAdminNoticeList();
      })
      .catch(() => {
        alert("등록에 실패했습니다.");
      });
  };

  return (
    <div className="notice-reg-wrapper">
      <div className="notice-reg-container">
        <h2 className="notice-reg-title">공지사항 등록</h2>
        <div className="notice-reg-form">
          <div className="form-group">
            <label>제목</label>
            <input
              className="form-input"
              name="title"
              type="text"
              value={notice.title}
              onChange={handleChangeNotice}
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isPinned"
                checked={notice.isPinned === 1}
                onChange={handleChangeNotice}
              />
              <span className="checkbox-text">
                상단 고정 공지로 설정 (활성화)
              </span>
            </label>
          </div>

          <div className="form-group">
            <label>내용</label>
            <textarea
              className="form-textarea"
              name="content"
              value={notice.content}
              onChange={handleChangeNotice}
            />
          </div>

          <div className="form-group">
            <label>이미지 첨부</label>
            <input
              ref={uploadRef}
              className="form-file"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
            <div className="image-preview-list">
              {files.map((file, i) => (
                <div key={i} className="image-preview-item">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="미리보기"
                    onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                  />
                  <div className="file-name-badge">{file.name}</div>
                  <button
                    type="button"
                    className="btn-del"
                    onClick={() => removeFile(i)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button className="cancel-btn" onClick={moveToAdminNoticeList}>
              취소
            </button>
            <button className="submit-btn" onClick={handleClickAdd}>
              등록하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterComponent;
