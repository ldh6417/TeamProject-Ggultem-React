import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  postAdd,
  API_SERVER_HOST,
  checkEmail,
  checkNickname,
  sendVerificationEmail,
  verifyEmailCode,
} from "../../api/admin/MemberApi";
import "./RegisterComponent.css";

const host = API_SERVER_HOST;

const initState = {
  email: "",
  pw: "",
  nickname: "",
  social: false,
  phone: "",
  enabled: 0,
  regDate: null,
  files: [],
  uploadFileNames: [],
};

const RegisterPage = () => {
  const [member, setMember] = useState({ ...initState });
  const [imagePreview, setImagePreview] = useState(null);
  const nav = useNavigate();
  const uploadRef = useRef();
  const [pwConfirm, setPwConfirm] = useState("");
  const [emailStatus, setEmailStatus] = useState(null);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [nicknameStatus, setNicknameStatus] = useState(null);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);

  const [verificationCode, setVerificationCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false); // 최종 인증 여부
  const [showVerifyInput, setShowVerifyInput] = useState(false); // 입력창 노출 여부
  const [isEmailSent, setIsEmailSent] = useState(false);

  const [agreements, setAgreements] = useState({
    terms: false /* 이용약관 (필수) */,
    privacy: false /* 개인정보 수집 및 이용 (필수) */,
    marketing: false /* 마케팅 정보 수신 (선택) */,
  });

  // 모달 열림 상태 (null이면 닫힘, 'terms' 또는 'privacy'면 해당 모달 열림)
  const [modalType, setModalType] = useState(null);

  // 모달 열기 함수
  const openModal = (type) => setModalType(type);
  // 모달 닫기 함수
  const closeModal = () => setModalType(null);

  // 인증번호 발송 핸들러
  const handleSendEmail = () => {
    sendVerificationEmail(member.email)
      .then((data) => {
        if (data.result === "SUCCESS") {
          alert("인증번호가 발송되었습니다! 🍯");
          setIsEmailSent(true); // 입력창 등장!
        }
      })
      .catch((err) =>
        alert("메일 발송에 실패했습니다. 이메일을 확인해주세요."),
      );
  };

  // 인증번호 검증 핸들러
  const handleVerifyCode = () => {
    verifyEmailCode(member.email, verificationCode).then((data) => {
      if (data.result === true) {
        alert("이메일 인증이 완료되었습니다! 🐝");
        setIsEmailVerified(true); // 인증 완료 상태로 변경
        setIsEmailSent(false); // 인증 성공했으니 번호 입력창은 다시 숨김
      } else {
        alert(data.message); // "인증번호가 일치하지 않습니다" 등 서버 메시지 출력
      }
    });
  };

  const handleCheckAgreement = (e) => {
    const { name, checked } = e.target;
    setAgreements({ ...agreements, [name]: checked });
  };

  // ✨ 비밀번호 유효성 검사 정규식 (영문, 숫자, 특수문자 조합 8~11자)
  const pwRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,11}$/;

  // 비밀번호 유효성 체크 결과
  const isPwValid = pwRegex.test(member.pw);
  // 비밀번호 일치 체크 결과
  const isPwMatch = member.pw === pwConfirm;

  const handleChangeMember = (e) => {
    const { name, value } = e.target;
    setMember({ ...member, [name]: value });

    // ✨ 이메일을 수정하면 다시 중복 체크를 하게 만듭니다.
    if (name === "email") {
      setIsEmailChecked(false);
      setEmailStatus(null);
    }

    if (name === "nickname") {
      setIsNicknameChecked(false);
      setNicknameStatus(null);
    }
  };

  // 사진 선택 시 미리보기 생성 함수
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // 읽어온 파일 데이터를 상태에 저장
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 클릭 시 input창 강제 클릭
  const handleClickImage = () => {
    uploadRef.current.click();
  };

  const handleCheckEmailBtn = () => {
    const email = member.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      alert("올바른 이메일 형식을 입력해주세요. 🐝");
      return;
    }

    setEmailStatus("checking");
    checkEmail(email)
      .then((data) => {
        if (data.result === true) {
          alert("사용 가능한 이메일입니다! 🍯");
          setEmailStatus("available");
          setIsEmailChecked(true); // 통과!
        } else {
          alert("이미 등록된 이메일입니다. ❌");
          setEmailStatus("duplicate");
          setIsEmailChecked(false);
        }
      })
      .catch(() => {
        alert("서버 통신 오류가 발생했습니다.");
        setEmailStatus("error");
      });
  };

  const handleCheckNicknameBtn = () => {
    const nickname = member.nickname;
    const nicknameRegex = /^[a-zA-Z0-9가-힣]{2,15}$/;

    if (!nickname || !nicknameRegex.test(nickname)) {
      alert("올바른 닉네임 형식을 입력해주세요. 🐝");
      return;
    }

    setNicknameStatus("checking");
    checkNickname(nickname)
      .then((data) => {
        if (data.result === true) {
          alert("사용 가능한 닉네임입니다! 🍯");
          setNicknameStatus("available");
          setIsNicknameChecked(true); // 통과!
        } else {
          alert("이미 등록된 닉네임입니다. ❌");
          setNicknameStatus("duplicate");
          setIsNicknameChecked(false);
        }
      })
      .catch(() => {
        alert("서버 통신 오류가 발생했습니다.");
        setNicknameStatus("error");
      });
  };

  const handleChangePwConfirm = (e) => {
    setPwConfirm(e.target.value);
  };

  const handleClickAdd = () => {
    if (!isEmailVerified) {
      alert("이메일 인증을 통과해야 합니다.");
      return;
    }

    if (!isEmailChecked) {
      alert("이메일 중복 확인을 통과해야 합니다.");
      return;
    }
    if (!isNicknameChecked) {
      alert("닉네임 중복 확인을 통과해야 합니다.");
      return;
    }

    if (!isPwValid) {
      alert(
        "비밀번호는 영문, 숫자, 특수문자를 포함하여 8~11자로 입력해주세요!",
      );
      return;
    }

    // 🚨 [유효성 검사 2] 비밀번호 일치 확인
    if (!isPwMatch) {
      alert("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    if (!member.email || !member.pw || !member.nickname) {
      alert("필수 정보를 모두 입력해주세요.");
      return;
    }

    if (!agreements.terms || !agreements.privacy) {
      alert("필수 약관에 동의해주세요! 🐝");
      return;
    }

    const files = uploadRef.current.files;
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    formData.append("email", member.email);
    formData.append("pw", member.pw);
    formData.append("nickname", member.nickname);
    formData.append("phone", member.phone);

    postAdd(formData)
      .then((data) => {
        alert("회원 등록이 완료되었습니다.");
        nav(-1, { replace: true });
      })
      .catch((err) => {
        console.error(err);
        alert("등록 실패: 입력 정보를 확인해주세요.");
      });
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">신규 회원 등록</h2>
        <div className="register-form">
          {/* 1. 프로필 이미지 영역 */}
          <div className="profile-upload-section">
            <div className="profile-image-wrapper" onClick={handleClickImage}>
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="profile-circle"
                />
              ) : (
                <div className="profile-placeholder">
                  <span>사진 추가</span>
                </div>
              )}
              <div className="camera-icon">📷</div>
            </div>
            <input
              type="file"
              ref={uploadRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              accept="image/*"
            />
          </div>

          {/* 2. 이메일 입력 */}
          <div className="form-group email-group">
            <label>이메일</label>
            <div className="email-input-wrapper">
              <input
                type="email"
                name="email"
                value={member.email}
                onChange={handleChangeMember}
                placeholder="example@honey.com"
                disabled={isEmailVerified}
              />
              {!isEmailChecked ? (
                <button
                  type="button"
                  className="btn-check"
                  onClick={handleCheckEmailBtn}
                >
                  중복 확인
                </button>
              ) : !isEmailVerified ? (
                <button
                  type="button"
                  className="btn-verify-send"
                  onClick={handleSendEmail}
                >
                  {isEmailSent ? "재발송" : "인증번호 받기"}
                </button>
              ) : (
                <span className="verify-badge">인증됨 ✅</span>
              )}
            </div>
            {emailStatus && !isEmailVerified && (
              <span
                className={`pw-message ${isEmailChecked ? "success" : "error"}`}
              >
                {emailStatus === "available"
                  ? "사용 가능한 이메일입니다. 이제 인증을 진행해주세요. ✅"
                  : "이미 등록된 이메일입니다. ❌"}
              </span>
            )}
            {isEmailSent && !isEmailVerified && (
              <div className="verify-input-wrapper animate-fade-in">
                <input
                  type="text"
                  placeholder="인증번호 6자리 입력"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="verify-input"
                />
                <button
                  type="button"
                  className="btn-verify-confirm"
                  onClick={handleVerifyCode}
                >
                  번호 확인
                </button>
              </div>
            )}
          </div>

          {/* 3. 비밀번호 입력 */}
          <div className="form-group">
            <label>비밀번호</label>
            <input
              type="password"
              name="pw"
              value={member.pw}
              onChange={handleChangeMember}
              placeholder="영문, 숫자, 특수문자 포함 8~11자"
            />
            {member.pw && (
              <span className={`pw-message ${isPwValid ? "success" : "error"}`}>
                {isPwValid
                  ? "사용 가능한 비밀번호입니다. ✅"
                  : "형식 불일치 (8~11자, 특수문자 포함). ❌"}
              </span>
            )}
          </div>
          <div className="form-group">
            <label>비밀번호 확인</label>
            <input
              type="password"
              value={pwConfirm}
              onChange={handleChangePwConfirm}
              placeholder="비밀번호 재입력"
            />
            {pwConfirm && (
              <span className={`pw-message ${isPwMatch ? "success" : "error"}`}>
                {isPwMatch
                  ? "비밀번호가 일치합니다. ✅"
                  : "비밀번호가 일치하지 않습니다. ❌"}
              </span>
            )}
          </div>

          {/* 4. 닉네임 및 전화번호 */}
          <div className="form-group email-group">
            <label>닉네임</label>
            <div className="email-input-wrapper">
              <input
                type="text"
                name="nickname"
                value={member.nickname}
                onChange={handleChangeMember}
                placeholder="닉네임 입력"
              />
              <button
                type="button"
                className="btn-check"
                onClick={handleCheckNicknameBtn}
              >
                중복 확인
              </button>
            </div>
            {nicknameStatus && (
              <span
                className={`pw-message ${isNicknameChecked ? "success" : "error"}`}
              >
                {nicknameStatus === "available"
                  ? "사용 가능한 닉네임입니다. ✅"
                  : "이미 등록된 닉네임입니다. ❌"}
              </span>
            )}
          </div>
          <div className="form-group">
            <label>전화번호</label>
            <input
              type="text"
              name="phone"
              value={member.phone}
              onChange={handleChangeMember}
              placeholder="'-' 제외 숫자만"
            />
          </div>

          {/* 5. 약관 동의 영역 */}
          <div className="agreement-section">
            <div className="agreement-item">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={agreements.terms}
                onChange={handleCheckAgreement}
              />
              <label htmlFor="terms">
                (필수){" "}
                <span className="link-text" onClick={() => openModal("terms")}>
                  이용약관
                </span>
                에 동의합니다.
              </label>
            </div>
            <div className="agreement-item">
              <input
                type="checkbox"
                id="privacy"
                name="privacy"
                checked={agreements.privacy}
                onChange={handleCheckAgreement}
              />
              <label htmlFor="privacy">
                (필수){" "}
                <span
                  className="link-text"
                  onClick={() => openModal("privacy")}
                >
                  개인정보처리방침
                </span>
                에 동의합니다.
              </label>
            </div>
          </div>

          {/* 6. 하단 버튼 영역 */}
          <div className="register-buttons">
            <button className="btn-cancel" onClick={() => nav(-1)}>
              취소
            </button>
            <button
              className="btn-submit"
              onClick={handleClickAdd}
              disabled={
                !isEmailVerified ||
                !isEmailChecked ||
                !isNicknameChecked ||
                !isPwValid ||
                !isPwMatch ||
                !agreements.terms ||
                !agreements.privacy
              }
            >
              등록하기
            </button>
          </div>
        </div>{" "}
        {/* register-form 끝 */}
      </div>{" "}
      {/* register-card 끝 */}
      {/* 🐝 모달 팝업 창 (가장 바깥쪽 레벨에 배치) */}
      {modalType && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalType === "terms" ? "이용약관" : "개인정보처리방침"}</h3>
              <button className="modal-close-x" onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              {modalType === "terms" ? (
                <p>꿀템 서비스 이용약관 내용...</p>
              ) : (
                <p>개인정보 처리방침 내용...</p>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-confirm" onClick={closeModal}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div> // register-container 끝
  );
};

export default RegisterPage;
