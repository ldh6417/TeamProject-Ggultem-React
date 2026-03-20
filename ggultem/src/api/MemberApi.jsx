import axios from "axios";

// 백엔드 서버 주소
export const API_SERVER_HOST = "http://localhost:8080";
const host = `${API_SERVER_HOST}`;

// REST API 키와 리다이렉트 주소를 상수로 관리
const REST_API_KEY = "926c20ad6655d0951df3feb3788f0d99";
const REDIRECT_URI = "http://localhost:5173/member/kakao";

// 카카오 로그인창 주소 생성
export const getKakaoLoginLink = () => {
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  return kakaoURL;
};

// 인가 코드를 백엔드로 전달하고 JWT 토큰을 받아오는 함수
export const getAccessToken = async (authCode) => {
  const header = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  // 백엔드의 카카오 로그인 엔드포인트로 인가 코드 전달
  // 보통 쿼리 스트링이나 파라미터로 전달합니다.
  const res = await axios.get(`${host}/member/kakao?code=${authCode}`, header);

  return res.data;
};

// 로그인 호출 함수
export const loginPost = async (loginParam) => {
  const header = {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  };

  // 폼 데이터를 URL 인코딩 방식으로 변환
  const form = new FormData();
  form.append("username", loginParam.email);
  form.append("password", loginParam.pw);

  const res = await axios.post(`${host}/login`, form, header);

  return res.data;
};

//*************************** 마이페이지 ******************************* */
// 마이페이지 정보 가져오기
export const getMyInfo = async (email) => {
  const res = await axios.get(`${host}/mypage/${encodeURIComponent(email)}`);
  console.log(res.data);
  return res.data;
};

export const putOne = async (email, formData) => {
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }

  const res = await axios.put(
    `${host}/mypage/${encodeURIComponent(email)}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return res.data;
};
