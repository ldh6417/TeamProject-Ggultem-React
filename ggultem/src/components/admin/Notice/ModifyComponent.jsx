import { useEffect, useState, useRef } from "react";
import { getOne, putOne } from "../../../api/admin/NoticeApi";
import { API_SERVER_HOST } from "../../../api/config";
import useCustomMove from "../../../hooks/useCustomMove";
import "./ModifyComponent.css";

const ModifyComponent = ({ noticeId }) => {
  const [notice, setNotice] = useState({
    noticeId: 0,
    title: "",
    content: "",
    isPinned: 0,
    uploadFileNames: [],
  });

  const [newFiles, setNewFiles] = useState([]);
  const [delFileNames, setDelFileNames] = useState([]);
  const uploadRef = useRef();
  const { moveToAdminNoticeRead, moveToAdminNoticeList } = useCustomMove();

  useEffect(() => {
    getOne(noticeId).then((data) => setNotice(data));
  }, [noticeId]);

  const handleChangeNotice = (e) => {
    const { name, value, type, checked } = e.target;
    setNotice({
      ...notice,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const removeOldImage = (fileName) => {
    setDelFileNames((prev) => [...prev, fileName]); // 수정: 함수형 업데이트
    setNotice({
      ...notice,
      uploadFileNames: notice.uploadFileNames.filter(
        (name) => name !== fileName,
      ),
    });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    // setNewFiles도 함수형 업데이트로!
    setNewFiles((prevNewFiles) => [...prevNewFiles, ...selectedFiles]);
    uploadRef.current.value = "";
  };

  const removeNewFile = (index) => {
    setNewFiles(newFiles.filter((_, i) => i !== index));
  };

  const handleClickModify = () => {
    const formData = new FormData();
    newFiles.forEach((file) => formData.append("files", file));

    // 수정: 배열을 그대로 보내지 않고 하나씩 append
    delFileNames.forEach((name) => formData.append("delFileNames", name));

    // 추가: 기존 파일 유지 정보 전달 (핵심)
    notice.uploadFileNames.forEach((name) =>
      formData.append("keepFileNames", name),
    );

    formData.append("title", notice.title);
    formData.append("content", notice.content);
    formData.append("isPinned", notice.isPinned);

    putOne(noticeId, formData).then((data) => {
      if (data.RESULT === "SUCCESS") {
        alert("수정이 완료되었습니다.");
        moveToAdminNoticeRead(noticeId);
      }
    });
  };

  return (
    <div className="notice-modify-wrapper">
      <div className="notice-modify-container">
        <h2 className="notice-modify-title">공지사항 수정 관리</h2>
        <div className="notice-modify-form">
          <div className="form-group">
            <label>제목</label>
            <input
              name="title"
              className="form-input"
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
              <span className="checkbox-text">이 게시글을 상단에 고정함</span>
            </label>
          </div>

          <div className="form-group">
            <label>내용</label>
            <textarea
              name="content"
              className="form-textarea"
              value={notice.content}
              onChange={handleChangeNotice}
            />
          </div>

          <div className="form-group">
            <label>기존 이미지 (X 클릭 시 삭제)</label>
            <div className="image-preview-list">
              {notice.uploadFileNames.map((fileName, i) => (
                <div key={i} className="image-preview-item">
                  <img
                    src={`${API_SERVER_HOST}/admin/notice/view/s_${fileName}`}
                    alt="기존이미지"
                  />
                  <button
                    type="button"
                    className="btn-del"
                    onClick={() => removeOldImage(fileName)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>새 이미지 추가 (선택)</label>
            <input
              ref={uploadRef}
              type="file"
              multiple
              className="form-file"
              onChange={handleFileChange}
            />
            <div className="image-preview-list">
              {newFiles.map((file, i) => (
                <div key={i} className="image-preview-item">
                  {/* ★ 새 이미지 미리보기 적용됨 */}
                  <img
                    src={URL.createObjectURL(file)}
                    alt="새미리보기"
                    onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                  />
                  <div className="file-name-badge">{file.name}</div>
                  <button
                    type="button"
                    className="btn-del"
                    onClick={() => removeNewFile(i)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button className="cancel-btn" onClick={moveToAdminNoticeList}>
              목록으로
            </button>
            <button className="submit-btn" onClick={handleClickModify}>
              저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyComponent;
