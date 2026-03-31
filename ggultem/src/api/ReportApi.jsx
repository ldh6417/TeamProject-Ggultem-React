import axios from "axios";
import { API_SERVER_HOST } from "./config";

const host = `${API_SERVER_HOST}/api/report`;

export const registerReport = async (reportData) => {
  // 백엔드 ReportController는 multipart/form-data를 받으므로 FormData 사용
  const formData = new FormData();
  formData.append("memberEmail", reportData.memberEmail);
  formData.append("targetMemberId", reportData.targetMemberId);
  formData.append("targetType", reportData.targetType);
  formData.append("reportType", reportData.reportType);
  formData.append("reason", reportData.reason || "");
  formData.append("targetNo", reportData.targetNo || "");

  if (reportData.files && reportData.files.length > 0) {
    reportData.files.forEach((file) => {
      formData.append("files", file);
    });
  }

  const res = await axios.post(`${host}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
