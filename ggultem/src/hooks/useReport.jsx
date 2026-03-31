// useReport.jsx
import { useState } from "react";
import { registerReport } from "../api/ReportApi"; // 일반 유저용 API로 교체

const useReport = () => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => setShowModal((prev) => !prev);

  const sendReport = (reportData) => {
    console.log("서버로 보내는 데이터:", reportData);

    return registerReport(reportData)
      .then((result) => {
        alert("신고가 정상적으로 접수되었습니다.");
        setShowModal(false);
        return result;
      })
      .catch((err) => {
        console.error("신고 에러:", err);
        alert("신고 처리 중 오류가 발생했습니다.");
        throw err;
      });
  };

  return { showModal, setShowModal, toggleModal, sendReport };
};

export default useReport;
