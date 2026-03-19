import React from "react";
import "./MyPage.css"; // CSS 파일 임포트
import MyPageMain from "../../components/MyPage/MyPageComponent";
import Header from "../../include/Header";
import Footer from "../../include/Footer";
import { useSelector } from "react-redux";

const MyPage = () => {
  const email = useSelector((state) => state.loginSlice.email);
  return (
    <div className="mp-mypage-page-wrapper">
      <Header />
      <main className="mp-mypage-main-content">
        <MyPageMain email={email} />
      </main>
      <Footer />
    </div>
  );
};

export default MyPage;
