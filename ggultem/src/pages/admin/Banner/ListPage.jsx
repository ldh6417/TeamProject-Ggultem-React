import Menu from "../../../include/admin/Menu";
import ListBanner from "../../../components/admin/Banner/ListComponent";
import "./ListPage.css";
import useCustomLogin from "../../../hooks/useCustomLogin";

const MainPage = () => {
  const { isLogin, moveToAdminLoginReturn } = useCustomLogin();

  if (!isLogin) {
    return moveToAdminLoginReturn();
  }

  return (
    <div className="mainbanner-page-wrapper">
      <Menu />
      <main className="mainbanner-main-content">
        <div className="mainbanner-hero-section">
          <ListBanner />
        </div>
      </main>
    </div>
  );
};

export default MainPage;
