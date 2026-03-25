import { Link, useNavigate } from "react-router";
import "./Header.css";
// 로고 이미지 경로를 프로젝트 구조에 맞게 수정하세요 (예: src/assets/logo.png)
import logoImg from "../assets/logo.png";
import { useSelector } from "react-redux";
import useCustomLogin from "../hooks/useCustomLogin";

export default function Header() {
  const navigate = useNavigate();
  const { doLogout } = useCustomLogin();

  // ✨ 리덕스 스토어에서 유저 정보를 실시간으로 감시!
  const loginState = useSelector((state) => state.loginSlice);

  // 🐝 지훈님, 콘솔에 뭐라고 찍히는지 꼭 확인해 보세요!
  console.log("현재 리덕스 로그인 상태:", loginState);

  const handleLogout = () => {
    doLogout();
    alert("로그아웃 되었습니다. 다음에 또 만나요! 🐝");
    navigate("/");
  };

  return (
    <header className="header-custom-header">
      <nav className="header-nav-container">
        {/* 로고 영역 */}
        <div className="header-nav-left">
          <Link to="/" className="header-nav-logo">
            <img src={logoImg} alt="꿀템 로고" className="header-logo-img" />
          </Link>
        </div>

        {/* 메뉴 영역 */}
        <div className="header-nav-center">
          <Link to="/itemBoard/list" className="header-nav-link">
            중고거래
          </Link>
          <Link to="/report/list" className="header-nav-link">
            사기조회
          </Link>
          <Link to="/board/list" className="header-nav-link">
            커뮤니티
          </Link>
          <Link to="/notice/list" className="header-nav-link">
            공지사항
          </Link>
          <Link to="/business" className="header-nav-link">
            비즈니스
          </Link>
        </div>

        <div className="header-nav-right">
          {loginState && loginState.email ? (
            // ✅ 로그인 성공 시: 닉네임과 로그아웃 버튼
            <div className="header-user-menu">
              <Link to={`/mypage`} className="header-user-nickname">
                🍯 {loginState.nickname}님
              </Link>
              <button
                onClick={handleLogout}
                className="header-nav-auth-btn logout"
              >
                로그아웃
              </button>
            </div>
          ) : (
            // ✅ 로그아웃 상태 시: 로그인 버튼
            <Link to="/login" className="header-nav-auth-btn login">
              로그인
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
