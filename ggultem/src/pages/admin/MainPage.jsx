import Menu from "../../include/admin/Menu";
import "./MainPage.css";
import MainDashBoard from "../../components/admin/MainDashBoard";
import useCustomLogin from "../../hooks/useCustomLogin";

const MainPage = () => {
  const { isLogin, moveToAdminLoginReturn, loginState, doLogout } = useCustomLogin();

  if (!isLogin) {
    return moveToAdminLoginReturn();
  }

  if(loginState.email !== 'admin@honey.com') {
    doLogout();
    return moveToAdminLoginReturn();
  }

  return (
    <div className="main-container">
      <Menu />

      <main className="content-area">
        <div className="hero-section">
          <MainDashBoard />
        </div>
      </main>
    </div>
  );
};

export default MainPage;
