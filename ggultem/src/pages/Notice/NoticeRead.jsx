import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOne } from "../../api/NoticeApi";
import { API_SERVER_HOST } from "../../api/config";
import useCustomMove from "../../hooks/useCustomMove";
import "./NoticeRead.css"; // CSS 파일 연결 확인!
import useReport from "../../hooks/useReport";
import ReportModal from "../../common/ReportModal";
import Header from "../../include/Header";
import Footer from "../../include/Footer";

const NoticeRead = () => {
  const { noticeId } = useParams();
  const { moveToNoticeList } = useCustomMove();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  //
  const { showModal, setShowModal, sendReport } = useReport();

  useEffect(() => {
    getOne(noticeId)
      .then((data) => {
        setNotice(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [noticeId]);

  if (loading) return <div className="loading-container">로딩 중...</div>;
  if (!notice)
    return <div className="error-container">데이터를 찾을 수 없습니다.</div>;

  //
  // notice 데이터 로드 후 세팅
  const targetData = {
    targetType: "NOTICE",
    targetNo: noticeId,
    targetMemberId: notice.memberEmail, // 작성자 이메일로 비교
  };

  return (
    <div className="notice-read-wrapper">
      <Header />
      <div className="notice-read-container">
        {/* 1. 헤더 */}
        <div className="notice-read-header">
          {/* 상단 고정 뱃지 추가 */}
          {notice.isPinned === 1 && (
            <span className="read-pinned-badge">상단 고정 공지</span>
          )}
          <h2 className="notice-read-title">{notice.title || "제목 없음"}</h2>
          <div className="notice-read-meta">
            <span className="meta-writer">
              작성자: {notice.writer || "관리자"}
            </span>
            <span className="meta-item">조회수 {notice.viewCount || 0}</span>
            <span className="meta-item">
              등록일{" "}
              {notice.regDate ? notice.regDate.substring(0, 10) : "날짜 없음"}
            </span>
          </div>
        </div>

        {/* 2. 이미지 영역 */}
        {notice.uploadFileNames && notice.uploadFileNames.length > 0 && (
          <div className="notice-read-images">
            {notice.uploadFileNames.map((imgName, i) => (
              <div key={i} className="notice-img-box">
                <img
                  src={`${API_SERVER_HOST}/admin/notice/view/${imgName}`}
                  alt={`첨부이미지-${i + 1}`}
                  className="notice-read-img"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* 3. 본문 내용 */}
        <div className="notice-read-content">
          {notice.content || "내용이 없습니다."}
        </div>

        {/* 4. 푸터(버튼) */}
        <div className="notice-read-footer">
          <button className="btn-back" onClick={() => moveToNoticeList()}>
            목록으로 돌아가기
          </button>
          {/* 🚨 신고 버튼 등장! */}
          <button onClick={() => setShowModal(true)} className="btn-report">
            🚨 신고하기(테스트)
          </button>
        </div>

        <ReportModal
          show={showModal}
          targetData={targetData}
          callbackFn={() => setShowModal(false)}
          submitFn={sendReport}
        />
      </div>
      <Footer />
    </div>
  );
};

export default NoticeRead;
