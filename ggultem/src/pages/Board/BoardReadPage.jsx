import { useParams } from "react-router-dom";
import Header from "../../include/Header";
import Footer from "../../include/Footer";
import BoardRead from "../../components/Board/BoardReadComponent";

const ReadPage = () => {
  const { boardNo } = useParams();

  return (
    <div className="bd-board-read-wrapper">
      <Header />
      <main className="bd-board-read-content">
        <BoardRead boardNo={boardNo} />
      </main>
      <Footer />
    </div>
  );
};

export default ReadPage;