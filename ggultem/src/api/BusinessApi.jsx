import axios from "axios";

//서버 주소
export const API_SERVER_HOST = "http://localhost:8080";
const host = `${API_SERVER_HOST}`;

//비즈니스 광고 게시글
export const postItemBoardAdd = async (formData) => {
  const res = await axios.post(`${host}/business/board/register`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

//비즈니스 광고 게시글 수정
export const postItemBoardModify = async (no, formData) => {
  const res = await axios.put(`${host}/business/board/modify/${no}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const postItemBoardRemove = async (no) => {
  const res = await axios.get(`${host}/business/board/remove/${no}`);
  return res.data;
};

export const getOne = async (no) => {
  const res = await axios.get(`${host}/business/board/${no}`);
  return res.data;
};

export const getList = async (pageParam, email) => {
  const { page, size, keyword, searchType, sign, category } = pageParam;
  const res = await axios.get(`${host}/business/board/list/${email}`, {
    params: {
      page: page,
      size: size,
      keyword: keyword,
      searchType: searchType,
      sign: sign,
      category: category,
    },
  });
  return res.data;
};

export const getDeleteList = async (pageParam, email) => {
  const { page, size, keyword, searchType, sign, category } = pageParam;
  const res = await axios.get(`${host}/business/board/deletelist/${email}`, {
    params: {
      page: page,
      size: size,
      keyword: keyword,
      searchType: searchType,
      sign: sign,
      category: category,
    },
  });
  return res.data;
};

//사용자 AD 노출용 리스트
export const getADSPList = async () => {
  const res = await axios.get(`${host}/business/board/adlist`);
  return res.data;
};

//사용자 AD 노출용 리스트
export const getADPLList = async () => {
  const res = await axios.get(`${host}/business/board/adpllist`);
  return res.data;
};

//광고 클릭시 조회수 증가
export const viewCountAdd = async (no, email) => {
  const res = await axios.put(
    `${host}/business/board/viewcount/${no}/${email}`,
  );
  return res.data;
};

//비즈니스 회원 등록
export const postAdd = async (businessData) => {
  const res = await axios.post(`${host}/businessmember/`, businessData);
  return res.data;
};

//비즈니스 회원 비즈머니 충전
export const chargeBizMoney = async (email, amount) => {
  // 주소 뒤에 ?amount=10000 형태로 보냅니다.
  const res = await axios.put(
    `${host}/businessmember/charge/${email}?amount=${amount}`,
  );
  return res.data;
};

//비즈니스 회원 정보
export const getMyPage = async (email) => {
  const res = await axios.get(`${host}/businessmember/${email}`);
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

//비즈니스 상품 광고 데이터 통계
export const getBusinessStats = async (email, start, end) => {
  try {
    const res = await axios.get(`${API_SERVER_HOST}/business/board/stats`, {
      params: {
        email: email,
        start: start,
        end: end,
      },
    });
    return res.data;
  } catch (error) {
    console.error("통계 데이터를 가져오는 중 오류 발생:", error);
    // 에러 발생 시 빈 데이터 구조를 반환하여 컴포넌트 터짐 방지
    return {
      totalPowerLinkClicks: 0,
      totalPowerLinkCount: 0,
      totalPowerShoppingClicks: 0,
      totalPowerShoppingCount: 0,
      DailyStats: [],
    };
  }
};

export const spendMoneyByClick = async (email, amount, title) => {
  const res = await axios.put(
    `${host}/businessmember/spend/${email}?amount=${amount}&title=${title}`,
  );
  return res.data;
};

export const getBizMoneyHistory = async (pageParam, email) => {
  const { page, size, keyword, searchType, state } = pageParam;
  const res = await axios.get(`${host}/businessmember/history/${email}`, {
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

export const getTodaySpend = async (email) => {
  const res = await axios.get(`${host}/businessmember/todaySpend/${email}`);
  return res.data;
};

export const getTotalSpend = async (email) => {
  const res = await axios.get(`${host}/businessmember/totalSpend/${email}`);
  return res.data;
};

export const getTodayClick = async (email) => {
  const res = await axios.get(`${host}/businessmember/todayClick/${email}`);
  return res.data;
};

export const getTotalClick = async (email) => {
  const res = await axios.get(`${host}/businessmember/totalClick/${email}`);
  return res.data;
};
