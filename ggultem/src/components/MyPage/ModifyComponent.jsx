import React, { useState, useEffect, useRef } from "react";
import "./ModifyComponent.css";
import {
  getMyInfo,
  API_SERVER_HOST,
  putOne,
  uploadImageApi,
} from "../../api/MemberApi";
import InfoModal from "../../common/InfoModal";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { login } from "../../slice/loginSlice";

const host = API_SERVER_HOST;

const initState = {
  nickname: "",
  password: "",
  confirmPassword: "",
  social: false,
  phone: "",
  files: [],
  uploadFileNames: [],
};

const ModifyComponent = ({ email }) => {
  const [member, setMember] = useState({ ...initState });
  const dispatch = useDispatch();
  const uploadRef = useRef();
  const [result, setResult] = useState(null);
  const [infoModal, setInfoModal] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 백엔드에서 데이터 가져오기
    getMyInfo(email).then((data) => {
      setMember(data);
    });
  }, [email]);

  const handleChange = (e) => {
    setMember({ ...member, [e.target.name]: e.target.value });
  };

  const handleClickModify = () => {
    const files = uploadRef.current.files;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    formData.append("phone", member.phone || "");
    formData.append("nickname", member.nickname);

    if (!member.social && isChangingPassword) {
      if (member.pw !== member.confirmPassword) {
        alert("비밀번호가 일치하지 않습니다. ");
        return;
      }
      formData.append("pw", member.pw);
    }

    for (let i = 0; i < member.uploadFileNames.length; i++) {
      formData.append("uploadFileNames", member.uploadFileNames[i]);
    }
    putOne(email, formData)
      .then((data) => {
        dispatch(login(member));
        setResult("Modified");
        setInfoModal(true);
      })
      .catch((error) => {
        console.error("수정 중 오류 발생:", error);
        alert("수정에 실패했습니다.");
      });
  };

  const closeModal = () => {
    if (result === "Modified") {
      navigate(`/mypage`); // 조회 화면으로 이동
    }
    setResult(null);
  };

  const handleImageChange = (e) => {
    const files = e.target.files[0];
    if (!files) return;

    const formData = new FormData();
    formData.append("files", files);
    formData.append("email", email); // 누구의 사진인지 식별

    // 1. 별도 API 호출
    uploadImageApi(email, formData)
      .then((data) => {
        if (data.RESULT === "SUCCESS" && data.FILE_NAMES) {
          alert("프로필 사진이 변경되었습니다! 🍯");

          // 문자열 "[파일명]"에서 [ ]를 제거하고 순수 파일명만 추출
          const rawFileName = data.FILE_NAMES.replace(/[[\]]/g, "");

          setMember((prev) => ({
            ...prev,
            // 리액트 상태에는 배열 형태로 넣어줍니다.
            uploadFileNames: [rawFileName],
          }));
        } else {
          console.error("서버 응답 형식이 다릅니다:", data);
        }
      })
      .catch((err) => {
        console.error("이미지 업로드 실패:", err);
        alert("사진 업로드 중 오류가 발생했습니다.");
      });
  };

  return (
    <div className="edit-wrapper">
      {/* 1. 숨겨진 파일 인풋 추가 */}
      <input
        type="file"
        ref={uploadRef}
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
      <InfoModal
        show={infoModal}
        title={`회원의 정보 수정`}
        content={`${member.nickname}님의 회원 정보 수정이 완료되었습니다.`}
        callbackFn={closeModal}
      />
      <div className="edit-container">
        <h2 className="edit-title">회원정보 수정</h2>

        {/* 프로필 이미지 섹션 */}
        <div className="edit-profile-section">
          <div className="profile-img-wrapper">
            <img
              src={`${host}/mypage/view/${member.uploadFileNames}`}
              alt="Profile"
              className="edit-profile-img"
            />
            {/* 2. 클릭 시 숨겨진 input을 클릭하게 만듦 */}
            <button
              className="img-edit-btn"
              onClick={() => uploadRef.current.click()}
            >
              <i className="edit-icon">✎</i>
            </button>
          </div>
          <p className="img-info-text">
            프로필 사진은 언제든지 변경 가능합니다.
          </p>
        </div>

        <div className="edit-form">
          {/* 닉네임 수정 */}
          <div className="input-group">
            <label>닉네임</label>
            <input
              type="text"
              name="nickname"
              value={member.nickname || ""}
              onChange={handleChange}
              placeholder="새로운 닉네임을 입력하세요"
            />
          </div>

          {/* 폰번호 수정 */}
          <div className="input-group">
            <label>전화번호</label>
            <input
              type="text"
              name="phone"
              value={member.phone || ""}
              onChange={handleChange}
              placeholder="010-0000-0000"
            />
          </div>

          {/* 비밀번호 수정 (소셜 로그인 사용자는 숨김 또는 비활성화) */}
          {!member.social && (
            <div className="password-modify-container">
              {!isChangingPassword ? (
                <button
                  type="button"
                  className="pw-toggle-btn"
                  onClick={() => setIsChangingPassword(true)}
                >
                  비밀번호 변경하기
                </button>
              ) : (
                <div className="password-section animate-fade-in">
                  <div className="pw-header">
                    <label>비밀번호 변경</label>
                    <button
                      className="pw-cancel-btn"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setMember({ ...member, pw: "", confirmPassword: "" }); // 입력값 초기화
                      }}
                    >
                      변경 취소
                    </button>
                  </div>
                  <div className="input-group">
                    <input
                      type="password"
                      name="pw" // MemberServiceImpl의 필드명인 pw에 맞춤
                      value={member.pw || ""}
                      onChange={handleChange}
                      placeholder="새 비밀번호 입력"
                    />
                  </div>
                  <div className="input-group">
                    <input
                      type="password"
                      name="confirmPassword"
                      value={member.confirmPassword || ""}
                      onChange={handleChange}
                      placeholder="비밀번호 재입력"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="edit-actions">
            <button className="cancel-btn" onClick={() => navigate(-1)}>
              취소
            </button>
            <button className="save-btn" onClick={() => handleClickModify()}>
              수정 완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyComponent;
