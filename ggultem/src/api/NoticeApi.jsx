import axios from "axios";
import { API_SERVER_HOST } from "./config";

const prefix = `${API_SERVER_HOST}/admin/notice`;

// 1. 상세 조회
export const getOne = async (noticeId) => {
  const res = await axios.get(`${prefix}/${noticeId}`);
  return res.data;
};

// 2. 리스트 조회 (검색 포함)
export const getList = async (pageParam) => {
  const { page, size, keyword, searchType } = pageParam;

  const res = await axios.get(`${prefix}/list`, {
    params: {
      page: page,
      size: size,
      keyword: keyword,
      searchType: searchType,
    },
  });

  return res.data;
};

// 3. 공지사항 등록 (POST 요청)
export const postAdd = async (formData) => {
  const header = {
    headers: { "Content-Type": "multipart/form-data" },
  };

  const res = await axios.post(`${prefix}/`, formData, header);
  return res.data;
};
