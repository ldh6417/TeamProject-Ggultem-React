import axios from "axios";

//서버 주소
export const API_SERVER_HOST = "http://localhost:8080";
const host = `${API_SERVER_HOST}`;

//비즈니스 회원 리스트
export const getOne = async (email) => {
  const res = await axios.get(`${host}/businessmember/${email}`);
  return res.data;
};

export const getList = async (pageParam) => {
  const { page, size, keyword, searchType, businessVerified } = pageParam;
  const res = await axios.get(`${host}/businessmember/list`, {
    params: {
      page: page,
      size: size,
      keyword: keyword,
      searchType: searchType,
      businessVerified: businessVerified,
    },
  });
  return res.data;
};

//비즈니스 회원 등록
export const postAdd = async (businessData) => {
  const res = await axios.post(`${host}/businessmember/`, businessData);
  return res.data;
};

// 사업자 번호 인증 API 호출 함수
export const verifyBusinessApi = async (businessNumber) => {
  // 백엔드에 만든 /verify (혹은 설정한 경로) 호출
  const res = await axios.post(`${host}/businessmember/verify`, {
    businessNumber,
  });
  return res.data; // { isValid: true/false } 형태라고 가정
};

//비즈니스 회원 승인
export const approve = async (email) => {
  const res = await axios.get(`${host}/businessmember/approve/${email}`);
  return res.data;
};

//비즈니스 회원 승인 취소
export const reject = async (email) => {
  const res = await axios.get(`${host}/businessmember/reject/${email}`);
  return res.data;
};

export const getBizMoneyHistoryAdmin = async (pageParam) => {
  const { page, size, keyword, searchType, state } = pageParam;
  const res = await axios.get(`${host}/businessmember/admin/history`, {
    params: {
      page: page,
      size: size,
      keyword: keyword,
      searchType: searchType,
      state: state,
    },
  });
  return res.data;
};
