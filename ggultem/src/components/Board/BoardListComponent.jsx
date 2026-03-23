import { useEffect, useState } from "react";
import { getList, API_SERVER_HOST } from "../../api/BoardApi";
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

const host = API_SERVER_HOST;

const BoardList = () => {
  const { page, size, keyword, searchType, refresh, moveToBoardList } =
    useCustomMove();

  const [serverData, setServerData] = useState(initState);
  const navigate = useNavigate();

  const [localKeyword, setLocalKeyword] = useState(keyword || "");
  const [localType, setLocalType] = useState(searchType || "tc");

  const handleSearch = (e) => {
    e.preventDefault();

    if (!localKeyword.trim()) {
      alert("검색어를 입력해주세요.");
      return;
    }

    moveToBoardList({
      page: 1,
      keyword: localKeyword,
      searchType: localType,
    });
  };






  useEffect(() => {
    getList({
      page,
      size,
      keyword,
      searchType,
    }).then((data) => {
      console.log("서버 데이터:", data);
      setServerData(data);
    });
  }, [page, size, keyword, searchType, refresh]);

  return (
    <div className="board-list-wrapper">
      <div className="board-list-container">
        {/* 헤더 */}
        <div className="board-header">
          <h2 className="board-title">🍯 꿀템 커뮤니티</h2>
          <p className="board-subtitle">
            유용한 정보와 일상을 공유하는 공간입니다.
          </p>
          <form className="search-form" onSubmit={handleSearch}>
            <select
              value={localType}
              onChange={(e) => setLocalType(e.target.value)}
            >
              <option value="t">제목</option>
              <option value="c">내용</option>
              <option value="w">작성자</option>
              <option value="tc">제목+내용</option>
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
              새 글 쓰기 ✍️
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

                        {/*  이미지 여부 표시 */}
                        {board.content && board.content.includes("<img") && (
                          <span className="img-icon">📷</span>
                        )}

                        <span className="title-text">{board.title}</span>

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
                    등록된 게시글이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 페이징 */}
        <div className="pagination-wrapper">
          <PageComponent serverData={serverData} movePage={moveToBoardList} />
        </div>
      </div>
    </div>
  );
};

export default BoardList;
