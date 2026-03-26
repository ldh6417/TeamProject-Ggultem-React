import { useState } from "react";
import { postReport } from "../api/admin/ReportApi"; // 실제 API 호출 함수

const useReport = () => {
  const [showModal, setShowModal] = useState(false);

  // 모달을 열고 닫는 함수
  const toggleModal = () => setShowModal((prev) => !prev);

  // 실제 서버로 신고 데이터를 보내는 공통 로직
  const sendReport = (reportData) => {
    // reportData에는 {reportType, reason, files, targetType, targetNo, ...}가 들어옴
    return postReport(reportData)
      .then((result) => {
        alert("신고가 정상적으로 접수되었습니다.");
        setShowModal(false); // 성공 시 모달 닫기
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
