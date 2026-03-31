import { useEffect, useState } from "react";
import { getOneReport, getReportProcess } from "../../../api/admin/ReportApi";
import { API_SERVER_HOST } from "../../../api/config";
import ProcessComponent from "./ProcessComponent";

const ReadComponent = ({ reportId }) => {
  const [report, setReport] = useState(null);
  const [processed, setProcessed] = useState(null);

  useEffect(() => {
    getOneReport(reportId).then((data) => {
      console.log(data);
      setReport(data);
    });
    getReportProcess(reportId).then((data) => {
      console.log(data);
      setProcessed(data);
    });
  }, [reportId]);

  if (!report) return <div>로딩 중...</div>;

  // ✅ report 자체가 ReportDTO이므로 reportDetail 없이 바로 접근
  return (
    <div className="report-read-container">
      <h2>신고 상세 확인</h2>
      <div className="report-info">
        <p>
          <strong>신고 유형:</strong> {report.reportType}
        </p>
        <p>
          <strong>대상자:</strong> {report.targetMemberId} ({report.targetType}{" "}
          No.{report.targetNo})
        </p>
        <p>
          <strong>신고 사유:</strong> {report.reason || "상세 사유 없음"}
        </p>
        <p>
          <strong>신고자:</strong> {report.memberEmail}
        </p>
      </div>

      <div className="report-evidence">
        <label>증거 첨부 이미지</label>
        <div className="image-list">
          {report.uploadFileNames &&
            report.uploadFileNames.map((img, i) => (
              <img
                key={i}
                src={`${API_SERVER_HOST}/api/report/view/${img}`}
                alt="증거이미지"
                style={{
                  width: "200px",
                  margin: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            ))}
        </div>
      </div>

      <hr />

      {report.status === 0 ? (
        <ProcessComponent reportId={reportId} />
      ) : (
        <div className="processed-info">
          <h4>처리 완료된 신고입니다.</h4>
          <p>
            <strong>관리자 메모:</strong> {processed.actionNote}
          </p>
          <p>
            <strong>처리 담당자:</strong> {processed.adminEmail}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReadComponent;
