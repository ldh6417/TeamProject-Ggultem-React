import { useEffect, useState } from "react";
import { getAdminList, deleteBoard } from "../../../api/admin/adminBoardApi";
import { useNavigate } from "react-router-dom";
import "./AdminBoardListComponent.css";

const AdminBoardListComponent = () => {
  const [list, setList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [enabled, setEnabled] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const loadData = () => {
    const params = {
      page: 1,
      size: 10,
      enabled,
    };

    if (keyword.trim() !== "") {
      params.keyword = keyword.trim();
    }

    console.log("최종 params:", params);

    getAdminList(params, token).then((data) => {
      console.log("관리자 데이터:", data);
      setList(data.dtoList || []);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = () => {
    loadData();
  };

  const handleDelete = async (boardNo) => {
    const confirmDelete = window.confirm("정말 삭제 하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await deleteBoard(boardNo, token);

      alert("삭제가 완료되었습니다.");

      loadData();
    } catch (error) {
      console.error(error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="admin-board-list">
      <div className="admin-board-header">
        <h2 className="admin-board-title-text">커뮤니티 게시글 관리</h2>

        <button
          className="admin-reply-btn"
          onClick={() => navigate("/admin/reply")}
        >
          댓글 관리
        </button>
      </div>

      <div className="admin-board-search">
        <input
          type="text"
          placeholder="검색어 입력"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <select
          value={enabled}
          onChange={(e) => setEnabled(e.target.value)}
        >
          <option value="">전체</option>
          <option value="1">활성</option>
          <option value="0">삭제됨</option>
        </select>

        <button onClick={handleSearch}>검색</button>
      </div>

      {list.map((board) => (
        <div
          className={`admin-board-item ${board.enabled === 0 ? "deleted" : ""}`}
          key={board.boardNo}
        >
          <div className="admin-board-left">
            <span
              className="admin-board-title"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/board/read/${board.boardNo}`)}
            >
              {board.title}
            </span>

            <span className="admin-board-writer">- {board.writer}</span>

            {board.enabled === 0 && (
              <span className="deleted-text">(삭제됨)</span>
            )}
          </div>

          <button
            className="admin-delete-btn"
            onClick={() => handleDelete(board.boardNo)}
          >
            삭제
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminBoardListComponent;