/* eslint-disable react-refresh/only-export-components */
import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import Loading from "../pages/Loading";
import BoardRegisterPage from "../pages/Board/BoardRegisterPage";

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

//* 사용자 페이지 */
const Main = lazy(() => import("../pages/MainPage"));
const Login = lazy(() => import("../pages/LoginPage"));
const Business = lazy(() => import("../pages/Business/MainPage"));
const KakaoRedirect = lazy(() => import("../pages/KakaoRedirectPage"));
const GoogleRedirect = lazy(() => import("../pages/GoogleRedirectPage"));
//* 마이페이지 lazy */
const MyPage = lazy(() => import("../pages/MyPage/MyPage"));
const Modify = lazy(() => import("../pages/MyPage/ModifyPage"));
//* 공지사항 lazy */
const NoticeList = lazy(() => import("../pages/Notice/NoticePage"));
//* 커뮤니티 lazy */
const BoardList = lazy(() => import("../pages/Board/BoardListPage"));
const BoardRead = lazy(() => import("../pages/Board/BoardReadPage"));
const BoardRegister = lazy(() => import("../pages/Board/BoardRegisterPage"));
//* 판매게시판 lazy */
const ItemBoardList = lazy(
  () => import("../pages/ItemBoard/ItemBoardListPage"),
);
const ItemBoardRegister = lazy(
  () => import("../pages/ItemBoard/ItemBoardRegisterPage"),
);
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
  /* ===== 마이페이지 연결 영역 ===== */
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

  /* ===== 공지사항 ===== */
  {
    path: "/notice/list",
    element: (
      <Suspense fallback={<Loading />}>
        <NoticeList />
      </Suspense>
    ),
  },
  /* ===== 비즈니스 연결 영역 ===== */
  {
    path: "/business",
    element: (
      <Suspense fallback={<Loading />}>
        <Business />
      </Suspense>
    ),
  },
]);

export default root;