import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOne, API_SERVER_HOST } from "../../../api/admin/MemberApi";
import "./ReadComponent.css";

const host = API_SERVER_HOST;

const initState = {
  email: "",
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

const ReadPage = ({ email }) => {
  const navigate = useNavigate();
  const [member, setMember] = useState(initState);

  useEffect(() => {
    if (email) {
      getOne(email).then((data) => {
        console.log("회원 상세 데이터:", data);
        setMember(data);
      });
    }
  }, [email]);

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
          <h2 className="memberinfo-title">회원 상세 정보</h2>
          <div className="memberinfo-actions">
            <button
              className="memberinfo-btn modify"
              onClick={() => navigate(`/admin/member/modify/${member.email}`)}
            >
              수정하기
            </button>
            <button
              className="memberinfo-btn list"
              onClick={() => navigate(`/admin/member/list`)}
            >
              목록으로
            </button>
          </div>
        </div>

        <div className="memberinfo-content">
          {/* 왼쪽: 프로필 이미지 세션 */}
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
            <div className="memberinfo-role-badges">
              {member.roleNames.map((role, idx) => (
                <span
                  key={idx}
                  className={`memberinfo-role-badge ${role.toLowerCase()}`}
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* 오른쪽: 상세 정보 리스트 */}
          <div className="memberinfo-details">
            <div className="memberinfo-row">
              <label>이메일</label>
              <span>{member.email}</span>
            </div>
            <div className="memberinfo-row">
              <label>닉네임</label>
              <span className="memberinfo-nickname">{member.nickname}</span>
            </div>
            <div className="memberinfo-row">
              <label>연락처</label>
              <span>{member.phone || "미등록"}</span>
            </div>
            <div className="memberinfo-row">
              <label>계정 상태</label>
              <span
                className={`memberinfo-status ${member.enabled === 1 ? "active" : "inactive"}`}
              >
                {member.enabled === 1 ? "활성 계정" : "비활성/정지"}
              </span>
            </div>
            <div className="memberinfo-row">
              <label>소셜 가입</label>
              <span
                className={`memberinfo-social-tag ${member.social ? "is-social" : "is-general"}`}
              >
                {member.social ? "소셜 회원" : "일반 회원"}
              </span>
            </div>
            <div className="memberinfo-row">
              <label>가입일</label>
              <span>{member.regDate ? member.regDate.split("T")[0] : "-"}</span>
            </div>

            {/* 정지 정보가 있을 때만 출력 */}
            {member.stopDate && (
              <div className="memberinfo-row highlight-row">
                <label>계정 정지일</label>
                <span className="stop-text">
                  {member.stopDate} ~ {member.stopEndDate}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadPage;
