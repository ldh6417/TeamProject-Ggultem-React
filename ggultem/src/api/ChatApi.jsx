import axios from "axios";

export const API_SERVER_HOST = "http://localhost:8080";
const host = `${API_SERVER_HOST}/chatroom`;

// 1. 채팅방 목록 가져오기 (검색 및 페이징 포함)
export const getChatRoomList = async (searchDTO) => {
  // searchDTO: { page, size, keyword, searchType }
  const res = await axios.get(`${host}/list`, { params: searchDTO });
  return res.data;
};

// 2. 새로운 채팅방 생성 (또는 기존 방 번호 받기)
export const postChatAdd = async (chatObj) => {
  // chatRoomDTO: { buyerId, sellerId, itemId, roomName }
  const res = await axios.post(`${host}/`, chatObj);
  return res.data; // { "roomId": 15 } 형태
};

// 3. 특정 채팅방 정보 한 건 가져오기
export const getChatRoom = async (roomId) => {
  const res = await axios.get(`${host}/${roomId}`);
  return res.data;
};

// 4. 채팅방 삭제 (Soft Delete)
export const removeChatRoom = async (roomId) => {
  const res = await axios.delete(`${host}/remove/${roomId}`);
  return res.data;
};

// ChatApi.jsx
export const getChatMessages = async (roomId) => {
  // 🐝 지훈님, 콘솔에 roomId가 'undefined'로 찍히지 않는지 꼭 확인하세요!
  console.log("요청 보내는 roomId:", roomId); 
  
  if (!roomId) return []; // roomId가 없으면 아예 요청을 안 보냄

  // host 뒤에 /chatroom이 빠지지 않았는지 확인!
  const res = await axios.get(`${host}/messages/${roomId}`); 
  return res.data;
};

// ✅ 읽음 처리 API 호출
export const updateReadStatus = async (roomId, userId) => {
  // 백엔드 컨트롤러의 @PutMapping("/{roomId}/read")와 맞춘다고 가정
  const res = await axios.put(`${host}/${roomId}/read`, null, {
    params: { userId: userId } 
  });
  return res.data;
};