import axios from "axios";
import { API_SERVER_HOST } from "../config";
export { API_SERVER_HOST };
const host = `${API_SERVER_HOST}/admin/businessboard`;

export const getOne = async (no) => {
  const res = await axios.get(`${host}/${no}`);
  return res.data;
};

//비즈니스 광고 리스트
export const getList = async (pageParam) => {
  const { page, size, keyword, searchType, sign, category } = pageParam;
  const res = await axios.get(`${host}/list`, {
    params: {
      page: page,
      size: size,
      keyword: keyword,
      searchType: searchType,
      sign: sign,
      category: category,
    },
  });
  return res.data;
};

//비즈니스 회원 승인
export const approve = async (no) => {
  const res = await axios.get(`${host}/approve/${no}`);
  return res.data;
};

//비즈니스 회원 승인 취소
export const reject = async (no) => {
  const res = await axios.get(`${host}/reject/${no}`);
  return res.data;
};
