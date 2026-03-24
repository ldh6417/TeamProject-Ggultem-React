import axios from "axios";
import { API_SERVER_HOST } from "../BoardApi";

const host = API_SERVER_HOST;
const prefix = `${host}/admin/board`;


// 관리자 게시글 목록 조회
export const getAdminList = async (params, token) => {
  const res = await axios.get(`${prefix}/list`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// 게시글 삭제
export const deleteBoard = async (boardNo, token) => {
  const res = await axios.put(`${prefix}/${boardNo}`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getAdminReplyList = async (params, token) => {
  const res = await axios.get(`${host}/admin/board/reply/list`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const deleteReply = async (replyNo, token) => {
  const res = await axios.put(`${host}/admin/board/reply/${replyNo}`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
