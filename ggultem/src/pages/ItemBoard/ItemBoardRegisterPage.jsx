import "./ItemBoardRegisterPage.css"; // CSS 파일 임포트
import ItemBoardRegister from "../../components/ItemBoard/ItemBoardRegisterComponent";
import Header from "../../include/Header";
import Footer from "../../include/Footer";

const ItemBoardListPage = () => {
  return (
    <div className="itemBoardRegister-page-wrapper">
      <Header />
      <main className="itemBoardRegister-main-content">
        <ItemBoardRegister />
      </main>
      <Footer />
    </div>
  );
};

export default ItemBoardListPage;
