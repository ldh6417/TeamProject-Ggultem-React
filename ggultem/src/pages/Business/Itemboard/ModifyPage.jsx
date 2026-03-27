import ModifyComponent from "../../../components/Business/Itemboard/ModifyComponent";
import Footer from "../../../include/business/Footer";
import Header from "../../../include/business/Header";
import "./ModifyPage.css";
import useCustomLogin from "../../../hooks/useCustomLogin";
import { getCookie } from "../../../util/cookieUtil";
import { useParams } from "react-router";

const RegisterPage = () => {
  const { no } = useParams();
  const { isLogin, moveToLoginReturn } = useCustomLogin();
  const memberInfo = getCookie("member");

  // 1. 로그인 여부 확인
  if (!isLogin) {
    alert("로그인 후 이용해 주세요.");
    return moveToLoginReturn();
  }

  // 2. 권한 체크: 'BUSINESS' 권한이 없는 경우 차단
  const isBusiness = memberInfo?.roleNames?.includes("BUSINESS");

  if (!isBusiness) {
    alert("비즈니스 회원만 접근 가능한 페이지입니다.");
    return moveToLoginReturn();
  }

  return (
    <div className="businessboard-page-wrapper">
      <Header />
      <main className="businessboard-main-content">
        <div className="businessboard-hero-section">
          <ModifyComponent no={no} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RegisterPage;
