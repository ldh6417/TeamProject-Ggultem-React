import axios from "axios";
import { API_SERVER_HOST } from "./config";

export { API_SERVER_HOST };
const prefix = `${API_SERVER_HOST}/board`;
const adminPrefix = `${API_SERVER_HOST}/admin/board`;

// =======================
// 게시글 조회
// =======================
export const getOne = async (boardNo) => {
  const res = await axios.get(`${prefix}/${boardNo}`);
  return res.data;
};

// =======================
// 등록
// =======================
export const addBoard = async (boardObj) => {
  const formData = new FormData();

  formData.append("title", boardObj.title);
  formData.append("content", boardObj.content);
  formData.append("email", boardObj.email);

  const res = await axios.post(`${prefix}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// =======================
// 수정
// =======================
export const modifyBoard = async (boardNo, boardObj) => {
  const formData = new FormData();

  formData.append("title", boardObj.title);
  formData.append("content", boardObj.content);

  const res = await axios.put(`${prefix}/${boardNo}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// =======================
// 일반 삭제 (작성자)
// =======================
export const removeBoard = async (boardNo) => {
  const res = await axios.put(`${prefix}/remove/${boardNo}`);
  return res.data;
};

// =======================
//  관리자 삭제 (핵심)
// =======================
export const adminRemoveBoard = async (boardNo) => {
  const res = await axios.put(`${adminPrefix}/${boardNo}`);
  return res.data;
};

// =======================
// 목록 조회
// =======================
export const getList = async (pageParam) => {
  const { page, size, keyword, searchType } = pageParam;

  const res = await axios.get(`${prefix}/list`, {
    params: {
      page,
      size,
      keyword,
      searchType,
    },
  });

  return res.data;
};

// =======================
// 관리자 목록
// =======================
export const getAdminList = async (pageParam) => {
  const { page, size, keyword, enabled } = pageParam;

  const res = await axios.get(`${adminPrefix}/list`, {
    params: {
      page,
      size,
      keyword,
      enabled,
    },
  });

  return res.data;
};