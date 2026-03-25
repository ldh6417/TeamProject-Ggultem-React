import React from "react";
import { Link } from "react-router-dom"; // router-dom으로 임포트 확인하세요!
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer-custom-footer">
      <div className="footer-container">
        {/* 상단: 링크 영역 */}
        <div className="footer-links">
          <Link to="/business/manage">상품관리</Link>
          <span className="footer-divider">|</span>
          <Link to="/business/ad">광고센터</Link>
          <span className="footer-divider">|</span>
          <Link to="/">꿀템페이지 이동</Link>
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
