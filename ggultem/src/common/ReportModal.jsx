import React, { useState, useEffect } from "react";
import "./InfoModal.css"; // 기존 스타일 재활용

const ReportModal = ({ show, targetData, callbackFn, submitFn }) => {
  // targetData: { targetType, targetNo, targetMemberId } 정보를 부모로부터 받음

  // usetState 초기값은 빈 문자열로 두어 사용자가 반드시 선택하도록 세팅.
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
    // 유효성 검사 1: 유형 선택 여부
    if (!reportType || reportType === "" || reportType === "선택해 주세요") {
      alert("신고 유형을 반드시 선택해 주세요.");
      return;
    }

    // 유효성 검사 2: 기타 선택 시 상세 사유 기재 필수
    if (reportType === "기타" && !reason.trim()) {
      alert("기타 사유를 구체적으로 입력해 주세요.");
      return;
    }

    // 최종 데이터 전송(이미지파일 포함을 위해 객체 구성하기)
    submitFn({
      reportType,
      reason: reportType === "기타" ? reason : reportType, // '기타'가 아니면 유형 자체를 사유로 저장
      files,
      ...targetData,
    });

    // 제출 후 상태 초기화
    setReportType("");
    setReason("");
    setFiles([]);
  };

  // 실제 렌더링 부분 (handleSubmit 함수 외부로 이동)
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
              <option value="">선택해 주세요</option>
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
