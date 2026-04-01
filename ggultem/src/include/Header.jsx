import { Link, useNavigate } from "react-router";
import "./Header.css";
// 로고 이미지 경로를 프로젝트 구조에 맞게 수정하세요 (예: src/assets/logo.png)
import logoImg from "../assets/header_logo.png";
import { useSelector } from "react-redux";
import useCustomLogin from "../hooks/useCustomLogin";
import { useEffect, useRef } from "react";

export default function Header() {
  const navigate = useNavigate();
  const { doLogout } = useCustomLogin();
  // useRef를 사용하여 팝업창 객체를 관리. (재렌더링되어도 값이 유지됨)
  const chatWindowRef = useRef(null);

  // ✨ 리덕스 스토어에서 유저 정보를 실시간으로 감시!
  const loginState = useSelector((state) => state.loginSlice);

  // 🐝 지훈님, 콘솔에 뭐라고 찍히는지 꼭 확인해 보세요!
  console.log("현재 리덕스 로그인 상태:", loginState);

  const handleLogout = () => {
    doLogout();
    alert("로그아웃 되었습니다. 다음에 또 만나요! 🐝");
    navigate("/");
  };

  // 2. 채팅 팝업 열기 함수
  const openChatPopup = (e) => {
    e.preventDefault(); // Link 태그의 기본 이동 방지

    const url = "/chat";
    const name = "ChatPopup";
    const options =
      "width=500,height=700,top=100,left=100,scrollbars=no,resizable=no";

    // 팝업창을 열고 ref에 저장
    chatWindowRef.current = window.open(url, name, options);
  };

  // 3. useEffect를 사용하여 전역 이벤트 등록 및 해제
  useEffect(() => {
    const handleFocus = () => {
      // 팝업창이 존재하고 닫히지 않았다면 포커스를 줌
      if (chatWindowRef.current && !chatWindowRef.current.closed) {
        chatWindowRef.current.focus();
      }
    };

    window.addEventListener("focus", handleFocus);

    // 컴포넌트가 사라질 때 이벤트 리스너 제거 (메모리 누수 방지)
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return (
    <header className="header-custom-header">
      <nav className="header-nav-container">
        {/* 로고 영역 */}
        <div className="header-nav-left">
          <Link to="/" className="nav-logo">
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
            <div className="header-user-menu">
              <Link to={`/chatroom/list`} className="nav-item">
                Chat
              </Link>

              <Link to={`/mypage`} className="header-user-nickname">
                MyPage
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
