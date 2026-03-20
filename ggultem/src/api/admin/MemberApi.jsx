import axios from "axios";

// 백엔드 서버 주소
export const API_SERVER_HOST = "http://localhost:8080";
const host = `${API_SERVER_HOST}`;

export const getList = async (pageParam) => {
  const { page, size, keyword, searchType } = pageParam;
  const res = await axios.get(`${host}/admin/member/list`, {
    params: {
      page: page,
      size: size,
      keyword: keyword,
      searchType: searchType,
    },
  });
  return res.data;
};

export const getOne = async (email) => {
  const res = await axios.get(
    `${host}/admin/member/${encodeURIComponent(email)}`,
  );
  console.log(res.data);
  return res.data;
};

export const putOne = async (email, formData) => {
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }

  const res = await axios.put(
    `${host}/admin/member/modify/${encodeURIComponent(email)}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return res.data;
};

export const uploadImageApi = async (email, formData) => {
  // axios.put(url, data, config) 순서입니다.
  const res = await axios.put(`${host}/mypage/thumbnail/${email}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
