import axios from "axios";
import { API_SERVER_HOST } from "./config";
export { API_SERVER_HOST };
const prefix = `${API_SERVER_HOST}/itemBoard/reply`;

// 댓글 리스트 조회
export const getReplyList = async (id) => {
  const res = await axios.get(`${prefix}/list/${id}`);
  return res.data;
};

// 댓글 생성
export const addReply = async (reply) => {
  const res = await axios.post(`${prefix}/`, reply);
  return res.data;
};

// 댓글 수정
export const modifyReply = async (replyNo, replyObj) => {
  const res = await axios.put(`${prefix}/${replyNo}`, replyObj);
  return res.data;
};

// 댓글 삭제
export const removeReply = async (replyNo) => {
  const res = await axios.get(`${prefix}/${replyNo}`);
  return res.data;
};
