import { useEffect, useState } from "react";
// 1. API 함수(getList)는 NoticeApi에서 가져옵니다.
import { getList } from "../../api/NoticeApi";
// 2. 주소 변수(API_SERVER_HOST)는 config에서 직접 가져옵니다.
import { API_SERVER_HOST } from "../../api/config";

import useCustomMove from "../../hooks/useCustomMove";
import PageComponent from "../common/PageComponent";
import "./NoticeComponent.css";

const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totoalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0,
};

const host = API_SERVER_HOST;

const NoticeComponent = () => {
  const {
    page,
    size,
    keyword,
    searchType,
    refresh,
    moveToNoticeList,
    moveToNoticeRead,
  } = useCustomMove();
  const [serverData, setServerData] = useState(initState);

  useEffect(() => {
    getList({ page, size, keyword, searchType, refresh }).then((data) => {
      console.log(data);
      setServerData(data);
    });
  }, [page, size, keyword, searchType, refresh]);

  return (
    <div className="board-list-wrapper">
      <div className="board-list-container">
        {/* 상단 헤더 섹션 */}
        <div className="board-header">
          <h2 className="board-title">📢 공지사항</h2>
          <p className="board-subtitle">중요한 소식과 안내를 확인하세요.</p>

          <div className="board-actions">
            <span className="total-count">
              전체 게시글 {serverData.totalCount}개
            </span>
          </div>
        </div>

        {/* 게시판 테이블 영역 */}
        <div className="table-responsive">
          <table className="board-table">
            <thead>
              <tr>
                <th className="th-no">번호</th>
                <th className="th-title">제목</th>
                <th className="th-writer">작성자</th>
                <th className="th-date">등록일</th>
                <th className="th-views">조회</th>
              </tr>
            </thead>
            <tbody>
              {serverData.dtoList && serverData.dtoList.length > 0 ? (
                serverData.dtoList.map((notice) => (
                  <tr
                    key={notice.noticeId}
                    className={`board-row ${notice.isPinned === 1 ? "pinned-row" : ""}`}
                    onClick={() => moveToNoticeRead(notice.noticeId)}
                  >
                    <td className="td-no">
                      {notice.isPinned === 1 ? (
                        <span className="pinned-badge">공지</span>
                      ) : (
                        notice.noticeId
                      )}
                    </td>
                    <td className="td-title">
                      <div className="title-wrapper">
                        {/* 고정 공지 핀 아이콘만 남기고 이미지 아이콘은 제거 */}
                        {notice.isPinned === 1 && (
                          <span className="pinned-icon">📌</span>
                        )}
                        <span className="title-text">{notice.title}</span>
                      </div>
                    </td>
                    <td className="td-writer">{notice.writer}</td>
                    <td className="td-date">
                      {notice.regDate ? notice.regDate.substring(0, 10) : ""}
                    </td>
                    <td className="td-views">{notice.viewCount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-row">
                    등록된 공지사항이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-wrapper">
          <PageComponent serverData={serverData} movePage={moveToNoticeList} />
        </div>
      </div>
    </div>
  );
};

export default NoticeComponent;
