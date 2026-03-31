import { useEffect, useState } from "react";
import { getList } from "../../../api/NoticeApi";
import useCustomMove from "../../../hooks/useCustomMove";
import { useNavigate } from "react-router";
import PageComponent from "../../common/PageComponent";
import "./ListComponent.css";

const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0,
};

const AdminNoticeListComponent = () => {
  // 1. 사용할 함수들을 새로 정의한 이름으로 가져옵니다.
  const {
    page,
    size,
    keyword,
    searchType,
    refresh,
    moveToAdminNoticeList,
    moveToAdminNoticeRead,
    moveToAdminNoticeRegister,
  } = useCustomMove();
  const [serverData, setServerData] = useState(initState);
  const navigate = useNavigate();

  useEffect(() => {
    getList({ page, size, keyword, searchType }).then((data) => {
      setServerData(data);
    });
  }, [page, size, keyword, searchType, refresh]);

  return (
    <div className="notice-list-wrapper">
      <div className="notice-list-container">
        {/* 사라졌던 헤더 섹션 복구! */}
        <div className="notice-header">
          <div className="title-group">
            <h2 className="notice-title">
              <span className="notice-title-point">꿀템</span> 공지사항 관리
            </h2>
            <p className="notice-subtitle">
              꿀템 공지사항을 등록할 수 있는 게시판입니다.
            </p>
          </div>

          <div className="notice-actions">
            <button
              className="admin-btn add-btn"
              onClick={moveToAdminNoticeRegister} // navigate 대신 useCustomMove 함수 사용
            >
              공지사항 추가
            </button>
          </div>
        </div>

        {/* 테이블 영역 */}
        <table className="notice-table">
          <thead>
            <tr className="notice-tr">
              <th className="notice-table-th-no">번호</th>
              <th className="notice-table-th-title">제목</th>
              <th className="notice-table-th-regDate">작성일</th>
            </tr>
          </thead>
          <tbody>
            {serverData.dtoList.length > 0 ? (
              serverData.dtoList.map((notice) => (
                <tr
                  key={notice.noticeId}
                  // 고정 여부에 따라 pinned-row 클래스 동적 적용
                  className={`notice-tr ${notice.isPinned === 1 ? "pinned-row" : ""}`}
                  onClick={() => moveToAdminNoticeRead(notice.noticeId)}
                >
                  <td className="notice-table-td-no">
                    {/* 고정글은 아이콘 표시, 일반글은 번호 표시 */}
                    {notice.isPinned === 1 ? (
                      <span className="pinned-icon">📌</span>
                    ) : (
                      notice.noticeId
                    )}
                  </td>
                  <td className="notice-table-td-title">
                    {/* 인라인 스타일 대신 CSS 클래스(pinned-badge) 사용 */}
                    {notice.isPinned === 1 && (
                      <span className="pinned-badge">공지</span>
                    )}
                    <span className="notice-text">{notice.title}</span>
                  </td>
                  <td className="notice-table-td-regDate">{notice.regDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="empty-list">
                  등록된 공지사항이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="notice-pagination-wrapper">
          <PageComponent
            serverData={serverData}
            movePage={moveToAdminNoticeList}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminNoticeListComponent;
