import axios from "axios";
import { API_SERVER_HOST } from "../config";
export { API_SERVER_HOST };

// 관리자용 댓글 리스트 (주소를 컨트롤러에 맞춰서 정확히 입력)
export const adminList = async (params) => {
  // prefix를 쓰지 말고, 댓글 컨트롤러의 경로를 직접 적어보세요.
  // /itemBoard/reply + /admin/list
  const res = await axios.get(`${API_SERVER_HOST}/itemBoard/reply/admin/list`, {
    params,
  });
  return res.data;
};

// 댓글 비활성화 (삭제) 함수
export const removeReply = async (replyNo) => {
  // 컨트롤러의 @GetMapping("/{replyNo}") 와 매칭
  const res = await axios.get(`${API_SERVER_HOST}/itemBoard/reply/${replyNo}`);
  return res.data;
};
