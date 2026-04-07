import logoImg from "../assets/header_logo.png";
import gitImg from "../assets/github.png";
import { Link } from "react-router-dom"; // router-dom으로 임포트 확인하세요!
import "./Footer.css";
import { useSelector } from "react-redux";

export default function Footer() {
  const loginState = useSelector((state) => state.loginSlice);

  return (
    <footer className="footer-custom-footer">
      <div className="footer-container">
        {/* 상단: 링크 영역 */}
        <div className="footer-links">
          <Link to="/itemBoard">중고거래</Link>
          <span className="footer-divider">|</span>
          <Link to="/report">사기조회</Link>
          <span className="footer-divider">|</span>
          <Link to="/board/list">커뮤니티</Link>
          <span className="footer-divider">|</span>
          <Link to="/notice/list">공지사항</Link>
          <span className="footer-divider">|</span>
          <Link to="/business">비즈니스</Link>
          <span className="footer-divider">|</span>
          <div className="header-user-menu">
            {loginState && loginState.email === "admin@honey.com" ? (
              <Link to="/admin">관리자 페이지</Link>
            ) : (
              <Link to="/mypage">마이페이지</Link>
            )}
          </div>
        </div>

        <hr className="footer-hr" />

        {/* 하단: 회사 및 팀 정보 영역 */}
        <div className="footer-info">
          <div className="footer-info-left">
            <p>
              <strong>상호명 :</strong> 꿀같은 득템, 꿀템
            </p>
            <p>
              <strong>팀 :</strong> 꿀템프로젝트
            </p>
                        <p>
              <img src={gitImg} alt="깃허브 로고" className="github-logo-img" />
              <Link to={"https://github.com/ohjh9701"}> 오지훈(BE/FE) </Link>
            </p>
            <p>
              <img src={gitImg} alt="깃허브 로고" className="github-logo-img" />
              <Link to={"https://github.com/92Ray"}> 위대근(BE/FE) </Link>
            </p>
            <p>
              <img src={gitImg} alt="깃허브 로고" className="github-logo-img" />
              <Link to={"https://github.com/sauce0428"}> 권태현(BE/FE) </Link>
            </p>
            <p>
              <img src={gitImg} alt="깃허브 로고" className="github-logo-img" />
              <Link to={"https://github.com/ldh6417"}> 이도훈(BE/FE) </Link>
            </p>
            <p>
              <img src={gitImg} alt="깃허브 로고" className="github-logo-img" />
              <Link to={"https://github.com/dldydtjr003"}> 이용석(BE/FE) </Link>
            </p>
          </div>
          <div className="footer-info-right">
<img src={logoImg} alt="꿀템 로고" className="header-logo-img" />
            
            <p className="footer-copyright">
              © 2026 Ggultem Project. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
