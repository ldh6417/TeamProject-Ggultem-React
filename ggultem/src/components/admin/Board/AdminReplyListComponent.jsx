import { useEffect, useState } from "react";
import { getAdminReplyList, deleteReply } from "../../../api/admin/adminBoardApi";
import { useNavigate } from "react-router-dom";
import "./AdminReplyListComponent.css";

const AdminReplyListComponent = () => {
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
      keyword,
    };

    getAdminReplyList(params, token).then((data) => {
      console.log("진짜 데이터:", data);
      setList(data.dtoList || []);
    });
  };
  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = () => {
    loadData();
  };

  const handleDelete = async (replyNo) => {
    const confirmDelete = window.confirm("댓글을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await deleteReply(replyNo, token);
      alert("댓글이 삭제되었습니다.");
      loadData();
    } catch (err) {
      alert("삭제 실패");
    }
  };

  console.log("현재 list:", list);

  return (
    <div className="admin-reply-list">
      <div className="admin-reply-search">
        <input
          type="text"
          placeholder="댓글 내용 검색"
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

      {list.length === 0 && (
        <div style={{ marginTop: "20px", color: "#888" }}>
          조회된 댓글이 없습니다.
        </div>
      )}

      {list.map((reply) => (
        <div
          className={`admin-reply-item ${reply.enabled === 0 ? "deleted" : ""}`}
          key={reply.replyNo}
        >
          <div className="admin-reply-left">
            {reply.parentReplyNo && (
              <span className="reply-child-tag">↳</span>
            )}

            <span
              className="admin-reply-content"
              onClick={() => navigate(`/board/read/${reply.boardNo}`)}
            >
              {reply.content}
            </span>

            <span className="admin-reply-writer">
              - {reply.writer}
            </span>

            {reply.enabled === 0 && (
              <span className="deleted-text">(삭제됨)</span>
            )}
          </div>

          <button
            className="admin-delete-btn"
            onClick={() => handleDelete(reply.replyNo)}
          >
            삭제
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminReplyListComponent;