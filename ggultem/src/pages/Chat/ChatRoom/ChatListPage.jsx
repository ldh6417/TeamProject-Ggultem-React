import ChatRoomListComponent from "../../../components/Chat/ChatRoom/ChatListComponent";
import Header from "../../../include/Header"
import Footer from "../../../include/Footer"
import "./ChatListPage.css";

const ChatPage = () => {

  return (
    <div className="Chatlist-page-container">
        <Header />
      <main className="Chatlist-content-area">
        <div className="Chatlist-wrapper">
          <ChatRoomListComponent  />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChatPage;
