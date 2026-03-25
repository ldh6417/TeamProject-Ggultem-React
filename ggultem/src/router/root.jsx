/* eslint-disable react-refresh/only-export-components */
import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import Loading from "../pages/Loading";
import BoardRegisterPage from "../pages/Board/BoardRegisterPage";
import AdminBoardListPage from "../pages/admin/Board/AdminBoardListPage";
import AdminReplyListPage from "../pages/admin/Board/AdminReplyListPage";

//* 관리자 페이지 */
const AdminMain = lazy(() => import("../pages/admin/MainPage"));
const AdminLogin = lazy(() => import("../pages/admin/LoginPage"));
//* 회원관리 페이지 */
const AdminMemberList = lazy(() => import("../pages/admin/Member/ListPage"));
const AdminMemberRead = lazy(() => import("../pages/admin/Member/ReadPage"));
const AdminMemberModify = lazy(
  () => import("../pages/admin/Member/ModifyPage"),
);
const AdminMemberRegister = lazy(
  () => import("../pages/admin/Member/RegisterPage"),
);
//* 비즈니스 회원 관리 페이지 */
const AdminBusinessMemberList = lazy(
  () => import("../pages/admin/Business/ListPage"),
);
const AdminBusinessMemberRead = lazy(
  () => import("../pages/admin/Business/ReadPage"),
);
// ===== AdminNotice ===== */
const NoticeListAdmin = lazy(() => import("../pages/admin/Notice/ListPage"));
const NoticeRegisterAdmin = lazy(
  () => import("../pages/admin/Notice/RegisterPage"),
);
const NoticeReadAdmin = lazy(() => import("../pages/admin/Notice/ReadPage"));
const NoticeModifyAdmin = lazy(
  () => import("../pages/admin/Notice/ModifyPage"),
);
// * 그룹코드 관리 페이지 */
// 코드그룹 관련 lazy 로딩
const CodeGroupList = lazy(() => import("../pages/CodeGroup/ListPage"));
const CodeGroupAdd = lazy(() => import("../pages/CodeGroup/AddPage"));
const CodeGroupRead = lazy(() => import("../pages/CodeGroup/ReadPage"));
const CodeGroupModify = lazy(() => import("../pages/CodeGroup/ModifyPage"));
//* Admin Item Board 관리 페이지 */
const AdminItemBoardList = lazy(
  () => import("../pages/admin/ItemBoard/AdminListPage"),
);
const AdminItemBoardRead = lazy(
  () => import("../pages/admin/ItemBoard/AdminReadPage"),
);
const AdminItemBoardRegister = lazy(
  () => import("../pages/admin/ItemBoard/AdminRegisterPage"),
);

//* 사용자 페이지 */
const Main = lazy(() => import("../pages/MainPage"));
const Login = lazy(() => import("../pages/LoginPage"));
const KakaoRedirect = lazy(() => import("../pages/KakaoRedirectPage"));
const GoogleRedirect = lazy(() => import("../pages/GoogleRedirectPage"));
//* 마이페이지 lazy */
const MyPage = lazy(() => import("../pages/MyPage/MyPage"));
const Modify = lazy(() => import("../pages/MyPage/ModifyPage"));
//* 비즈니스 페이지 lazy */
const BusinessMain = lazy(() => import("../pages/Business/MainPage"));
const BusinessList = lazy(() => import("../pages/Business/ListPage"));
const BusinessRegister = lazy(() => import("../pages/Business/RegisterPage"));
const BusinessBoardRegister = lazy(
  () => import("../pages/Business/Itemboard/RegisterPage"),
);
//* 공지사항 lazy */
const NoticeList = lazy(() => import("../pages/Notice/NoticePage"));
const NoticeRead = lazy(() => import("../pages/Notice/NoticeRead"));
//* 커뮤니티 lazy */
const BoardList = lazy(() => import("../pages/Board/BoardListPage"));
const BoardRead = lazy(() => import("../pages/Board/BoardReadPage"));
const BoardRegister = lazy(() => import("../pages/Board/BoardRegisterPage"));
const BoardModify = lazy(() => import("../pages/Board/BoardModifyPage"));
//* 판매게시판 lazy */
const ItemBoardList = lazy(
  () => import("../pages/ItemBoard/ItemBoardListPage"),
);
const ItemBoardRegister = lazy(
  () => import("../pages/ItemBoard/ItemBoardRegisterPage"),
);
const ItemBoardRead = lazy(
  () => import("../pages/ItemBoard/ItemBoardReadPage"),
);
const ItemBoardModify = lazy(
  () => import("../pages/ItemBoard/ItemBoardModifyPage"),
);
//* 장바구니 페이지 */
const CartList = lazy(() => import("../pages/Cart/CartListPage"));

