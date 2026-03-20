import axios from "axios";
import { API_SERVER_HOST } from "./BoardApi";

const host = API_SERVER_HOST;

// 댓글 리스트 조회
export const getReplyList = async (boardNo) => {
  const res = await axios.get(`${host}/api/reply/list/${boardNo}`);
  return res.data;
};

// 댓글 생성
export const addReply = async (reply) => {
  const res = await axios.post(`${host}/api/reply/`, reply);
  return res.data;
};

// 댓글 수정
export const modifyReply = async (replyNo, content) => {
  const res = await axios.put(`${host}/api/reply/${replyNo}`, {
    content,
  });
  return res.data;
};

// 댓글 삭제
export const removeReply = async (replyNo) => {
  const res = await axios.get(`${host}/api/reply/${replyNo}`);
  return res.data;
};
