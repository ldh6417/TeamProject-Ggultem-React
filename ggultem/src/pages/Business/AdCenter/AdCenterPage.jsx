import AdCenterComponent from "../../../components/Business/AdCenter/AdCenterComponent";
import Footer from "../../../include/business/Footer";
import Header from "../../../include/business/Header";
import "./AdCenterPage.css";
import useCustomLogin from "../../../hooks/useCustomLogin";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const AdCenterPage = () => {
  const { moveToPath } = useCustomLogin();
  const nav = useNavigate();
  const loginState = useSelector((state) => state.loginSlice);

  // 2. 권한 체크: 'BUSINESS' 권한이 없는 경우 차단
  const isBusiness = loginState.roleNames.includes("BUSINESS");

  useEffect(() => {
    if (!isBusiness) {
      alert("비즈니스 회원만 접근 가능한 페이지입니다.");
      moveToPath("/business/register");
      return; // 👈 매우 중요! 이후의 렌더링이나 API 호출을 중단합니다.
    }
  }, [isBusiness, moveToPath]);

  if (!isBusiness) {
    return <div className="loading-spinner">권한 확인 중...</div>;
  }

  return (
    <div className="businessAdCenter-page-wrapper">
      <Header />
      <main className="businessAdCenter-main-content">
        <div className="businessAdCenter-hero-section">
          <AdCenterComponent />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdCenterPage;
