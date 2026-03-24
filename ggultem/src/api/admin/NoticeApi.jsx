import axios from "axios";

export const API_SERVER_HOST = "http://localhost:8080";

const prefix = `${API_SERVER_HOST}/admin/notice`;

// 등록
export const postAdd = async (formData) => {
  const res = await axios.post(`${prefix}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data", // 멀티파트 데이터임을 명시
    },
  });
  return res.data;
};

// 조회
export const getOne = async (noticeId) => {
  const res = await axios.get(`${prefix}/${noticeId}`);
  return res.data;
};

// 리스트
export const getList = async (pageParam) => {
  const { page, size, keyword, searchType } = pageParam;

  const res = await axios.get(`${prefix}/list`, {
    params: { page, size, keyword, searchType },
  });

  return res.data;
};

// 삭제(소프트 딜리트방식)
export const remove = async (noticeId) => {
  // 백엔드에서 삭제 여부를 관리하는 API 주소로 요청
  // 예: /api/admin/notice/soft-delete/123
  const res = await axios.put(`${prefix}/remove/${noticeId}`);
  return res.data;
};

// 수정
export const putOne = async (noticeId, formData) => {
  const res = await axios.put(`${prefix}/${noticeId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
