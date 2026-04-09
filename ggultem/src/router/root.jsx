/* eslint-disable react-refresh/only-export-components */
import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import Loading from "../pages/Loading";
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
//* 비즈머니 회원 관리 페이지 */
const AdminBizMoneyList = lazy(
  () => import("../pages/admin/BizMoney/ListPage"),
);
//* 비즈니스 광고 등록 관리 페이지 */
const AdminBusinessBoardList = lazy(
  () => import("../pages/admin/BusinessBoard/ListPage"),
);
const AdminBusinessBoardRead = lazy(
  () => import("../pages/admin/BusinessBoard/ReadPage"),
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
const ItemBoardReply = lazy(
  () => import("../pages/admin/ItemBoard/AdminReplyPage"),
);
// 블랙리스트 관리 페이지 (추가됨)
const BlackListIndex = lazy(() => import("../pages/admin/BlackList/IndexPage"));
const BlackListAdd = lazy(() => import("../pages/admin/BlackList/AddPage"));
const BlackListRead = lazy(() => import("../pages/admin/BlackList/ReadPage"));

// 광고 배너 등록 페이지
const BannerList = lazy(() => import("../pages/admin/Banner/ListPage"));
const BannerRegister = lazy(() => import("../pages/admin/Banner/RegisterPage"));
const BannerRead = lazy(() => import("../pages/admin/Banner/ReadPage"));
const BannerModify = lazy(() => import("../pages/admin/Banner/ModifyPage"));

//* 사용자 페이지 ================================================================================================================ */
const Main = lazy(() => import("../pages/MainPage"));
const Login = lazy(() => import("../pages/LoginPage"));
const SignUp = lazy(() => import("../pages/Member/RegisterPage"));
const FindEmail = lazy(() => import("../pages/Member/FindEmailPage"));
const ResetPw = lazy(() => import("../pages/Member/ResetPwPage"));
const KakaoRedirect = lazy(() => import("../pages/KakaoRedirectPage"));
const GoogleRedirect = lazy(() => import("../pages/GoogleRedirectPage"));
//chat ========================================================
const Chat = lazy(() => import("../pages/Chat/ChatPage"));
const ChatRoomList = lazy(() => import("../pages/Chat/ChatRoom/ChatListPage"));
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
const BusinessBoardList = lazy(
  () => import("../pages/Business/Itemboard/ListPage"),
);
const BusinessBoardRead = lazy(
  () => import("../pages/Business/Itemboard/ReadPage"),
);
const BusinessBoardModify = lazy(
  () => import("../pages/Business/Itemboard/ModifyPage"),
);
const BusinessBoardDList = lazy(
  () => import("../pages/Business/Itemboard/DeleteListPage"),
);
const BusinessAdCenter = lazy(
  () => import("../pages/Business/AdCenter/AdCenterPage"),
);
//* 공지사항 lazy */
const NoticeList = lazy(() => import("../pages/Notice/NoticePage"));
const NoticeRead = lazy(() => import("../pages/Notice/NoticeReadPage"));
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
const MyPageList = lazy(() => import("../pages/ItemBoard/MyPageList"));
// ✅ 신고 관리 페이지 추가
const ReportListAdmin = lazy(
  () => import("../pages/admin/ReportProcess/ListPage"),
);
const ReportReadAdmin = lazy(
  () => import("../pages/admin/ReportProcess/ReadPage"),
);
// ✅ [추가] 사용자 사기조회 페이지 (FraudSearch)
const FraudSearch = lazy(() => import("../pages/Report/FraudSearchPage"));

//비즈머니 충전 성공 페이지
const PaySuccess = lazy(() => import("../pages/Pay/SuccessPage"));
const PayFail = lazy(() => import("../pages/Pay/FailPage"));

const root = createBrowserRouter([
  /* ===== 관리자 영역 ============================================================================================== */
  /* ===== 메인페이지 연결 영역 ============================================================================================== */
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
  /* ===== 회원관리 영역 ============================================================================================== */
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
  /* ===== 비즈니스 회원관리 영역 ============================================================================================== */
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
  /* ===== 비즈머니 영역 ============================================================================================== */
  {
    path: "/admin/bizmoney/list",
    element: (
      <Suspense fallback={<Loading />}>
        <AdminBizMoneyList />
      </Suspense>
    ),
  },
  /* ===== 비즈니스 광고 관리 영역 ============================================================================================== */
  {
    path: "/admin/businessboard/list",
    element: (
      <Suspense fallback={<Loading />}>
        <AdminBusinessBoardList />
      </Suspense>
    ),
  },
  {
    path: "/admin/businessboard/:no",
    element: (
      <Suspense fallback={<Loading />}>
        <AdminBusinessBoardRead />
      </Suspense>
    ),
  },
  //* Admin 상품게시판 관리자 영역 ============================================================================================== */
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
  {
    path: "/admin/itemBoard/reply",
    element: (
      <Suspense fallback={<Loading />}>
        <ItemBoardReply />
      </Suspense>
    ),
  },
  // 커뮤니티 관리자 영역 ==============================================================================================
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
  /* =====  공지사항 관리자 영역 ============================================================================================== */
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
  /* ===== 코드그룹 관리 (추가됨) ============================================================================================== */
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
  /* ===== 블랙리스트 관리 영역 ============================================================================================== */
  {
    path: "admin/blacklist/list",
    element: (
      <Suspense fallback={<Loading />}>
        <BlackListIndex />
      </Suspense>
    ),
  },
  {
    path: "admin/blacklist/add",
    element: (
      <Suspense fallback={<Loading />}>
        <BlackListAdd />
      </Suspense>
    ),
  },
  {
    path: "admin/blacklist/read/:blId",
    element: (
      <Suspense fallback={<Loading />}>
        <BlackListRead />
      </Suspense>
    ),
  },
  /* ===== 광고배너 관리 영역 ============================================================================================== */
  {
    path: "admin/banner/list",
    element: (
      <Suspense fallback={<Loading />}>
        <BannerList />
      </Suspense>
    ),
  },
  {
    path: "admin/banner/register",
    element: (
      <Suspense fallback={<Loading />}>
        <BannerRegister />
      </Suspense>
    ),
  },
  {
    path: "admin/banner/:no",
    element: (
      <Suspense fallback={<Loading />}>
        <BannerRead />
      </Suspense>
    ),
  },
  {
    path: "admin/banner/modify/:no",
    element: (
      <Suspense fallback={<Loading />}>
        <BannerModify />
      </Suspense>
    ),
  },

  /* 사용자 페이지 영역 ====================================================================================================== */
  /* ===== 메인페이지 연결 영역 ============================================================================================== */
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
  {
    path: "/chat/:roomId",
    element: (
      <Suspense fallback={<Loading />}>
        <Chat />
      </Suspense>
    ),
  },
  {
    path: "/chatroom/list",
    element: (
      <Suspense fallback={<Loading />}>
        <ChatRoomList />
      </Suspense>
    ),
  },
  {
    path: "/member/register",
    element: (
      <Suspense fallback={<Loading />}>
        <SignUp />
      </Suspense>
    ),
  },
  {
    path: "/member/findemail",
    element: (
      <Suspense fallback={<Loading />}>
        <FindEmail />
      </Suspense>
    ),
  },
  {
    path: "/member/resetPw/:email",
    element: (
      <Suspense fallback={<Loading />}>
        <ResetPw />
      </Suspense>
    ),
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
  {
    path: "/itemBoard/myPage",
    element: (
      <Suspense fallback={<Loading />}>
        <MyPageList />
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
  {
    path: "/business/board/list",
    element: (
      <Suspense fallback={<Loading />}>
        <BusinessBoardList />
      </Suspense>
    ),
  },
  {
    path: "/business/board/:no",
    element: (
      <Suspense fallback={<Loading />}>
        <BusinessBoardRead />
      </Suspense>
    ),
  },
  {
    path: "/business/board/modify/:no",
    element: (
      <Suspense fallback={<Loading />}>
        <BusinessBoardModify />
      </Suspense>
    ),
  },
  {
    path: "/business/board/deletelist",
    element: (
      <Suspense fallback={<Loading />}>
        <BusinessBoardDList />
      </Suspense>
    ),
  },
  {
    path: "/business/bizmoney",
    element: (
      <Suspense fallback={<Loading />}>
        <BusinessAdCenter />
      </Suspense>
    ),
  },
  {
    path: "/business/bizmoney/success",
    element: (
      <Suspense fallback={<Loading />}>
        <PaySuccess />
      </Suspense>
    ),
  },
  {
    path: "/business/bizmoney/fail",
    element: (
      <Suspense fallback={<Loading />}>
        <PayFail />
      </Suspense>
    ),
  },
  // ✅ 관리자 신고 관리
  {
    path: "admin/report",
    children: [
      {
        path: "list",
        element: (
          <Suspense fallback={<Loading />}>
            <ReportListAdmin />
          </Suspense>
        ),
      },
      {
        path: "read/:reportId",
        element: (
          <Suspense fallback={<Loading />}>
            <ReportReadAdmin />
          </Suspense>
        ),
      },
    ],
  },
  // ✅ [추가] 사기조회 (FraudSearch) 페이지 경로
  {
    path: "/report",
    element: (
      <Suspense fallback={<Loading />}>
        <FraudSearch />
      </Suspense>
    ),
  },
]);

export default root;
