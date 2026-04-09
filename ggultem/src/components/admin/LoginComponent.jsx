import { useState } from "react";
import "./LoginComponent.css";
import useCustomLogin from "../../hooks/useCustomLogin";
import { useNavigate } from "react-router";

const initState = {
  email: "",
  pw: "",
};

const LoginComponent = () => {
  const [loginParam, setLoginParam] = useState({ ...initState });
  const { doLogin, moveToPath, doLogout } = useCustomLogin();
  // 입력값 변경 핸들러
  const handleChange = (e) => {
    setLoginParam({ ...loginParam, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();

  const handleClickLogin = (e) => {
    e.preventDefault();

    doLogin(loginParam)
      .then((data) => {
        if (data.error) {
          alert("이메일 또는 비밀번호를 확인해주세요.");
        } else if(data.email === 'admin@honey.com') {
          alert(`${data.nickname}님, 관리자 페이지에 오신 걸 환영해요! 🍯`);
          moveToPath("/admin");
        } else {
          alert("관리자 계정이 아닌 회원은 접근할 수 없습니다.");
          doLogout();
          moveToPath("/admin/login");
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
        <div className="login-logo">GGULTEM-ADMIN</div>
        <h2 className="login-title">로그인</h2>
        <p className="login-subtitle">관리자님 로그인을 해주세요.</p>

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
            관리자 로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginComponent;
