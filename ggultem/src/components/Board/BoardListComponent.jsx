import { useEffect, useState } from "react";
import { getList } from "../../api/BoardApi";
import useCustomMove from "../../hooks/useCustomMove";
import PageComponent from "../common/PageComponent";
import { useNavigate } from "react-router-dom";
import "./BoardListComponent.css";

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

const BoardList = () => {
  const { page, size, keyword, searchType, refresh, moveToBoardList } =
    useCustomMove();

  const [serverData, setServerData] = useState(initState);
  const navigate = useNavigate();

  //  검색 상태 (input용)
  const [localKeyword, setLocalKeyword] = useState(keyword || "");
  const [localType, setLocalType] = useState(searchType || "all");

  //  검색 버튼
  const handleSearch = (e) => {
    e.preventDefault();

    const cleanKeyword = localKeyword.trim();

    if (cleanKeyword === "") {
      moveToBoardList({
        page: 1,
        keyword: " ",
        searchType: "all",
      });
    } else {
      moveToBoardList({
        page: 1,
        keyword: cleanKeyword,
        searchType: localType,
      });
    }

    setLocalKeyword("");
  };

  //  데이터 조회 (핵심)
  useEffect(() => {
    const cleanKeyword = keyword?.trim();

    getList({
      page,
      size,
      keyword: cleanKeyword === "" ? null : cleanKeyword,
      searchType: cleanKeyword === "" ? null : searchType,
    }).then((data) => {
      setServerData(data);
    });
  }, [page, size, keyword, searchType, refresh]);

  return (
    <div className="board-list-wrapper">
      <div className="board-list-container">
        {/* 헤더 */}
        <div className="board-header">
          <h2 className="board-title">꿀템 커뮤니티</h2>
          <p className="board-subtitle">
            유용한 정보와 일상을 공유하는 공간입니다.
          </p>

          {/* 검색 */}
          <form className="search-form-container" onSubmit={handleSearch}>
            <select
              value={localType}
              onChange={(e) => setLocalType(e.target.value)}
            >
              <option value="all">전체</option>
              <option value="title">제목</option>
              <option value="content">내용</option>
              <option value="writer">작성자</option>
            </select>

            <input
              type="text"
              value={localKeyword}
              onChange={(e) => setLocalKeyword(e.target.value)}
              placeholder="검색어 입력해주세요."
            />

            <button type="submit">검색</button>
          </form>

          <div className="board-actions">
            <span className="total-count">
              전체 게시글 {serverData.totalCount}개
            </span>

            <button
              className="write-btn"
              onClick={() => navigate("/board/register")}
            >
              새 글 쓰기
            </button>
          </div>
        </div>

        {/* 테이블 */}
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
                serverData.dtoList.map((board) => (
                  <tr
                    key={board.boardNo}
                    className="board-row"
                    onClick={() => navigate(`/board/read/${board.boardNo}`)}
                  >
                    <td className="td-no">{board.boardNo}</td>

                    <td className="td-title">
                      <div className="title-wrapper">
                        {board.content && board.content.includes("<img") && (
                          <span className="img-icon">📷</span>
                        )}
                        <span>{board.title}</span>
                        <span>💬 {board.replyCount}</span>
                      </div>
                    </td>

                    <td className="td-writer">{board.writer}</td>

                    <td className="td-date">
                      {board.regDate ? board.regDate.substring(0, 10) : ""}
                    </td>

                    <td className="td-views">{board.viewCount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-row">
                    {keyword && keyword.trim()
                      ? "검색 결과가 없습니다."
                      : "등록된 게시글이 없습니다."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 페이징 */}
        <div className="pagination-wrapper">
          <PageComponent serverData={serverData} moveToList={moveToBoardList} />
        </div>
      </div>
    </div>
  );
};

export default BoardList;
