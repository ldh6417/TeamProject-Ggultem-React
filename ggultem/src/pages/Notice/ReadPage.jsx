// src/pages/Notice/ReadPage.jsx
import { useParams } from "react-router-dom";
import ReadComponent from "../../components/Notice/ReadComponent";

const ReadPage = () => {
  const { nno } = useParams();

  return (
    <div className="p-4 w-full bg-white">
      <ReadComponent nno={nno} />
    </div>
  );
};

export default ReadPage;
