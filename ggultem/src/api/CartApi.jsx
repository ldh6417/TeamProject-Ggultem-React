import axios from "axios";

//서버 주소
export const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${API_SERVER_HOST}/cart`;

export const getOne = async (id) => {
  const res = await axios.get(`${prefix}/${id}`);
  return res.data;
};

export const getList = async (pageParam) => {
  const { page, size, email, keyword, searchType } = pageParam;
  const res = await axios.get(`${prefix}/list`, {
    params: {
      page: page,
      size: size,
      email: email,
      keyword: keyword,
      searchType: searchType,
    },
  });

  return res.data;
};

export const postAdd = async (cartObj) => {
  const res = await axios.post(`${prefix}/`, cartObj, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

export const deleteOne = async (id) => {
  console.log("API로 넘어온 ID 값:", id); // 여기에 숫자가 정확히 찍히는지 확인!

  // 만약 id가 객체라면 id.id 형태로 보내야 할 수도 있습니다.
  const res = await axios.get(`${prefix}/delete/${id}`);
  return res.data;
};
