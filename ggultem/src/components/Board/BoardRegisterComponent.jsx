import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { addBoard } from "../../api/BoardApi";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

const BoardRegisterComponent = () => {

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const editorRef = useRef();

  const loginState = useSelector(state => state.loginSlice);
  const email = loginState?.email;

  const navigate = useNavigate();
  const handleRegister = () => {

    const content = editorRef.current.getInstance().getHTML();
    console.log("🔥 email:", email);

    if (!email) {
      alert("로그인이 필요합니다");
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert("제목/내용 입력");
      return;
    }

    const boardObj = {
      title,
      content,
      email,
    };

    addBoard(boardObj).then((result) => {
      alert("등록 완료");
      navigate(`/board/read/${result.BOARD_NO}`);
    });
  };
  return (
    <div>
      <h2>게시글 등록</h2>

      <input
        type="text"
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Editor
        ref={editorRef}
        initialValue="내용을 입력하세요"
        previewStyle="tab"
        initialEditType="wysiwyg"
        height="400px"
        hooks={{
          addImageBlobHook: async (blob, callback) => {

            console.log("이미지 업로드 시작");

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
          }
        }}
      />


      <div style={{ marginTop: "10px" }}>

        <button type="button" onClick={handleRegister}>
          등록
        </button>

        <button type="button" onClick={() => navigate(-1)}>
          취소
        </button>

      </div>
    </div>
  );
};

export default BoardRegisterComponent;