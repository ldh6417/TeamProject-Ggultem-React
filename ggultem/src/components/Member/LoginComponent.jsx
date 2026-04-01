import { useState } from "react";
import "./LoginComponent.css";
import useCustomLogin from "../../hooks/useCustomLogin";
import { getKakaoLoginLink } from "../../api/MemberApi";
import { Link, useNavigate } from "react-router";

const initState = {
  email: "",
  pw: "",
};

const LoginComponent = () => {
  const [loginParam, setLoginParam] = useState({ ...initState });
  const { doLogin, moveToPath } = useCustomLogin();
  // 입력값 변경 핸들러
  const handleChange = (e) => {
    setLoginParam({ ...loginParam, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();

  const handleKakaoLogin = () => {
    // 카카오 인증 페이지로 이동
    window.location.href = getKakaoLoginLink();
  };

  // 1. 구글 클라이언트 ID와 리디렉션 URI를 변수로 따로 빼두면 관리가 편해요!
  const Google_Client_ID =
    "609985158917-cv8r77jfiqs9p5fejnmpprq6ktn8vr7c.apps.googleusercontent.com";
  const Google_Redirect_URI = "http://localhost:5173/member/google";

  // 2. 주소 구성 (문자열 안에 변수를 넣을 때는 `(백틱)과 ${}를 사용합니다)
  const googleAddr = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${Google_Client_ID}&redirect_uri=${Google_Redirect_URI}&response_type=code&scope=email%20profile`;

  const handleGoogleLogin = () => {
    window.location.href = googleAddr;
  };

  const handleClickLogin = (e) => {
    e.preventDefault();

    doLogin(loginParam)
      .then((data) => {
        if (data.error) {
          alert("이메일 또는 비밀번호를 확인해주세요.");
        } else {
          alert(`${data.nickname}님, 꿀템에 오신 걸 환영해요! 🍯`);
          moveToPath("/");
        }
      })
      .catch((err) => {
        console.error("로그인 에러 상세:", err);

        // 서버에서 ResponseEntity로 보냈다면 data.error에 담겨옵니다.
        const errorStatus = err.response?.data?.error;

        if (errorStatus === "DELETED_USER") {
          alert("탈퇴한 계정입니다. 재가입은 고객센터에 문의해주세요. 🐝");
          navigate("/", { replace: true });
        } else if (errorStatus === "STOP_USER") {
          alert("정지된 계정입니다. 고객센터에 문의해주세요.");
          navigate("/", { replace: true });
        } else {
          alert("로그인 중 오류가 발생했습니다.");
          navigate("/login", { replace: true });
        }
      });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <span className="header-logo-text">
          <span className="logo-g">G</span>꿀템
        </span>
        <h2 className="login-title">로그인</h2>
        <p className="login-subtitle">오늘도 달콤한 득템을 시작해볼까요?</p>

        <form className="login-form">
          <div className="input-group">
            <label>이메일</label>
            <input
              type="email"
              name="email"
              placeholder="example@honey.com"
              value={loginParam.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>비밀번호</label>
            <input
              type="password"
              name="pw"
              placeholder="비밀번호를 입력하세요"
              value={loginParam.pw}
              onChange={handleChange}
            />
          </div>

          <button className="login-btn" onClick={handleClickLogin}>
            꿀템 로그인
          </button>
          <Link to={"/member/register"} className="sign_up_btn">
            꿀템 회원가입
          </Link>
        </form>

        <div className="social-login-container">
          <p className="social-text">간편하게 시작하기</p>
          <div className="social-buttons">
            {/* 카카오 버튼 */}
            <button onClick={handleKakaoLogin} className="social-btn kakao">
              <span className="social-btn-text">카카오로 계속하기</span>
            </button>

            {/* 구글 버튼 */}
            <button onClick={handleGoogleLogin} className="social-btn google">
              <span className="social-btn-text">Google로 계속하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
