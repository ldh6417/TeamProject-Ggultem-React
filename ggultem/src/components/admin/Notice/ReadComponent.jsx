import { useEffect, useState } from "react";
import { getOne, API_SERVER_HOST } from "../../../api/admin/NoticeApi";
import useCustomMove from "../../../hooks/useCustomMove";
import "./ReadComponent.css";
import RemoveComponent from "./RemoveComponent";

const initState = {
  noticeId: 0,
  title: "",
  content: "",
  writer: "",
  regDate: "",
  visitCount: 0,
  uploadFileNames: [],
  isPinned: 0,
};

const ReadComponent = ({ noticeId }) => {
  const [notice, setNotice] = useState(initState);
  const { moveToAdminNoticeList, moveToAdminNoticeModify } = useCustomMove();

  useEffect(() => {
    getOne(noticeId).then((data) => {
      setNotice(data);
    });
  }, [noticeId]);

  return (
    <div className="notice-read-wrapper">
      <div className="notice-read-container">
        {/* 상단 헤더: 제목 및 정보 */}
        <div className="notice-header">
          <div className="title-group">
            {/* 📌 상단 고정 뱃지 */}
            {notice.isPinned === 1 && (
              <span className="pinned-badge">상단 고정 공지</span>
            )}

            <h2 className="notice-title">
              {notice.title || "제목을 불러오는 중..."}
            </h2>
            <div className="notice-info-group">
              <span>
                작성자: <b className="nickname-badge">{notice.writer}</b>
              </span>
              <span>조회수: {notice.visitCount}</span>
              <span>등록일: {notice.regDate}</span>
            </div>
          </div>
        </div>

        {/* 본문 내용 */}
        <div className="notice-content-section">{notice.content}</div>

        {/* 이미지 출력 영역 */}
        <div className="notice-image-list">
          {/* 1. 배열이 있는지 먼저 확인 */}
          {notice.uploadFileNames && notice.uploadFileNames.length > 0
            ? notice.uploadFileNames
                // 2. 유효하지 않은 파일명(빈값, null 문자열, 공백 등)을 걸러냄
                .filter(
                  (fileName) =>
                    fileName && fileName.trim() !== "" && fileName !== "null",
                )
                // 3. 필터링된 결과가 있을 때만 map 실행
                .map((fileName, i) => (
                  <div key={i} className="notice-image-box">
                    <img
                      className="notice-image-item"
                      src={`${API_SERVER_HOST}/admin/notice/view/${fileName}`}
                      alt={`공지이미지-${i}`}
                    />
                  </div>
                ))
            : null}
        </div>

        {/* 하단 버튼 그룹 */}
        <div className="notice-read-actions">
          <button
            className="admin-btn list-btn"
            onClick={moveToAdminNoticeList}
          >
            목록으로
          </button>
          <button
            className="admin-btn modify-btn"
            onClick={() => moveToAdminNoticeModify(noticeId)}
          >
            수정하기
          </button>
          <RemoveComponent noticeId={noticeId} />
        </div>
      </div>
    </div>
  );
};

export default ReadComponent;
