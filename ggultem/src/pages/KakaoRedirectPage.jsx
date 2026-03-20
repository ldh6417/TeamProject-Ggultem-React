import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getAccessToken } from "../api/MemberApi"; // 아직 안 만든 함수
import { setCookie } from "../util/cookieUtil";
import "./KakaoRedirectPage.css";
import { useDispatch } from "react-redux";
import { login } from "../slice/loginSlice";

const KakaoRedirectPage = () => {
  const [searchParams] = useSearchParams();
  const authCode = searchParams.get("code"); // URL에서 code 추출
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (authCode) {
      // 1. 백엔드에 인가 코드를 전달 (아직 백엔드 API가 없다면 준비만!)
      console.log("인가 코드를 백엔드로 보냅니다:", authCode);

      // 예시 로직 (백엔드 컨트롤러 구현 후 주석 해제)
      getAccessToken(authCode)
        .then((memberInfo) => {
          console.log("로그인 성공 데이터:", memberInfo);
          dispatch(login(memberInfo));
          navigate("/");
        })
        .catch((err) => {
          console.error("로그인 실패:", err);
          alert("카카오 로그인 중 문제가 발생했습니다.");
          navigate("/login");
        });
    }
  }, [authCode, dispatch, navigate]);

  return (
    <div
      className="signup-container"
      style={{ justifyContent: "center", alignItems: "center" }}
    >
      <div className="signup-box" style={{ textAlign: "center" }}>
        <h2 className="signup-title">🍯 꿀템 로그인 중...</h2>
        <p className="signup-subtitle">
          카카오에서 정보를 안전하게 가져오고 있어요.
        </p>
        <div className="loading-spinner">🐝... (비행 중)</div>
      </div>
    </div>
  );
};

export default KakaoRedirectPage;
