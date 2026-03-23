import axios from "axios";

//서버 주소
export const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${API_SERVER_HOST}/board`;

export const getOne = async (boardNo) => {
  const res = await axios.get(`${prefix}/${boardNo}`);
  return res.data;
};

//등록
export const addBoard = async (boardObj) => {

  const formData = new FormData();

  formData.append("title", boardObj.title);
  formData.append("content", boardObj.content);
  formData.append("email", boardObj.email);

  // 파일 추가
  if (boardObj.files && boardObj.files.length > 0) {
    boardObj.files.forEach(file => {
      formData.append("files", file);
    });
  }

  const res = await axios.post(`${prefix}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  console.log("등록 결과:", res.data);

  return res.data;
};

export const getList = async (pageParam) => {
  const { page, size, keyword, searchType } = pageParam;
  const res = await axios.get(`${prefix}/list`, {
    params: {
      page: page,
      size: size,
      keyword: keyword,
      searchType: searchType,
    },
  });
  return res.data;
};
