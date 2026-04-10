import axios from "axios";
import { API_SERVER_HOST } from "./config";

export { API_SERVER_HOST };

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
