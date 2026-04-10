import axios from "axios";
import { API_SERVER_HOST } from "../config";
export { API_SERVER_HOST };
const prefix = `${API_SERVER_HOST}/admin/itemBoard`;

export const getOne = async (id) => {
  const res = await axios.get(`${prefix}/${id}`);
  return res.data;
};

export const getList = async (pageParam) => {
  const { page, size, enabled, keyword, searchType } = pageParam;
  const res = await axios.get(`${prefix}/list`, {
    params: {
      page: page,
      size: size,
      keyword: keyword,
      searchType: searchType,
      // enabled가 없으면 서버에 보내지 않음 (그럼 서버 DTO에서 null이 됨)
      enabled:
        enabled === null || enabled === undefined || enabled === ""
          ? null
          : enabled,
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

export const deleteOne = async (id, type = "delete") => {
  const res = await axios.get(`${prefix}/${type}/${id}`);
  return res.data;
};

export const putOne = async (id, formData) => {
  const header = {
    headers: { "Content-Type": "multipart/form-data" },
  };

  const res = await axios.put(`${prefix}/${id}`, formData, header);

  return res.data;
};
