import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  getOne,
  API_SERVER_HOST,
  putOne,
  uploadImageApi,
} from "../../../api/admin/MemberApi";
import "./ModifyComponent.css";

const host = API_SERVER_HOST;

const initState = {
  pw: "",
  nickname: "",
  social: false,
  phone: "",
  enabled: 0,
  roleNames: [],
  regDate: null,
  dtdDate: null,
  stopDate: null,
  stopEndDate: null,
  uploadFileNames: [],
};

const ModifyPage = ({ email }) => {
  const [member, setMember] = useState({ ...initState });
  const nav = useNavigate();

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

  useEffect(() => {
    // 백엔드에서 데이터 가져오기
    getOne(email).then((data) => {
      setMember(data);
    });
  }, [email]);

  const handleChange = (e) => {
    setMember({ ...member, [e.target.name]: e.target.value });
  };

  const handleClickModify = () => {
    const formData = new FormData();

    formData.append("phone", member.phone);
    formData.append("nickname", member.nickname);
    formData.append("enabled", member.enabled);

    if (member.social) {
      // formData.append("pw", ""); // 서버에서 빈 값일 때 수정을 안 하도록 로직이 짜여있어야 함
    } else {
      formData.append("pw", member.pw);
    }

    putOne(email, formData)
      .then(() => {
        alert("정보 수정이 완료되었습니다.");
        nav(-1);
      })
      .catch((error) => {
        console.error("수정 중 오류 발생:", error);
        alert("수정에 실패했습니다.");
      });
  };

  if (!email || !member.email)
    return (
      <div className="memberinfo-loading">
        사용자 정보를 불러오는 중입니다...
      </div>
    );

  return (
    <div className="memberinfo-wrapper">
      <div className="memberinfo-container">
        {/* 상단 타이틀 및 버튼 */}
        <div className="memberinfo-header">
          <h2 className="memberinfo-title">✏️ 회원 정보 수정</h2>
          <div className="memberinfo-actions">
            <button className="memberinfo-btn save" onClick={handleClickModify}>
              저장하기
            </button>
            <button
              className="memberinfo-btn cancel"
              onClick={() => window.history.back()}
            >
              취소
            </button>
          </div>
        </div>

        <div className="memberinfo-content">
          {/* 왼쪽: 프로필 사진 수정 섹션 */}
          <div className="memberinfo-profile-section">
            <div className="memberinfo-image-box">
              {member.uploadFileNames && member.uploadFileNames.length > 0 ? (
                <img
                  src={`${host}/mypage/view/${member.uploadFileNames[0]}`}
                  alt="Profile"
                />
              ) : (
                <div className="memberinfo-no-image">No Image</div>
              )}
            </div>
            <div className="memberinfo-file-input">
              {/* label이 클릭되면 hidden input이 트리거됩니다 */}
              <label htmlFor="file-upload" className="file-label">
                사진 즉시 변경
              </label>
              <input
                className="file-upload-thumbnail"
                id="file-upload"
                type="file"
                onChange={handleImageChange} // 👈 클릭 후 파일 선택 시 바로 실행!
                style={{ display: "none" }}
              />
            </div>
          </div>

          {/* 오른쪽: 수정 폼 상세 */}
          <div className="memberinfo-details">
            <div className="memberinfo-row">
              <label>이메일 (ID)</label>
              <input
                type="text"
                value={member.email}
                readOnly
                className="readonly-input"
              />
            </div>

            <div className="memberinfo-row">
              <label>비밀번호</label>
              <input
                type="password"
                name="pw"
                onChange={handleChange}
                disabled={member.social}
                placeholder={
                  member.social
                    ? "소셜 회원은 비밀번호를 수정할 수 없습니다."
                    : "새 비밀번호 입력"
                }
                className={member.social ? "disabled-input" : ""}
              />
            </div>

            <div className="memberinfo-row">
              <label>닉네임</label>
              <input
                type="text"
                name="nickname"
                value={member.nickname || ""}
                onChange={handleChange}
              />
            </div>

            <div className="memberinfo-row">
              <label>연락처</label>
              <input
                type="text"
                name="phone"
                value={member.phone || ""}
                onChange={handleChange}
                placeholder="010-0000-0000"
              />
            </div>

            <div className="memberinfo-row">
              <label>권한 설정</label>
              <div className="memberinfo-role-display">
                {member.roleNames.map((role, idx) => (
                  <span
                    key={idx}
                    className={`memberinfo-role-badge ${role.toLowerCase()}`}
                  >
                    {role}
                  </span>
                ))}
                <span className="role-notice">
                  * 권한 변경은 불가능하며, 비즈니스 회원은 비즈니스 회원 관리에서 취소가 가능합니다.
                </span>
              </div>
            </div>

            <div className="memberinfo-row">
              <label>계정 활성화</label>
              <select
                name="enabled"
                value={member.enabled}
                onChange={handleChange}
              >
                <option value={1}>활성 (Normal)</option>
                <option value={0}>비활성 (Disabled)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyPage;
