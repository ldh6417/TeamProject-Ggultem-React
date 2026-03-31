import axios from "axios";
import { API_SERVER_HOST } from "../config";

// 1. host 자체를 export 합니다. (빨간 줄 방지 + 주소 공유)
export const host = `${API_SERVER_HOST}/admin/report`;

/**
 * 2. 관리자: 전체 신고 목록 조회
 */
export const getReportList = async (pageParam) => {
  const { page, size } = pageParam;
  const res = await axios.get(`${host}/list`, {
    params: { page, size },
  });
  return res.data;
};

/**
 * 3. 관리자: 특정 신고 상세 조회
 */
export const getOneReport = async (reportId) => {
  // ID 뒤에 붙은 쿼리스트링 제거
  const cleanId = String(reportId).split("?")[0];
  const res = await axios.get(`${host}/${cleanId}`);
  return res.data;
};

/**
 * 4. 관리자: 신고 처리 완료
 */
export const completeReportProcess = async (processedDTO) => {
  const res = await axios.post(`${host}/process`, processedDTO);
  return res.data;
};

export const getReportProcess = async (reportId) => {
  const res = await axios.get(`${host}/processed/${reportId}`);
  return res.data;
};
