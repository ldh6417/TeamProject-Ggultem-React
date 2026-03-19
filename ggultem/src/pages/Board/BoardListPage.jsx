import "./BoardListPage.css"; // CSS 파일 임포트
import BoardList from "../../components/Board/BoardListComponent";
import Header from "../../include/Header";
import Footer from "../../include/Footer";

const BoardListPage = () => {
  return (
    <div className="boardList-page-wrapper">
      <Header />
      <main className="boardList-main-content">
        <BoardList />
      </main>
      <Footer />
    </div>
  );
};

export default BoardListPage;
