import { useParams } from "react-router";
import Header from "../../include/Header"
import Footer from "../../include/Footer"
import ChatComponent from "../../components/Chat/ChatComponent";
import "./ChatPage.css";

const ChatPage = () => {
const {roomId} = useParams();

  return (
    <div className="Chatlist-page-container">
      <Header />
      <main className="Chatlist-content-area">
        <div className="Chatlist-wrapper">
          <ChatComponent roomId={roomId} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChatPage;
