import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { remove } from "../../../api/NoticeApi";

const RemovePage = () => {
  const { noticeId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (window.confirm("정말 이 공지사항을 삭제하시겠습니까?")) {
      // 자바의 @PutMapping("/remove/{noticeId}") 호출
      remove(noticeId)
        .then((data) => {
          if (data.RESULT === "SUCCESS" || data.RESULT === "SUCESS") {
            alert("삭제되었습니다.");
            // 삭제 후 목록으로 이동 (뒤로가기 방지를 위해 replace: true)
            navigate("/admin/notice/list", { replace: true });
          }
        })
        .catch((err) => {
          alert("삭제 중 오류가 발생했습니다.");
          navigate(-1); // 에러 시 이전 페이지로
        });
    } else {
      // 취소 시 이전 페이지(상세보기 등)로 돌아감
      navigate(-1);
    }
  }, [noticeId, navigate]);

  return (
    <div className="p-4 flex justify-center items-center h-64">
      <div className="text-xl font-bold text-red-500">
        삭제 처리 중입니다...
      </div>
    </div>
  );
};

export default RemovePage;
