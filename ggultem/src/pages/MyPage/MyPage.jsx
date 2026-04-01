import React, { useEffect } from "react";
import "./MyPage.css"; // CSS 파일 임포트
import MyPageMain from "../../components/MyPage/MyPageComponent";
import Header from "../../include/Header";
import Footer from "../../include/Footer";
import { useSelector } from "react-redux";
import useCustomLogin from "../../hooks/useCustomLogin";

const MyPage = () => {
  const loginState = useSelector((state) => state.loginSlice);
  console.log("현재 로그인 상태:", loginState);
  const { isLogin, moveToPath } = useCustomLogin();

  useEffect(() => {
    if (!isLogin) {
      alert("로그인 후 이용해 주세요.");
      moveToPath("/login");
      return;
    }
  }, [isLogin, moveToPath]);

  return (
    <div className="mp-mypage-page-wrapper">
      <Header />
      <main className="mp-mypage-main-content">
        <MyPageMain email={loginState.email} />
      </main>
      <Footer />
    </div>
  );
};

export default MyPage;
