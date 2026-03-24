import { useParams } from "react-router-dom";
import ModifyComponent from "../../../components/admin/Notice/ModifyComponent";

const Modify = () => {
  // 1. URL 주소창에서 /admin/notice/modify/123 처럼 들어오는 ID를 추출.
  const { noticeId } = useParams();

  return (
    <div className="p-4 w-full bg-white">
      <div className="text-3xl font-extrabold mb-4 text-orange-600">
        공지사항 수정 관리
      </div>
      {/* 2. 실제 기능을 담당하는 부품(Component)에 ID를 넘겨준다.. */}
      <ModifyComponent noticeId={noticeId} />
    </div>
  );
};

export default Modify;
