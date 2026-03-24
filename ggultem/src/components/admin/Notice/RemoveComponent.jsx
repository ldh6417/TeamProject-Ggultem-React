import { remove } from "../../../api/admin/NoticeApi.jsx";
import useCustomMove from "../../../hooks/useCustomMove";

const RemoveComponent = ({ noticeId }) => {
  const { moveToAdminNoticeList } = useCustomMove();

  // 자바 @PutMapping("/remove/{noticeId}")과 매칭
  const handleClickRemove = () => {
    if (window.confirm("이 게시글을 삭제 하시겠습니까?")) {
      // 위에서 import한 remove 함수 호출
      remove(noticeId)
        .then((data) => {
          // 서버 응답 오타(SUCESS) 혹은 SUCCESS 둘 다 대응 가능하도록 처리
          if (data.RESULT === "SUCCESS" || data.RESULT === "SUCESS") {
            alert("성공적으로 삭제되었습니다.");
            moveToAdminNoticeList();
          }
        })
        .catch((err) => {
          console.error("삭제 실패:", err);
          alert("삭제를 실패하였습니다.");
        });
    }
  };

  return (
    <button
      className="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-700"
      onClick={handleClickRemove}
    >
      삭제하기
    </button>
  );
};

export default RemoveComponent;
