import BoardRegisterComponent from "../../components/Board/BoardRegisterComponent";
import Header from "../../include/Header";
import Footer from "../../include/Footer";


const BoardRegisterPage = () => {
  return (
    <div className="boardList-page-wrapper">
      <Header />
      <main className="boardList-main-content">
        <BoardRegisterComponent />
      </main>
      <Footer />
    </div>
  );
};

export default BoardRegisterPage;


