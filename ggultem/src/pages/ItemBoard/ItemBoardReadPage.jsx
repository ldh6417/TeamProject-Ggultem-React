import ItemBoardRead from "../../components/ItemBoard/ItemBoardReadComponent";
import Header from "../../include/Header";
import Footer from "../../include/Footer";
import AD from "../../include/business/AD";

const ItemBoardListPage = () => {
  return (
    <div className="itemBoardRead-page-wrapper">
      <Header />
      <main className="itemBoardRead-main-content">
        <ItemBoardRead />
      </main>
      <AD />
      <Footer />
    </div>
  );
};

export default ItemBoardListPage;
