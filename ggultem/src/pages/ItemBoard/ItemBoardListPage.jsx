import "./ItemBoardListPage.css"; // CSS 파일 임포트
import ItemBoardList from "../../components/ItemBoard/ItemBoardListComponent";
import Header from "../../include/Header";
import Footer from "../../include/Footer";

const ItemBoardListPage = () => {
  return (
    <div className="itemBoardList-page-wrapper">
      <Header />
      <main className="itemBoardList-main-content">
        <ItemBoardList />
      </main>
      <Footer />
    </div>
  );
};

export default ItemBoardListPage;
