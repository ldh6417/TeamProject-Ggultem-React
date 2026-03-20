import axios from "axios";

//서버 주소
export const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${API_SERVER_HOST}/itemBoard`;

export const getOne = async (id) => {
  const res = await axios.get(`${prefix}/${id}`);
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

export const postAdd = async (formData) => {
  const header = {
    headers: { "Content-Type": "multipart/form-data" },
  };

  const res = await axios.post(`${prefix}/`, formData, header);

  return res.data;
};
