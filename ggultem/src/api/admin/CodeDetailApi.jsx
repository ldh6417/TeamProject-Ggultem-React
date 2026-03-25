import axios from "axios";

export const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${API_SERVER_HOST}/codedetail`;

// 특정 그룹에 속한 상세 코드 목록 가져오기
export const getListByGroup = async (pageParam, groupCode) => {
  const { page, size, keyword, searchType } = pageParam;

  const res = await axios.get(`${prefix}/list/${groupCode}`, {
    params: {
      page: page,
      size: size,
      keyword: keyword,
      searchType: searchType,
    },
  });
  return res.data;
};

// 상세 코드 하나 읽기
export const getDetailOne = async (groupCode, detailCode) => {
  const res = await axios.get(`${prefix}/${groupCode}/${detailCode}`);
  return res.data;
};

// 상세 코드 등록
export const postDetailAdd = async (detailObj) => {
  // detailObj: { groupCode: "CAT01", detailCode: "DIGITAL", detailName: "전자기기", useYn: "Y", sortOrder: 1 }
  const res = await axios.post(`${prefix}/`, detailObj);
  return res.data;
};

// 상세 코드 수정 (기존 코드에 포함됨)
export const putDetailOne = async (detailObj) => {
  // detailObj는 groupCode와 detailCode를 반드시 포함해야 함
  const res = await axios.put(`${prefix}/${detailObj.groupCode}`, detailObj);
  return res.data;
};

// 상세 코드 삭제
export const deleteDetailOne = async (groupCode, codeValue) => {
  const res = await axios.delete(`${prefix}/remove/${groupCode}/${codeValue}`);
  return res.data;
};
