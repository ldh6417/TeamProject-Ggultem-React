import { useEffect, useState, useRef } from "react";
import { getOne, putOne, API_SERVER_HOST } from "../../../api/admin/NoticeApi";
import useCustomMove from "../../../hooks/useCustomMove";

const ModifyComponent = ({ noticeId }) => {
  // 1. 초기값 필드명을 DTO와 동일하게 'uploadFileNames'로 설정
  const [notice, setNotice] = useState({
    noticeId: 0,
    title: "",
    content: "",
    uploadFileNames: [],
  });

  const uploadRef = useRef();
  // 이동 함수들 가져오기
  const { moveToAdminNoticeRead, moveToAdminNoticeList } = useCustomMove();

  useEffect(() => {
    getOne(noticeId).then((data) => {
      console.log("불러온 데이터:", data); // 브라우저 콘솔에서 데이터가 잘 오는지 확인용
      setNotice(data);
    });
  }, [noticeId]);

  const handleChangeNotice = (e) => {
    setNotice({ ...notice, [e.target.name]: e.target.value });
  };

  const handleClickModify = () => {
    const formData = new FormData();

    // 파일 입력창(Ref)이 존재할 때만 처리
    if (uploadRef.current && uploadRef.current.files) {
      const files = uploadRef.current.files;
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
    }

    formData.append("title", notice.title);
    formData.append("content", notice.content);

    putOne(noticeId, formData).then((data) => {
      if (data.RESULT === "SUCCESS") {
        alert("수정이 완료되었습니다.");
        moveToAdminNoticeRead(noticeId);
      }
    });
  };

  return (
    <div
      className="notice-modify-wrapper"
      style={{ padding: "20px", border: "1px solid #ddd" }}
    >
      <h2 className="text-xl font-bold mb-4">공지사항 수정</h2>

      <div className="mb-4">
        <label>제목</label>
        <input
          name="title"
          className="w-full border p-2"
          value={notice.title}
          onChange={handleChangeNotice}
        />
      </div>

      <div className="mb-4">
        <label>내용</label>
        <textarea
          name="content"
          className="w-full border p-2 h-60"
          value={notice.content}
          onChange={handleChangeNotice}
        />
      </div>

      {/* 기존 이미지 미리보기 */}
      <div className="mb-4">
        <label>기존 이미지</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {notice.uploadFileNames &&
            notice.uploadFileNames.map((fileName, i) => (
              <div key={i} className="relative w-32 border p-1">
                <img
                  src={`${API_SERVER_HOST}/admin/notice/view/s_${fileName}`}
                  alt="기존이미지"
                  className="w-full rounded"
                  // 이미지 로딩 에러 시 콘솔에 찍어보기
                  onError={(e) => console.log(`${fileName} 이미지 로딩 실패`)}
                />
              </div>
            ))}
        </div>
      </div>

      {/* 새 이미지 추가 */}
      <div className="mb-4">
        <label>새 이미지 추가 (선택)</label>
        <input
          ref={uploadRef}
          type="file"
          multiple
          className="w-full border p-2"
        />
      </div>

      {/* 버튼 그룹 */}
      <div className="flex justify-end gap-2 mt-6">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={moveToAdminNoticeList} // 👈 목록으로 돌아가는 버튼 추가!
        >
          목록으로
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleClickModify}
        >
          저장하기
        </button>
      </div>
    </div>
  );
};

export default ModifyComponent;
