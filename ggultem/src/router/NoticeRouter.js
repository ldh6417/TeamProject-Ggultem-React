import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div>Loading...</div>;
const NoticeList = lazy(() => import("../pages/Notice/ListPage"));
const NoticeRead = lazy(() => import("../pages/Notice/ReadPage")); // 파일명 확인!

const noticeRouter = () => {
  return [
    {
      path: "list",
      element: (
        <Suspense fallback={Loading}>
          <NoticeList />
        </Suspense>
      ),
    },
    {
      path: "",
      element: <Navigate replace to="list" />,
    },
    {
      path: "read/:nno", // :nno가 있어야 상세페이지 번호를 읽어온다.
      element: (
        <Suspense fallback={Loading}>
          <NoticeRead />
        </Suspense>
      ),
    },
  ];
};

export default noticeRouter;
