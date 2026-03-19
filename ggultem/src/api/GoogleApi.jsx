import axios from "axios";

export const API_SERVER_HOST = "http://localhost:8080"; // 백엔드 주소
const host = `${API_SERVER_HOST}/member/google`;

// 인가 코드로 액세스 토큰 요청
export const getAccessToken = async (authCode) => {
  const header = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const res = await axios.post(
    `${host}/accessToken`,
    { code: authCode },
    header,
  );
  return res.data;
};
