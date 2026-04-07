import React, { useEffect, useState } from "react";
import Header from "../../include/Header";
import "./MainPage.css";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../include/Footer";
import logoImg from "../../assets/logo.png";
import AD from "../../include/business/AD";
import useCustomLogin from "../../hooks/useCustomLogin";

const MainPage = () => {
  const { isLogin, moveToPath } = useCustomLogin();

  useEffect(() => {
    if (!isLogin) {
      alert("로그인 후 이용해 주세요.");
      moveToPath("/login");
      return;
    }
  }, [isLogin, moveToPath]);

  return (
    <div className="business-main-container">
      <Header />

      <main className="business-content-area">
        <div className="business-hero-section">
          <div className="business-banner-container">
            {/* 👈 왼쪽: 홍보 문구 영역 */}
            <div className="business-text-section">
              <h2 className="business-title">
                꿀템 비즈니스 파트너를 모집합니다
              </h2>
              <p className="business-subtitle">
                당신의 상품을 알릴 꿀같은 선택
                <br /> 지금바로 신청하세요!
              </p>
            </div>

            {/* 👉 오른쪽: 버튼 세로 정렬 영역 */}
            <div className="business-button-section">
              <Link to="/business/register" className="business-btn-card">
                <div className="btn-content">
                  <span className="btn-text">비즈니스 회원 등록</span>
                </div>
              </Link>
              <Link to="/business/list" className="business-btn-card">
                <div className="btn-content">
                  <span className="btn-text">비즈니스 센터 이동</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <AD />
      </main>

      <Footer />
    </div>
  );
};

export default MainPage;
