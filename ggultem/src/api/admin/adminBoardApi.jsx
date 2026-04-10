import axios from "axios";
import { API_SERVER_HOST } from "../config";

export { API_SERVER_HOST };

const host = API_SERVER_HOST;
const prefix = `${host}/admin/board`;

// =======================
// 관리자 게시글 목록 조회
// =======================
export const getAdminList = async (params, token) => {
  const res = await axios.get(`${prefix}/list`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// =======================
// ⭐ 관리자 게시글 삭제 (통일)
// =======================
export const deleteBoard = async (boardNo, token) => {
  const res = await axios.put(`${prefix}/${boardNo}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// =======================
// 관리자 댓글 리스트
// =======================
export const getAdminReplyList = async (params, token) => {
  const res = await axios.get(`${host}/admin/reply/list`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// =======================
// 관리자 댓글 삭제
// =======================
export const deleteReply = async (replyNo, token) => {
  const res = await axios.put(`${host}/admin/reply/${replyNo}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};