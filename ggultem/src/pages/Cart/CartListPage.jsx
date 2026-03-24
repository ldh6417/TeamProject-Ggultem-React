import "./CartListPage.css"; // CSS 파일 임포트
import CartList from "../../components/Cart/CartListComponent";
import Header from "../../include/Header";
import Footer from "../../include/Footer";

const ItemBoardListPage = () => {
  return (
    <div className="cartList-page-wrapper">
      <Header />
      <main className="cartList-main-content">
        <CartList />
      </main>
      <Footer />
    </div>
  );
};

export default ItemBoardListPage;
