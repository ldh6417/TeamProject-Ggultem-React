import axios from "axios";

const host = "http://localhost:8080/admin/dashboard";

// 대쉬보드 종합 통계 데이터 가져오기
export const getDashboardStats = async () => {
  const res = await axios.get(`${host}/stats`);
  return res.data;
};

// 중단 및 하단 리스트 데이터 한꺼번에 가져오기
export const getDashboardLists = async () => {
  const res = await axios.get(`${host}/lists`);
  return res.data;
};