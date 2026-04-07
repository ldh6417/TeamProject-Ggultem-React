import { remove } from "../../../api/admin/NoticeApi.jsx";
import useCustomMove from "../../../hooks/useCustomMove";

const RemoveComponent = ({ noticeId }) => {
  const { moveToAdminNoticeList } = useCustomMove();

  const handleClickRemove = () => {
    if (window.confirm("이 게시글을 삭제 하시겠습니까?")) {
      remove(noticeId)
        .then((data) => {
          if (data.RESULT === "SUCCESS") {
            alert("성공적으로 삭제되었습니다. 🍯");
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
      className="admin-btn remove-btn" // 🚩 클래스명 변경
      onClick={handleClickRemove}
    >
      삭제하기
    </button>
  );
};

export default RemoveComponent;
