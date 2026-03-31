import { Link, useNavigate } from "react-router";
import "./Header.css";
// 로고 이미지 경로를 프로젝트 구조에 맞게 수정하세요 (예: src/assets/logo.png)
import logoImg from "../../assets/logo.png";
import { useSelector } from "react-redux";
import useCustomLogin from "../../hooks/useCustomLogin";

export default function Header() {
  const navigate = useNavigate();
  const { doLogout } = useCustomLogin();

  // ✨ 리덕스 스토어에서 유저 정보를 실시간으로 감시!
  const loginState = useSelector((state) => state.loginSlice);

  const handleLogout = () => {
    doLogout();
    alert("로그아웃 되었습니다. 다음에 또 만나요!");
    navigate("/");
  };

  return (
    <header className="business-header-custom-header">
      <nav className="business-header-nav-container">
        {/* 로고 영역 */}
        <div className="business-header-nav-left">
          <Link to="/business/list" className="business-header-nav-logo">
            {/* 이미지 대신 텍스트 로고로 변경 */}
            <span className="business-header-logo-text">
              <span className="business-logo-g">G</span>꿀템
            </span>
          </Link>
        </div>

        {/* 메뉴 영역 */}
        <div className="business-header-nav-center">
          <Link
            to="/business/board/list"
            className="business-header-nav-link business"
          >
            상품관리
          </Link>
          <Link
            to="/business/bizmoney"
            className="business-header-nav-link business"
          >
            비즈머니
          </Link>
        </div>

        <div className="business-header-nav-right">
          <div className="business-header-user-menu">
            <Link
              to={`/business/list`}
              className="business-header-user-nickname"
            >
              MyPage
            </Link>
            <button
              onClick={handleLogout}
              className="business-header-nav-auth-btn logout"
            >
              로그아웃
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
