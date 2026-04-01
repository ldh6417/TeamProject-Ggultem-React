import axios from "axios";

// 백엔드 서버 주소
export const API_SERVER_HOST = "http://localhost:8080";
const host = `${API_SERVER_HOST}`;

export const getOne = async (no) => {
  const res = await axios.get(`${host}/admin/banner/${no}`);
  return res.data;
};

export const getBannerList = async () => {
  const res = await axios.get(`${host}/admin/banner/list`);
  return res.data;
};

export const postAdd = async (formData) => {
  const res = await axios.post(`${host}/admin/banner/register`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const removeBanner = async (no) => {
  const res = await axios.delete(`${host}/admin/banner/${no}`);
  return res.data;
};

export const postBannerModify = async (no, formData) => {
  const res = await axios.put(`${host}/admin/banner/modify/${no}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
