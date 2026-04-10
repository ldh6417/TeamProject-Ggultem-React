import axios from "axios";
import { API_SERVER_HOST } from "../config";
export { API_SERVER_HOST };
const prefix = `${API_SERVER_HOST}/api/codegroup`;

//read
export const getOne = async (groupCode) => {
  const res = await axios.get(`${prefix}/${groupCode}`);
  return res.data;
};
//list / search
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
//create
export const postAdd = async (codeGroupObj) => {
  // codeGroupObj 예시: { groupName: "공통코드", useYn: "Y", enabled: 1 }
  const res = await axios.post(`${prefix}/`, codeGroupObj);
  return res.data;
};
//delete
export const deleteOne = async (groupCode) => {
  const res = await axios.delete(`${prefix}/${groupCode}`);
  return res.data;
};
//modify
export const putOne = async (codeGroup) => {
  // codeGroup 내부에 groupCode가 포함되어 있어야 합니다.
  const res = await axios.put(`${prefix}/${codeGroup.groupCode}`, codeGroup);
  return res.data;
};
