import React, { useEffect, useState } from "react";
import { getChatRoomList } from "../../../api/ChatApi"; // API 함수는 따로 정의 필요
import { getOne } from "../../../api/ItemBoardApi"; // API 함수는 따로 정의 필요
import useCustomLogin from "../../../hooks/useCustomLogin";
import { useNavigate } from "react-router-dom";
import "./ChatListComponent.css";

// 1. 시간 포맷팅 함수 추가 (오늘이면 시간, 어제 이전이면 날짜 노출)
const formatTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  
  // 오늘인지 확인
  const isToday = date.toDateString() === now.toDateString();
  
  if (isToday) {
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  } else {
    // 오늘이 아니면 월/일 노출
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }
};

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
    <div className="sq-chat-list-wrapper">
    <header className="sq-chat-header">
      <h2>나의 꿀템 채팅</h2>
    </header>
    
    <ul className="sq-chat-room-list">
      {chatRooms.length > 0 ? (
        chatRooms.map((room) => {
          const opponent = room.buyerId === loginState.email ? room.sellerId : room.buyerId;
          
          return (
            <li key={room.roomId} className="sq-chat-room-item" onClick={() => handleMoveChat(room.roomId)}>
              {/* 상대방 이름 첫 글자 아바타 */}
              <div className="sq-room-avatar">{opponent.substring(0, 1).toUpperCase()}</div>
              
              <div className="sq-room-info">
                <div className="sq-room-top">
                  <span className="sq-opponent-name">{opponent}</span>
                  {/* ✨ 마지막 메시지 시간 (formatTime 함수 활용) */}
                  <span className="sq-reg-date">{formatTime(room.lastSendTime)}</span>
                </div>
                <div className="sq-room-bottom">
                  {/* ✨ 마지막 메시지 내용 노출 (최대 1줄) */}
                  <p className="sq-last-msg">{room.lastMessage}</p>
                </div>
              </div>

              <div className="sq-room-meta">
                {/* 🔴 안 읽은 메시지가 있을 때만 노출되는 알림 뱃지 */}
                {room.unReadCount > 0 && (
                  <span className="sq-unread-badge">
                    {room.unReadCount > 99 ? "99+" : room.unReadCount}
                  </span>
                )}
                <div className="sq-enter-arrow">〉</div>
              </div>
            </li>
          );
        })
      ) : (
        <p className="sq-no-rooms">참여 중인 채팅방이 없습니다.</p>
      )}
    </ul>
  </div>
  );
};

export default ChatListPage;