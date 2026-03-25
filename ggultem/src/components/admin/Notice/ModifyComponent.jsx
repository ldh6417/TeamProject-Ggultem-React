import { useEffect, useState, useRef } from "react";
import { getOne, putOne, API_SERVER_HOST } from "../../../api/admin/NoticeApi";
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

  const uploadRef = useRef();
  const { moveToAdminNoticeRead, moveToAdminNoticeList } = useCustomMove();

  useEffect(() => {
    getOne(noticeId).then((data) => {
      console.log("불러온 데이터:", data);
      setNotice(data);
    });
  }, [noticeId]);

  const handleChangeNotice = (e) => {
    const { name, value, type, checked } = e.target;

    setNotice({
      ...notice,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleClickModify = () => {
    const formData = new FormData();

    if (uploadRef.current && uploadRef.current.files) {
      const files = uploadRef.current.files;
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
    }

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
          {/* 제목 입력 */}
          <div className="form-group">
            <label>제목</label>
            <input
              name="title"
              className="form-input"
              value={notice.title}
              onChange={handleChangeNotice}
              placeholder="제목을 입력하세요"
            />
          </div>

          {/* 📌 상단 고정 체크박스 (클래스 적용) */}
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

          {/* 내용 입력 */}
          <div className="form-group">
            <label>내용</label>
            <textarea
              name="content"
              className="form-textarea"
              value={notice.content}
              onChange={handleChangeNotice}
              placeholder="내용을 입력하세요"
            />
          </div>

          {/* 기존 이미지 미리보기 */}
          <div className="form-group">
            <label>기존 이미지</label>
            <div className="image-preview-list">
              {notice.uploadFileNames &&
                notice.uploadFileNames.map((fileName, i) => (
                  <div key={i} className="image-preview-item">
                    <img
                      src={`${API_SERVER_HOST}/admin/notice/view/s_${fileName}`}
                      alt="기존이미지"
                      onError={(e) =>
                        console.log(`${fileName} 이미지 로딩 실패`)
                      }
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* 새 이미지 추가 */}
          <div className="form-group">
            <label>새 이미지 추가 (선택)</label>
            <input
              ref={uploadRef}
              type="file"
              multiple
              className="form-file"
              accept="image/*"
            />
          </div>

          {/* 버튼 그룹 */}
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
