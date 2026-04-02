import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getOne,
  API_SERVER_HOST,
  reject,
  approve,
} from "../../../api/admin/BusinessApi";
import "./ReadComponent.css";

const host = API_SERVER_HOST;

const initState = {
  email: "",
  pw: "",
  nickname: "",
  social: false,
  phone: "",
  businessNumber: "",
  companyName: "",
  businessVerified: false,
  bizMoney: 0,
  enabled: 0,
  roleNames: [],
  regDate: null,
  dtdDate: null,
  stopDate: null,
  stopEndDate: null,
  uploadFileNames: [],
};

const ReadComponent = ({ email }) => {
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

  const approveOnClick = () => {
    approve(email)
      .then((data) => {
        alert("비즈니스 회원 승인이 완료되었습니다.");
        navigate(`/admin/businessmember/list`);
      })
      .catch(() => {
        alert("비즈니스 회원 승인에 실패하였습니다.");
        navigate(`/admin/businessmember/list`);
      });
  };
  const rejectOnClick = () => {
    reject(email)
      .then((data) => {
        alert("비즈니스 회원 승인이 취소되었습니다.");
        navigate(`/admin/businessmember/list`);
      })
      .catch(() => {
        alert("비즈니스 회원 승인 취소에 실패하였습니다.");
        navigate(`/admin/businessmember/list`);
      });
  };

  if (!email || !member.email)
    return (
      <div className="memberinfo-read-loading">
        사용자 정보를 불러오는 중입니다...
      </div>
    );

  return (
    <div className="memberinfo-read-wrapper">
      <div className="memberinfo-read-container">
        {/* 상단 타이틀 및 버튼 */}
        <div className="memberinfo-read-header">
          <h2 className="memberinfo-read-title">비즈니스 회원 상세 정보</h2>
          <div className="memberinfo-read-actions">
            {member.businessVerified === false ? (
              <button
                className="memberinfo-read-btn approve"
                onClick={approveOnClick}
              >
                비즈니스 승인
              </button>
            ) : (
              <button
                className="memberinfo-read-btn approve"
                onClick={rejectOnClick}
              >
                비즈니스 승인 취소
              </button>
            )}
            <button
              className="memberinfo-read-btn list"
              onClick={() => navigate(`/admin/businessmember/list`)}
            >
              목록으로
            </button>
          </div>
        </div>

        <div className="memberinfo-read-content">
          {/* 왼쪽: 프로필 이미지 및 권한 배지 */}
          <div className="memberinfo-read-profile-section">
            <div className="memberinfo-read-image-box">
              {member.uploadFileNames && member.uploadFileNames.length > 0 ? (
                <img
                  src={`${host}/mypage/view/${member.uploadFileNames[0]}`}
                  alt="Business Profile"
                />
              ) : (
                <div className="memberinfo-read-no-image">No Image</div>
              )}
            </div>
            <div className="memberinfo-read-role-badges">
              {member.roleNames.map((role, idx) => (
                <span
                  key={idx}
                  className={`memberinfo-read-role-badge ${role.toLowerCase()}`}
                >
                  {role}
                </span>
              ))}
              {/* 사업자 인증 여부 배지 추가 */}
              <span
                className={`memberinfo-read-role-badge ${member.businessVerified ? "verified" : "unverified"}`}
              >
                {member.businessVerified ? "인증 사업자" : "미인증 사업자"}
              </span>
            </div>
          </div>

          {/* 오른쪽: 상세 정보 리스트 */}
          <div className="memberinfo-read-details">
            <div className="memberinfo-read-row highlight-row">
              <label>상호명</label>
              <span className="memberinfo-read-company">
                {member.companyName || "미등록"}
              </span>
            </div>
            <div className="memberinfo-read-row">
              <label>사업자 번호</label>
              <span>{member.businessNumber || "미등록"}</span>
            </div>
            <div className="memberinfo-read-row">
              <label>이메일(ID)</label>
              <span>{member.email}</span>
            </div>
            <div className="memberinfo-read-row">
              <label>닉네임</label>
              <span className="memberinfo-read-nickname">
                {member.nickname}
              </span>
            </div>
            <div className="memberinfo-read-row">
              <label>보유 비즈머니</label>
              <span className="memberinfo-read-money">
                {member.bizMoney.toLocaleString()} 원
              </span>
            </div>
            <div className="memberinfo-read-row">
              <label>연락처</label>
              <span>{member.phone || "미등록"}</span>
            </div>
            <div className="memberinfo-read-row">
              <label>계정 상태</label>
              <span
                className={`memberinfo-read-status ${member.enabled === 1 ? "active" : "inactive"}`}
              >
                {member.enabled === 1 ? "활성 계정" : "비활성/정지"}
              </span>
            </div>
            <div className="memberinfo-read-row">
              <label>가입일</label>
              <span>{member.regDate ? member.regDate.split("T")[0] : "-"}</span>
            </div>

            {/* 정지 정보가 있을 때만 출력 */}
            {member.stopDate && (
              <div className="memberinfo-read-row alert-row">
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

export default ReadComponent;
