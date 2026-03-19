import axios from "axios";

// 서버 주소
export const API_SERVER_HOST = "http://localhost:8080";

const prefix = `${API_SERVER_HOST}/admin/notice`;

// 상세 조회
export const getOne = async (noticeId) => {
  const res = await axios.get(`${prefix}/${noticeId}`);
  return res.data;
};

// 리스트 조회 (검색 포함)
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
