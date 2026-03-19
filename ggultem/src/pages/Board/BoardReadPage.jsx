import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOne, API_SERVER_HOST } from "../../api/BoardApi";

const host = API_SERVER_HOST;

const ReadPage = () => {
  const { boardNo } = useParams();
  const navigate = useNavigate();

  const [board, setBoard] = useState(null);

  useEffect(() => {
    getOne(boardNo).then((data) => {
      console.log(data);
      setBoard(data);
    });
  }, [boardNo]);

  if (!board) return <div>Loading...</div>;

  return (
    <div>
      <h2>{board.title}</h2>
      <p>작성자: {board.writer}</p>
      <p>내용: {board.content}</p>
      <p>조회수: {board.viewCount}</p>

      {/* 이미지 */}
      <div>
        {board.uploadFileNames?.map((file) => (
          <img key={file} src={`${host}/board/view/${file}`} width="300" />
        ))}
      </div>

      <br />

      <button onClick={() => navigate("/board/list")}>목록</button>

      <button onClick={() => navigate(`/board/modify/${board.boardNo}`)}>
        수정
      </button>
    </div>
  );
};

export default ReadPage;
