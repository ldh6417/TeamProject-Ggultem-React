import "./MyPageList.css"; // CSS 파일 임포트
import MyPageList from "../../components/ItemBoard/MyPageListComponent";
import Header from "../../include/Header";
import Footer from "../../include/Footer";

const ItemBoardListPage = () => {
  return (
    <div className="myPageList-page-wrapper">
      <Header />
      <main className="myPageList-main-content">
        <MyPageList />
      </main>
      <Footer />
    </div>
  );
};

export default ItemBoardListPage;
