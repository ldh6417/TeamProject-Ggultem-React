// 신고를 수정하는 것이 아닌 신고에 대해 조치를 취하는 행위이기 때문에 Modify가 아닌 Process로 명명하였음.
// 차후 다른 컴퍼넌트의 구조와 다른 것에 대해 혼동을 방지하기 위한 주석.
// 공지사항은 일반적인 CRUD 형태이고, Report쪽은 WorkFlow 중심이라 구조가 다를 수밖에 없음.
import { useState } from "react";
import { useSelector } from "react-redux"; // ✅ 추가
import { completeReportProcess } from "../../../api/admin/ReportApi";

const ProcessComponent = ({ reportId }) => {
  const loginState = useSelector((state) => state.loginSlice); // ✅ 추가
  const adminEmail = loginState.email; // ✅ 하드코딩 제거

  const [processData, setProcessData] = useState({
    actionNote: "",
    memberStatus: 0,
  });

  const handleClickProcess = () => {
    if (!processData.actionNote || processData.actionNote.trim() === "") {
      alert("조치 내용을 상세히 입력해주세요.");
      return;
    }

    const finalData = {
      reportId: Number(reportId),
      adminEmail: String(adminEmail), // ✅ 실제 로그인한 관리자 이메일
      actionNote: String(processData.actionNote),
      reportStatus: "처리완료",
      memberStatus: Number(processData.memberStatus),
    };

    console.log("전송 데이터 최종 확인:", finalData);

    completeReportProcess(finalData)
      .then((data) => {
        console.log("서버 응답:", data);
        alert("신고 처리가 완료되었습니다.");
      })
      .catch((err) => {
        console.error("Axios 에러 상세:", err.response?.data);
        alert("서버 오류가 발생했습니다. 콘솔을 확인하세요.");
      });
  };

  return (
    <div className="process-form">
      <h3>관리자 신고 조치</h3>
      <div className="form-group">
        <label>제재 수위 선택</label>
        <select
          value={processData.memberStatus}
          onChange={(e) =>
            setProcessData({
              ...processData,
              memberStatus: parseInt(e.target.value),
            })
          }
        >
          <option value={0}>조치 없음 (반려)</option>
          <option value={2}>7일 정지</option>
          <option value={3}>30일 정지</option>
          <option value={4}>영구 정지</option>
        </select>
      </div>

      <div className="form-group">
        <label>조치 사유 (관리자 메모)</label>
        <textarea
          placeholder="사용자 정지 사유 및 조치 내용을 상세히 기록하세요."
          value={processData.actionNote}
          onChange={(e) =>
            setProcessData({ ...processData, actionNote: e.target.value })
          }
        />
      </div>

      <button className="submit-btn" onClick={handleClickProcess}>
        처리 확정
      </button>
    </div>
  );
};

export default ProcessComponent;
