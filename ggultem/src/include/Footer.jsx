import logoImg from "../assets/header_logo.png";
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
          </div>
          <div className="footer-info-center">
            <img src={logoImg} alt="꿀템 로고" className="header-logo-img" />
          </div>
          <div className="footer-info-right">
            <p>
              <strong>전화번호 :</strong> 010-8735-4875
            </p>
            <p>
              <strong>이메일 :</strong> ohjh9701@naver.com
            </p>
            <p className="footer-copyright">
              © 2026 Ggultem Project. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
