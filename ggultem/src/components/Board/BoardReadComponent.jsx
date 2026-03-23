import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOne, API_SERVER_HOST } from "../../api/BoardApi";
import BoardReplyComponent from "./BoardReplyComponent";
import "./BoardReadComponent.css";


const host = API_SERVER_HOST;

const BoardReadComponent = ({ boardNo }) => {
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);

  useEffect(() => {
    if (boardNo) {
      getOne(Number(boardNo)).then((data) => {
        console.log(data);
        setBoard(data);
      });
    }
  }, [boardNo]);

  // 로딩 처리
  if (!board) return <div>Loading...</div>;

  return (
    <div className="board-read-wrapper">
      <div className="board-read-container">

        {/* 상단 제목 */}
        <div className="read-header">
          <h2 className="read-title">{board.title}</h2>
          <div className="read-info">
            <span>
              작성자: <strong>{board.writer}</strong>
            </span>
            <span>조회수: {board.viewCount}</span>
          </div>
        </div>

        {/* 본문 */}
        <div className="read-content-area">
          <div
            className="read-text"
            dangerouslySetInnerHTML={{ __html: board.content }}
          />

          {/* 이미지 */}
          <div className="read-image-gallery">
            {board.uploadFileNames?.map((file) => (
              <div key={file}>
                <img
                  src={`${host}/board/view/${file}`}
                  alt="img"
                  className="read-main-img"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 댓글 */}
        <BoardReplyComponent boardNo={boardNo} />

        {/* 버튼 */}
        <div className="read-actions">
          <button onClick={() => navigate("/board/list")}>
            목록으로
          </button>

          <button
            onClick={() =>
              navigate(`/board/modify/${board.boardNo}`)
            }
          >
            수정
          </button>
        </div>

      </div>
    </div>
  );
};

export default BoardReadComponent;