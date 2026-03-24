import ListComponent from "../../../components/admin/Notice/ListComponent";
import Menu from "../../../include/admin/Menu";
import useCustomLogin from "../../../hooks/useCustomLogin";
import "./ListPage.css";

const ListPage = () => {
  const { isLogin, moveToAdminLoginReturn } = useCustomLogin();

  if (!isLogin) {
    return moveToAdminLoginReturn();
  }
  return (
    <div className="noticeinfo-page-wrapper">
      <Menu />
      <main className="noticeinfo-main-content">
        <div className="noticeinfo-hero-section">
          <ListComponent />
        </div>
      </main>
    </div>
  );
};

export default ListPage;
