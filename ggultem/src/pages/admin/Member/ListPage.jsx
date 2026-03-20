import Menu from "../../../include/admin/Menu";
import ListMember from "../../../components/admin/Member/ListComponent";
import "./ListPage.css";
import useCustomLogin from "../../../hooks/useCustomLogin";

const MainPage = () => {
  const { isLogin, moveToAdminLoginReturn } = useCustomLogin();

  if (!isLogin) {
    return moveToAdminLoginReturn();
  }

  return (
    <div className="memberinfo-page-wrapper">
      <Menu />
      <main className="memberinfo-main-content">
        <div className="memberinfo-hero-section">
          <ListMember />
        </div>
      </main>
    </div>
  );
};

export default MainPage;
