import { useParams } from "react-router-dom";
import ReadComponent from "../../../components/admin/Notice/ReadComponent";

const ReadPage = () => {
  const { noticeId } = useParams();
  return (
    <div className="p-4 w-full bg-white">
      <ReadComponent noticeId={noticeId} />
    </div>
  );
};
export default ReadPage;
