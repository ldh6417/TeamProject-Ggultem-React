import axios from "axios";
import { API_SERVER_HOST } from "./NoticeApi"; // 기존 설정된 호스트 재활용

const host = `${API_SERVER_HOST}/api/report`;

/**
 * 1. 사용자: 신고 등록 (이미지 포함)
 * @param {ReportDTO} reportDTO - 모달에서 넘어온 데이터 (files 포함)
 */
export const postReport = async (reportDTO) => {
  const header = { headers: { "Content-Type": "multipart/form-data" } };

  const formData = new FormData();

  // 기본 필드 추가
  formData.append("memberEmail", reportDTO.memberEmail);
  formData.append("targetMemberId", reportDTO.targetMemberId);
  formData.append("reportType", reportDTO.reportType);
  formData.append("targetType", reportDTO.targetType);
  formData.append("reason", reportDTO.reason);
  formData.append("targetNo", reportDTO.targetNo);

  // 증거 이미지 파일들 추가 (NoticeDTO 방식과 동일하게.)
  if (reportDTO.files && reportDTO.files.length > 0) {
    for (let i = 0; i < reportDTO.files.length; i++) {
      formData.append("files", reportDTO.files[i]);
    }
  }

  const res = await axios.post(`${host}/register`, formData, header);
  return res.data;
};

/**
 * 2. 관리자: 전체 신고 목록 조회 (페이징)
 * @param {pageParam} - {page, size}
 */
export const getReportList = async (pageParam) => {
  const { page, size } = pageParam;
  const res = await axios.get(`${host}/admin/list`, {
    params: { page, size },
  });
  return res.data;
};

/**
 * 3. 관리자: 특정 신고 상세 조회
 * @param {Long} reportId
 */
export const getOneReport = async (reportId) => {
  const res = await axios.get(`${host}/${reportId}`);
  return res.data;
};

/**
 * 4. 관리자: 신고 처리 완료 (ProcessedReport 생성 및 상태 변경)
 * @param {ProcessedReportDTO} processedDTO
 */
export const completeReportProcess = async (processedDTO) => {
  // 처리 로직은 일반 JSON 데이터로 전송
  const res = await axios.post(`${host}/admin/process`, processedDTO);
  return res.data;
};
