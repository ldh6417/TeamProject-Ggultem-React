import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOne, modifyBoard } from "../../api/BoardApi";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "./BoardModifyComponent.css"; // 등록 페이지와 동일한 CSS 사용 🍯

const BoardModifyComponent = () => {
  const { boardNo } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const editorRef = useRef();

  // 기존 데이터 불러오기
  useEffect(() => {
    getOne(boardNo).then(data => {
      console.log("불러온 데이터:", data);
      setTitle(data.title || "");

      // 에디터 인스턴스가 준비될 시간을 약간 줍니다.
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.getInstance().setHTML(data.content || "");
        }
      }, 300);
    });
  }, [boardNo]);

  // 수정 실행
  const handleModify = () => {
    const content = editorRef.current?.getInstance().getHTML() || "";

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요! 🐝");
      return;
    }

    const boardObj = {
      title: title,
      content: content,
    };

    modifyBoard(boardNo, boardObj).then(() => {
      alert("수정이 완료되었습니다. 🍯");
      navigate(`/board/read/${boardNo}`);
    });
  };

  return (
    <div className="board-register-wrapper"> {/* 동일한 클래스명 사용 */}
      <h2>게시글 수정</h2>

      {/* 제목 입력창 */}
      <input
        type="text"
        className="board-title-input"
        placeholder="제목을 입력해주세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* 에디터: 등록 페이지와 동일한 설정 + 이미지 훅 추가 */}
      <Editor
        ref={editorRef}
        previewStyle="tab"
        initialEditType="wysiwyg"
        height="500px"
        key={boardNo}
        hooks={{
          addImageBlobHook: async (blob, callback) => {
            console.log("이미지 업로드 시작 (수정 모드)");
            const formData = new FormData();
            formData.append("file", blob);

            try {
              const res = await fetch("http://localhost:8080/board/upload", {
                method: "POST",
                body: formData,
              });
              const data = await res.json();
              callback(data.url, "이미지");
            } catch (err) {
              console.error("이미지 업로드 실패", err);
            }
          },
        }}
      />

      {/* 버튼 그룹 */}
      <div className="board-btn-group">
        <button 
          className="board-btn board-register-btn" 
          onClick={handleModify}
        >
          수정 완료
        </button>
        <button 
          className="board-btn board-cancel-btn" 
          onClick={() => navigate(-1)}
        >
          취소
        </button>
      </div>
    </div>
  );
};

export default BoardModifyComponent;