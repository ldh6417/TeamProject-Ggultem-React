import React, { useState, useEffect } from "react";
import "./InfoModal.css"; // 기존 스타일 재활용

const ReportModal = ({ show, targetData, callbackFn, submitFn }) => {
  // targetData: { targetType, targetNo, targetMemberId } 정보를 부모로부터 받음

  // usetState는 아무 것도 주지 않은 상태(체크 없는 상태)로 두고 실수로 제출을 누를 시 무엇이든 선택해야 한다는 문구 넣기.
  const [reportType, setReportType] = useState("");
  const [reason, setReason] = useState("");
  const [files, setFiles] = useState([]);

  // show가 false일 경우 렌더링을 아예 안 함.
  if (!show) return null;

  // 스크린샷 첨부용
  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = () => {
    // 반드시 선택
    if (!reportType) {
      alert("신고 유형을 반드시 선택해 주세요.");
      return;
    }

    // 기타 선택 시 사유 체크
    if (reportType === "기타" && !reason.trim()) {
      alert("상세 사유를 입력해 주세요.");
      return;
    }

    // 부모 컴포넌트에서 전달받은 전송 로직 실행
    submitFn({ reportType, reason, files, ...targetData });
  };

  return (
    <div className="modal-overlay" onClick={callbackFn}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h4>신고하기</h4>
          <span
            style={{ cursor: "pointer", fontSize: "1.5rem" }}
            onClick={callbackFn}
          >
            &times;
          </span>
        </div>

        <div className="modal-body">
          <div className="report-form">
            <p>
              <strong>신고 대상:</strong> {targetData.targetMemberId} (
              {targetData.targetType})
            </p>

            <label>신고 유형</label>
            <select
              value={reportType}
              onChange={(e) => {
                const value = e.target.value;
                setReportType(value);

                if (value !== "기타") {
                  setReason("");
                }
              }}
            >
              <option>혐오/차별적/욕설 표현</option>
              <option>스팸홍보/도배</option>
              <option>음란물/청소년에게 유해한 내용</option>
              <option>불법적 내용</option>
              <option>사기로 의심되는 내용</option>
              <option>기타</option>
            </select>

            {reportType === "기타" && (
              <textarea
                placeholder="상세 사유를 입력하세요 (필수)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            )}

            <label>증거 첨부 (선택)</label>
            <input type="file" multiple onChange={handleFileChange} />
          </div>

          <div className="modal-footer">
            <button className="modal-submit-btn" onClick={handleSubmit}>
              제출하기
            </button>
            <button className="modal-close-btn" onClick={callbackFn}>
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
