import "./RegisterPage.css";
import RegisterComponent from "../../../components/admin/Banner/RegisterComponent";
import Menu from "../../../include/admin/Menu"; // Menu 임포트 확인!

const RegisterPage = () => {
  return (
    <div className="mainbanner-page-wrapper">
      <Menu />
      <main className="mainbanner-main-content">
        <div className="mainbanner-hero-section">
          {/* 상세 컴포넌트에 이메일 전달 */}
          <RegisterComponent />
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
