import Menu from "../../../include/admin/Menu";
import AdminBoardListComponent from "../../../components/admin/Board/AdminBoardListComponent";
import "./AdminBoardListPage.css";
import useCustomLogin from "../../../hooks/useCustomLogin";

const AdminBoardListPage = () => {

  // 로그인 체크
  const { isLogin, moveToAdminLoginReturn } = useCustomLogin
    ();

  // 로그인 안되어있으면 관리자 로그인 페이지로 튕김
  if (!isLogin) {
    return moveToAdminLoginReturn();
  }

  return (

    <div className="admin-board-page-wrapper">



      {/* 관리자 사이드 메뉴 */}
      <Menu />

      {/* 메인 영역 */}
      <main className="admin-board-main-content">

        <h2 style={{ marginBottom: "20px" }}>
          📋 커뮤니티 게시글 관리
        </h2>

        <div className="admin-board-section">
          <AdminBoardListComponent />
        </div>

      </main>

    </div>
  );
};

export default AdminBoardListPage;