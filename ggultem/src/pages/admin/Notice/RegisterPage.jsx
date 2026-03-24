import RegisterComponent from "../../../components/admin/Notice/RegisterComponent";
import Menu from "../../../include/admin/Menu";
import "./RegisterPage.css";

const AdminNoticePage = () => {
  return (
    <div className="noticeinfo-page-wrapper">
      <Menu />
      <main className="noticeinfo-main-content">
        <div className="noticeinfo-hero-section">
          <RegisterComponent />
        </div>
      </main>
    </div>
  );
};

export default AdminNoticePage;
