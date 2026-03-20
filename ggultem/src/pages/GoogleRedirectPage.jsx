import React, { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../slice/loginSlice"; // 기존 로그인 액션 활용
import { getAccessToken } from "../api/GoogleApi"; // 새로 만들 API
import useCustomLogin from "../hooks/useCustomLogin";
import "./GoogleRedirectPage.css";

const GoogleRedirectPage = () => {
  const [searchParams] = useSearchParams();
  const authCode = searchParams.get("code"); // 구글이 준 인가 코드
  const dispatch = useDispatch();
  const { moveToPath } = useCustomLogin();
  const isProcessing = useRef(false);

  useEffect(() => {
    if (authCode) {
      if (isProcessing.current || !authCode) return;
      isProcessing.current = true;
      // 1. 이미 백엔드에서 모든 처리를 끝내고 MemberDTO를 보내주고 있습니다!
      getAccessToken(authCode)
        .then((memberInfo) => {
          console.log("백엔드에서 받은 회원 정보:", memberInfo);

          // 2. 받은 memberInfo에 이미 이메일, 닉네임 등이 다 들어있으므로 바로 저장
          dispatch(login(memberInfo));

          // 3. 메인으로 이동
          if (memberInfo && !memberInfo.error) {
            alert(`${memberInfo.nickname}님, 환영합니다! 🍯`);
            moveToPath("/");
          }
        })
        .catch((err) => {
          console.error("로그인 처리 중 에러 발생:", err);
          alert("로그인에 실패했습니다.");
        })
        .finally(() => {
          // 처리가 끝나도 깃발은 내리지 않습니다. (두 번 실행 방지)
        });
    }
  }, [authCode, dispatch, moveToPath]);

  return (
    <div className="google-loading-wrapper">
      <div className="google-loading-container">
        {/* 꿀단지 애니메이션 효과를 위한 아이콘 공간 */}
        <div className="google-loading-honey">🍯</div>
        <div className="google-loading-text">구글 로그인 중입니다...</div>
        <div className="google-loading-bar">
          <div className="google-loading-progress"></div>
        </div>
      </div>
    </div>
  );
};

export default GoogleRedirectPage;
