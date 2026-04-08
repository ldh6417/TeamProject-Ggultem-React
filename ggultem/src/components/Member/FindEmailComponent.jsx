import { useState } from "react";
import {
  checkEmail,
  sendVerificationEmail,
  verifyEmailCode,
} from "../../api/admin/MemberApi";
import { useNavigate } from "react-router";
import "./FindEmailComponent.css";

const FindEmailComponent = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);

  const handleCheckEmail = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      alert("이메일을 입력해주세요! 🐝");
      return;
    }

    // API 호출: 가입된 이메일인지 확인
    checkEmail(email)
      .then((exists) => {
        if (exists) {
          setStep(2);
        } else {
          alert("가입되지 않은 이메일입니다. 다시 확인해주세요.");
        }
      })
      .catch((err) => {
        alert("서버 오류가 발생했습니다.");
      });
  };

  // 2단계: 이메일 인증번호 발송
  const handleSendCode = () => {
    if (isSending) return;

    setIsSending(true); // 로딩 시작!

    sendVerificationEmail(email).then(() => {
      alert(`${email}로 인증번호가 발송되었습니다.`);
      setStep(3);
    }).finally(() => {
      setIsSending(false); // 성공하든 실패하든 로딩 해제!
    });
  };

  const handleVerifyAndGo = (e) => {
    e.preventDefault();

    verifyEmailCode(email, code)
      .then((res) => {
        // 🚩 백엔드 응답 구조(Map.of("result", true))에 맞게 수정!
        // 만약 axios를 쓰신다면 res.data.result 일 수도 있으니 확인해보세요.

        if (res.result === true) {
          alert("인증 성공! 비밀번호를 재설정하십시오.");
          navigate(`/member/resetPw/${email}?verified=true`);
        } else {
          // 백엔드가 보내주는 "인증번호가 일치하지 않거나 만료되었습니다." 메시지 활용
          alert(res.message || "인증번호가 일치하지 않습니다. 🐝");
        }
      })
      .catch((err) => {
        console.error("인증 에러:", err);
        alert("서버와 통신 중 오류가 발생했습니다.");
      });
  };

  return (
    <div className="login-container">
      <div className="login-box find-email-box">
        <span className="header-logo-text">
          <span className="logo-g">G</span>꿀템
        </span>
        <h2 className="login-title">계정 확인</h2>

        <form className="login-form">
          <div className="input-group">
            <label>이메일 주소</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={step > 1}
              placeholder="example@honey.com"
            />
          </div>

          {/* STEP 1: 이메일 존재 확인 전 */}
          {step === 1 && (
            <button className="login-btn" onClick={handleCheckEmail}>
              이메일 확인
            </button>
          )}

          {/* STEP 2: 계정 확인 완료 -> 인증하기 유도 */}
          {step === 2 && (
            <div className="reset-step-container animation-up">
              <div className="success-badge">
                ✅ 가입 정보가 있는 이메일입니다.
              </div>
              <p className="reset-text">
                해당 이메일로 인증번호를 보내
                <br />
                <b>비밀번호를 재설정</b>하시겠습니까?
              </p>
              <button
                type="button"
                className={`login-btn ${isSending ? "loading" : ""}`} // 로딩 클래스 추가 가능
                onClick={handleSendCode}
                disabled={isSending} // 👈 핵심: 전송 중에는 클릭 금지!
              >
                {isSending ? "인증번호 발송 중..." : "이메일 인증하기"}
              </button>
            </div>
          )}

          {/* STEP 3: 인증번호 입력 */}
          {step === 3 && (
            <div className="reset-step-container animation-up">
              <div className="input-group">
                <label>인증번호 6자리</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="인증번호를 입력하세요"
                />
              </div>
              <button className="login-btn" onClick={handleVerifyAndGo}>
                인증 완료 및 재설정하러 가기
              </button>
              <button
                type="button"
                className="sub-btn"
                onClick={handleSendCode}
                disabled={isSending} // 👈 재발송도 중복 클릭 방지!
              >
                {isSending ? "발송 중..." : "인증번호 재발송"}
              </button>
            </div>
          )}

          <button
            type="button"
            className="white-btn-full"
            onClick={() => navigate("/login")}
          >
            로그인으로 돌아가기
          </button>
        </form>
      </div>
    </div>
  );
};

export default FindEmailComponent;
