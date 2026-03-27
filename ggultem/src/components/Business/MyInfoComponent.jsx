import { useEffect, useState } from "react";
import { API_SERVER_HOST, getMyPage } from "../../api/BusinessApi";
import { useNavigate } from "react-router-dom";
import "./MyInfo.css";
import { useSelector } from "react-redux";

const initStateMember = {
  email: "",
  pw: "",
  nickname: "",
  phone: "",
  businessNumber: "",
  companyName: "",
  businessVerified: false,
  bizMoney: 0,
  roleNames: [],
  regDate: null,
  dtdDate: null,
  stopDate: null,
  stopEndDate: null,
  uploadFileNames: [],
};

const host = API_SERVER_HOST;

const MyInfoComponent = () => {
  const loginState = useSelector((state) => state.loginSlice);
  const [member, setMember] = useState(initStateMember);
  const navigate = useNavigate();

  //내 정보
  useEffect(() => {
    getMyPage(loginState.email).then((data) => {
      setMember(data);
    });
  }, [loginState.email]);

  if (!member)
    return <div className="loading">비즈니스 정보를 불러오는 중...</div>;

  return (
    <div className="biz-list-wrapper">
      {/* 🍯 상단 비즈니스 프로필 카드 */}
      <section className="biz-profile-card">
        <div className="biz-profile-left">
          <img
            src={`${host}/mypage/view/${member.uploadFileNames?.[0] || "default.jpg"}`}
            alt="Profile"
            className="biz-main-img"
          />
        </div>

        <div className="biz-profile-center">
          <div className="biz-info-header">
            <span className="biz-nickname">{member.nickname}</span>
            <span className="biz-email">{member.email}</span>
          </div>
          <div className="biz-info-body">
            <div className="info-item">
              <span className="label">상호명</span>
              <span className="value">{member.companyName || "미등록"}</span>
            </div>
            <div className="info-item">
              <span className="label">사업자번호</span>
              <span className="value">
                {member.businessNumber || "000-00-00000"}
              </span>
            </div>
            <div className="info-item">
              <span className="label">승인여부</span>
              <span
                className={`status-badge ${member.businessVerified ? "verified" : "pending"}`}
              >
                {member.businessVerified ? "인증완료" : "검토중"}
              </span>
            </div>
          </div>
        </div>

        <div className="biz-profile-right">
          <div className="biz-money-box">
            <p className="money-label">보유 비즈머니</p>
            <h3 className="money-amount">
              {member.bizMoney?.toLocaleString()}원
            </h3>
            <button
              className="biz-history-btn"
              onClick={() => navigate("/business/money/history")}
            >
              내역 보기 {">"}
            </button>
          </div>
          <p className="reg-date">
            파트너 가입일: {member.regDate?.substring(0, 10)}
          </p>
        </div>
      </section>
    </div>
  );
};

export default MyInfoComponent;
