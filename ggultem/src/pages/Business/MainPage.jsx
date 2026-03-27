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
    <div className="main-container">
      <Header />

      <main className="content-area">
        <div className="hero-section">
          <img src={logoImg} alt="꿀템 로고" className="header-logo-img" />
          <h2>꿀템 비즈니스 센터</h2>

          {/* 하단 버튼형 메뉴 */}
          <div className="content-wrapper-wide">
            <Link to="/business/register" className="content-card-wide">
              <div className="content-box">비즈니스 회원 등록</div>
            </Link>
            <Link to="/business/list" className="content-card-wide">
              <div className="content-box">비즈니스 센터 이동</div>
            </Link>
          </div>
        </div>
        <AD />
      </main>

      <Footer />
    </div>
  );
};

export default MainPage;
