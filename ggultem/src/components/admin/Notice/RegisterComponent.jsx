import { useRef, useState } from "react";
import { postAdd } from "../../../api/admin/NoticeApi";
import useCustomMove from "../../../hooks/useCustomMove";
import "./RegisterComponent.css";

const RegisterComponent = () => {
  const [notice, setNotice] = useState({ title: "", content: "" });
  const uploadRef = useRef(); // 파일 선택창 참조
  const { moveToAdminNoticeList } = useCustomMove();

  const handleChangeNotice = (e) => {
    // 1. 기존의 notice 객체를 복사하고(...)
    // 2. 바뀐 [name] 필드만 새로운 value로 덮어쓴 뒤
    // 3. setNotice로 '새로운 객체'를 통째로 전달.
    setNotice({
      ...notice,
      [e.target.name]: e.target.value,
    });
  };

  const handleClickAdd = () => {
    const files = uploadRef.current.files;
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]); // 자바 DTO의 'files' 필드와 매칭
    }
    formData.append("title", notice.title);
    formData.append("content", notice.content);
    formData.append("memberEmail", "admin@honey.com"); // 실제 로그인된 관리자 계정 정보

    postAdd(formData).then((data) => {
      alert("공지사항이 등록되었습니다.");
      moveToAdminNoticeList();
    });
  };

  return (
    <div className="p-4 border-2 border-orange-200 mt-10">
      <div className="flex justify-center">
        <h2 className="text-2xl font-bold">공지사항 등록</h2>
      </div>
      <div className="mt-4">
        <div className="mb-4">
          <label className="block text-gray-700">제목</label>
          <input
            className="w-full border p-2"
            name="title"
            type="text"
            onChange={handleChangeNotice}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">내용</label>
          <textarea
            className="w-full border p-2 h-40"
            name="content"
            onChange={handleChangeNotice}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">이미지 첨부</label>
          <input
            ref={uploadRef}
            className="w-full border p-2"
            type="file"
            multiple={true}
          />
        </div>
        <div className="flex justify-end">
          <button
            className="bg-orange-500 text-white p-2 rounded"
            onClick={handleClickAdd}
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
};
export default RegisterComponent;
