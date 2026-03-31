import Menu from "../../../include/admin/Menu";
import BizMoneyList from "../../../components/admin/BizMoney/ListComponent";
import "./ListPage.css";
import useCustomLogin from "../../../hooks/useCustomLogin";

const MainPage = () => {
  const { isLogin, moveToAdminLoginReturn } = useCustomLogin();

  if (!isLogin) {
    return moveToAdminLoginReturn();
  }

  return (
    <div className="bizmoneyinfo-page-wrapper">
      <Menu />
      <main className="bizmoneyinfo-main-content">
        <div className="bizmoneyinfo-hero-section">
          <BizMoneyList />
        </div>
      </main>
    </div>
  );
};

export default MainPage;
