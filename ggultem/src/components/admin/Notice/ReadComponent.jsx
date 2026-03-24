import { useEffect, useState } from "react";
// 1. 관리자 전용 API 경로로 수정하고, 이미지 경로용 API_SERVER_HOST를 함께 가져옵니다.
import { getOne, API_SERVER_HOST } from "../../../api/admin/NoticeApi";
import useCustomMove from "../../../hooks/useCustomMove";
import "./ReadComponent.css";
import RemoveComponent from "./RemoveComponent";
//분리한 삭제 컴포넌트

const initState = {
  noticeId: 0,
  title: "",
  content: "",
  writer: "",
  regDate: "",
  visitCount: 0,
  uploadFileNames: [],
};

const ReadComponent = ({ noticeId }) => {
  const [notice, setNotice] = useState(initState);
  const { moveToAdminNoticeList, moveToAdminNoticeModify } = useCustomMove();

  useEffect(() => {
    // 자바 Service의 get(noticeId) 호출 -> 조회수 자동 증가됨
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
          {/* 이미지 */}
          {notice.uploadFileNames &&
            notice.uploadFileNames.map((fileName, i) => (
              <div key={i} className="notice-image-box">
                <img
                  className="notice-image-item"
                  // 상단에서 import한 API_SERVER_HOST를 사용하여 경로 완성
                  src={`${API_SERVER_HOST}/admin/notice/view/${fileName}`}
                  alt={`공지이미지-${i}`}
                />
              </div>
            ))}
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
          {/* 삭제 컴포넌트 */}
          <RemoveComponent noticeId={noticeId} />
        </div>
      </div>
    </div>
  );
};

export default ReadComponent;
