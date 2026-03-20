import { Link, useNavigate } from "react-router";
import "./Menu.css";
// 로고 이미지 경로를 프로젝트 구조에 맞게 수정하세요 (예: src/assets/logo.png)
import logoImg from "../../assets/logo.png";
import { removeCookie } from "../../util/cookieUtil";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeCookie("member");
    alert("로그아웃 되었습니다. 다음에 또 만나요! 🐝");
    navigate("/");
    window.location.reload(); // 상태 반영을 위해 새로고침
  };

  return (
    <header className="custom-header">
      <nav className="nav-container">
        {/* 로고 영역 */}
        <div className="nav-top">
          <Link to="/" className="nav-logo">
            <img src={logoImg} alt="꿀템 로고" className="header-logo-img" />
          </Link>
        </div>

        {/* 메뉴 영역 */}
        <div className="nav-center">
          <Link to="/admin/member/list" className="nav-link">
            회원정보관리
          </Link>
          <Link to="/admin/itemboard/list" className="nav-link">
            중고거래 게시판 관리
          </Link>
          <Link to="/admin/report/list" className="nav-link">
            신고 게시판 관리
          </Link>
          <Link to="/admin/board/list" className="nav-link">
            커뮤니티 관리
          </Link>
          <Link to="/admin/notice/list" className="nav-link">
            공지사항 관리
          </Link>
          <Link to="/admin/blacklist/list" className="nav-link">
            블랙리스트
          </Link>
          <Link to="/admin/searchrank/list" className="nav-link">
            인기검색어
          </Link>
          <Link to="/admin/code/list" className="nav-link">
            코드관리
          </Link>
        </div>

        <div className="nav-bottom">
          <button onClick={handleLogout} className="nav-auth-btn logout">
            로그아웃
          </button>
        </div>
      </nav>
    </header>
  );
}
