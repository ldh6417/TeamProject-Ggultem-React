import React, { useEffect, useState } from "react";
import { getChatRoomList } from "../../../api/ChatApi"; // API 함수는 따로 정의 필요
import { getOne } from "../../../api/ItemBoardApi"; // API 함수는 따로 정의 필요
import useCustomLogin from "../../../hooks/useCustomLogin";
import { useNavigate } from "react-router-dom";
import "./ChatListComponent.css";

const ChatListPage = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const { loginState } = useCustomLogin();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. 내가 참여 중인 채팅방 목록 가져오기
    // 서버의 /chatroom/list?keyword=내이메일&searchType=all 호출 가정
    const fetchRooms = async () => {
      try {
        const response = await getChatRoomList({
          page: 1,
          size: 10,
          keyword: loginState.email,
          searchType: "all",
        });
        setChatRooms(response.dtoList);
        console.log(chatRooms)
      } catch (error) {
        console.error("채팅 목록 로딩 실패:", error);
      }
    };

    if (loginState.email) fetchRooms();
  }, [loginState.email]);

  const handleMoveChat = (roomId) => {
    // 2. 클릭 시 해당 1:1 채팅방으로 이동 (팝업 또는 페이지 이동)
    navigate(`/chat/${roomId}`);
  };

  

  return (
    <div className="chat-list-container">
      <header className="chat-list-header">
        <h2>나의 꿀템 채팅 🍯</h2>
      </header>
      
      <ul className="chat-room-list">
        {chatRooms.length > 0 ? (
          chatRooms.map((room) => {
            // 상대방 닉네임 결정 로직
            const opponent = room.buyerId === loginState.email ? room.sellerId : room.buyerId;
            
            return (
              <li key={room.roomId} className="chat-room-item" onClick={() => handleMoveChat(room.roomId)}>
                <div className="room-avatar">{opponent.substring(0, 1).toUpperCase()}</div>
                <div className="room-info">
                  <div className="room-top">
                    <span className="opponent-name">{opponent}</span>
                    <span className="reg-date">방 번호: {room.roomId}</span>
                  </div>
                  <div className="room-bottom">
                    <span className="room-name-tag">[{room.roomName || "상품 문의"}]</span>
                    <p className="last-msg">클릭하여 대화를 시작하세요.</p>
                  </div>
                </div>
                <div className="enter-arrow">〉</div>
              </li>
            );
          })
        ) : (
          <p className="no-rooms">참여 중인 채팅방이 없습니다. 🐝</p>
        )}
      </ul>
    </div>
  );
};

export default ChatListPage;