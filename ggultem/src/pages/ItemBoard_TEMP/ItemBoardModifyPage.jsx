import "./ItemBoardModifyPage.css"; // CSS 파일 임포트
import ItemBoardModify from "../../components/ItemBoard/ItemBoardModifyComponent";
import Header from "../../include/Header";
import Footer from "../../include/Footer";
import AD from "../../include/business/AD";

const ItemBoardListPage = () => {
  return (
    <div className="itemBoardModify-page-wrapper">
      <Header />
      <main className="itemBoardModify-main-content">
        <ItemBoardModify />
      </main>
      <AD />
      <Footer />
    </div>
  );
};

export default ItemBoardListPage;