const root = createBrowserRouter([
  /* ===== 관리자 영역 ===== */
  /* ===== 메인페이지 연결 영역 ===== */
  {
    path: "/admin/",
    element: (
      <Suspense fallback={<Loading />}>
        <AdminMain />
      </Suspense>
    ),
  },
  {
    path: "/admin/login",
    element: (
      <Suspense fallback={<Loading />}>
        <AdminLogin />
      </Suspense>
    ),
  },
  /* ===== 회원관리 영역 ===== */
  {
    path: "/admin/member/list",
    element: (
      <Suspense fallback={<Loading />}>
        <AdminMemberList />
      </Suspense>
    ),
  },
  {
    path: "/admin/member/register",
    element: (
      <Suspense fallback={<Loading />}>
        <AdminMemberRegister />
      </Suspense>
    ),
  },
  {
    path: "/admin/member/:email",
    element: (
      <Suspense fallback={<Loading />}>
        <AdminMemberRead />
      </Suspense>
    ),
  },
  {
    path: "/admin/member/modify/:email",
    element: (
      <Suspense fallback={<Loading />}>
        <AdminMemberModify />
      </Suspense>
    ),
  },
  /* ===== 비즈니스 회원관리 영역 ===== */
  {
    path: "/admin/businessmember/list",
    element: (
      <Suspense fallback={<Loading />}>
        <AdminBusinessMemberList />
      </Suspense>
    ),
  },
  {
    path: "/admin/businessmember/:email",
    element: (
      <Suspense fallback={<Loading />}>
        <AdminBusinessMemberRead />
      </Suspense>
    ),
  },
  //* Admin 상품게시판 관리자 영역 */
  {
    path: "/admin/itemBoard/list",
    element: (
      <Suspense fallback={<Loading />}>
        <AdminItemBoardList />
      </Suspense>
    ),
  },
  {
    path: "/admin/itemBoard/read/:id",
    element: (
      <Suspense fallback={<Loading />}>
        <AdminItemBoardRead />
      </Suspense>
    ),
  },
  {
    path: "/admin/itemBoard/register",
    element: (
      <Suspense fallback={<Loading />}>
        <AdminItemBoardRegister />
      </Suspense>
    ),
  },

  // 커뮤니티 관리자 영역
  /* ===== 관리자 영역 ===== */
  {
    path: "/admin/board/list",
    element: (
      <Suspense fallback={<Loading />}>
        <AdminBoardListPage />
      </Suspense>
    ),
  },
  {
    path: "/admin/reply/list",
    element: (
      <Suspense fallback={<Loading />}>
        <AdminReplyListPage />
      </Suspense>
    ),
  },
  // ✅ 관리자 공지사항
  {
    path: "admin/notice",
    children: [
      {
        path: "list",
        element: (
          <Suspense fallback={<Loading />}>
            <NoticeListAdmin />
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense fallback={<Loading />}>
            <NoticeRegisterAdmin />
          </Suspense>
        ),
      },
      {
        path: "read/:noticeId",
        element: (
          <Suspense fallback={<Loading />}>
            <NoticeReadAdmin />
          </Suspense>
        ),
      },
      {
        path: "modify/:noticeId",
        element: (
          <Suspense fallback={<Loading />}>
            <NoticeModifyAdmin />
          </Suspense>
        ),
      },
    ],
  },
  /* ===== 코드그룹 관리 (추가됨) ===== */
  {
    path: "admin/codegroup/list",
    element: (
      <Suspense fallback={<Loading />}>
        <CodeGroupList />
      </Suspense>
    ),
  },
  {
    path: "admin/codegroup/add",
    element: (
      <Suspense fallback={<Loading />}>
        <CodeGroupAdd />
      </Suspense>
    ),
  },
  {
    path: "admin/codegroup/read/:groupCode",
    element: (
      <Suspense fallback={<Loading />}>
        <CodeGroupRead />
      </Suspense>
    ),
  },
  {
    path: "admin/codegroup/modify/:groupCode",
    element: (
      <Suspense fallback={<Loading />}>
        <CodeGroupModify />
      </Suspense>
    ),
  },
  /* ===== 메인페이지 연결 영역 ===== */
  {
    path: "/",
    element: (
      <Suspense fallback={<Loading />}>
        <Main />
      </Suspense>
    ),
  },
  /* ===== 로그인 페이지 연결 영역 ===== */
  {
    path: "/login",
    element: (
      <Suspense fallback={<Loading />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "member",
    children: [
      {
        path: "kakao",
        element: (
          <Suspense fallback={<Loading />}>
            <KakaoRedirect />
          </Suspense>
        ),
      },
      {
        path: "google",
        element: (
          <Suspense fallback={<Loading />}>
            <GoogleRedirect />
          </Suspense>
        ),
      },
    ],
  },
  /* ===== 마이페이지 연결 영역 ===== */
  {
    path: "/mypage",
    element: (
      <Suspense fallback={<Loading />}>
        <MyPage />
      </Suspense>
    ),
  },
  {
    path: "/mypage/modify",
    element: (
      <Suspense fallback={<Loading />}>
        <Modify />
      </Suspense>
    ),
  },
  /* ===== 판매게시판 연결 영역 ===== */
  {
    path: "/itemBoard/list",
    element: (
      <Suspense fallback={<Loading />}>
        <ItemBoardList />
      </Suspense>
    ),
  },
  {
    path: "/itemBoard/Register",
    element: (
      <Suspense fallback={<Loading />}>
        <ItemBoardRegister />
      </Suspense>
    ),
  },
  {
    path: "/itemBoard/read/:id",
    element: (
      <Suspense fallback={<Loading />}>
        <ItemBoardRead />
      </Suspense>
    ),
  },
  {
    path: "/itemBoard/modify/:id",
    element: (
      <Suspense fallback={<Loading />}>
        <ItemBoardModify />
      </Suspense>
    ),
  },
  //* 장바구니 연결 영역 */
  {
    path: "/Cart/list",
    element: (
      <Suspense fallback={<Loading />}>
        <CartList />
      </Suspense>
    ),
  },
  /* ===== 커뮤니티 연결 영역 ===== */
  {
    path: "/board/list",
    element: (
      <Suspense fallback={<Loading />}>
        <BoardList />
      </Suspense>
    ),
  },
  {
    path: "/board/read/:boardNo",
    element: (
      <Suspense fallback={<Loading />}>
        <BoardRead />
      </Suspense>
    ),
  },
  {
    path: "/board/register",
    element: (
      <Suspense fallback={<Loading />}>
        <BoardRegister />
      </Suspense>
    ),
  },
  {
    path: "/board/modify/:boardNo",
    element: (
      <Suspense fallback={<Loading />}>
        <BoardModify />
      </Suspense>
    ),
  },
  /* ===== 공지사항 ===== */
  {
    path: "/notice/list",
    element: (
      <Suspense fallback={<Loading />}>
        <NoticeList />
      </Suspense>
    ),
  },
  // READ
  {
    path: "/notice/read/:noticeId",
    element: (
      <Suspense fallback={<Loading />}>
        <NoticeRead />
      </Suspense>
    ),
  },
  /* ===== 비즈니스 연결 영역 ===== */
  {
    path: "/business",
    element: (
      <Suspense fallback={<Loading />}>
        <BusinessMain />
      </Suspense>
    ),
  },
  {
    path: "/business/list",
    element: (
      <Suspense fallback={<Loading />}>
        <BusinessList />
      </Suspense>
    ),
  },
  {
    path: "/business/register",
    element: (
      <Suspense fallback={<Loading />}>
        <BusinessRegister />
      </Suspense>
    ),
  },
  {
    path: "/business/board/register",
    element: (
      <Suspense fallback={<Loading />}>
        <BusinessBoardRegister />
      </Suspense>
    ),
  },
]);

export default root;
