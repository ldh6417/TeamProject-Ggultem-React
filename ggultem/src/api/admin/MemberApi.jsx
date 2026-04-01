import axios from "axios";

// 백엔드 서버 주소
export const API_SERVER_HOST = "http://localhost:8080";
const host = `${API_SERVER_HOST}`;

export const getList = async (pageParam) => {
  const { page, size, keyword, searchType, enabled } = pageParam;
  const res = await axios.get(`${host}/admin/member/list`, {
    params: {
      page: page,
      size: size,
      keyword: keyword,
      searchType: searchType,
      enabled: enabled,
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
    `${host}/admin/member/${encodeURIComponent(email)}`,
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

export const postAdd = async (formData) => {
  const res = await axios.post(`${host}/admin/member/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const checkEmail = async (email) => {
  const res = await axios.get(`${host}/admin/member/checkEmail`, {
    params: { email },
  });
  return res.data;
};

export const checkNickname = async (nickname) => {
  const res = await axios.get(`${host}/admin/member/checkNickname`, {
    params: { nickname },
  });
  return res.data;
};

// 기존 MemberApi.js 하단에 추가
export const sendVerificationEmail = async (email) => {
  const formData = new FormData();
  formData.append("email", email);
  const res = await axios.post(`${host}/api/mail/send`, formData);
  return res.data;
};

export const verifyEmailCode = async (email, code) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("code", code);
  const res = await axios.post(`${host}/api/mail/verify`, formData);
  return res.data;
};
