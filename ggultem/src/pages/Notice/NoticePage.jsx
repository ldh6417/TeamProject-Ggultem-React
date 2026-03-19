import "./NoticePage.css"; // CSS 파일 임포트
import NoticeList from "../../components/Notice/NoticeComponent";
import Header from "../../include/Header";
import Footer from "../../include/Footer";

const NoticePage = () => {
  return (
    <div className="notice-page-wrapper">
      <Header />
      <main className="notice-main-content">
        <NoticeList />
      </main>
      <Footer />
    </div>
  );
};

export default NoticePage;
