import React, { useEffect, useState } from "react";
import { getMyInfo, API_SERVER_HOST } from "../../api/MemberApi";
import "./MyPageComponent.css";
import { useNavigate } from "react-router";
import useCustomMove from "../../hooks/useCustomMove";

const initState = {
  email: "",
  nickname: "",
  social: false,
  phone: "",
  businessNumber: null,
  companyName: null,
  bizMoney: 0,
  regDate: null,
  uploadFileNames: [],
};

const host = API_SERVER_HOST;

const MyPageMain = ({ email }) => {
  const [member, setMember] = useState(initState);
  const navigate = useNavigate();
  const { moveToMyPageModify } = useCustomMove();

  useEffect(() => {
    // 백엔드에서 데이터 가져오기
    getMyInfo(email).then((data) => {
      setMember(data);
    });
  }, [email]);

  if (!member)
    return (
      <div className="text-center mt-10">데이터를 불러오는 중입니다...</div>
    );

  // 썸네일 경로 (백엔드에서 default.jpg를 보내주므로 안전함)
  const thumbnailFile = member.uploadFileNames?.[0] || "default.jpg";
  const imageSrc = `${host}/mypage/view/${thumbnailFile}`;

  return (
    <div className="mp-mypage-wrapper">
      <div className="mp-mypage-container">
        {/* 1. 왼쪽 섹션 (판매내역, 장바구니) */}
        <div className="mp-left-content">
          <section className="mp-content-box">
            <div className="mp-section-header">
              <h3 className="mp-section-title">내가 올린 중고거래</h3>
              {/* 우측 상단 버튼 추가 */}
              <button
                className="mp-add-item-btn"
                onClick={() => navigate("/itemboard/register")}
              >
                중고거래 등록하기
              </button>
            </div>
            <div className="mp-empty-placeholder">
              등록된 상품이 없습니다. 첫 상품을 올려보세요!
            </div>
          </section>

          <section className="mp-content-box">
            <div className="mp-section-header">
              <h3 className="mp-section-title">장바구니</h3>
              <button
                className="mp-add-item-btn"
                onClick={() => navigate("/cart/list")}
              >
                장바구니 바로가기
              </button>
            </div>
            <div className="mp-empty-placeholder">
              장바구니가 비어 있습니다.
            </div>
          </section>
        </div>

        {/* 2. 오른쪽 섹션 (회원 정보 카드) - 왼쪽 섹션 밖으로 꺼내야 합니다! */}
        <aside className="mp-right-sidebar">
          <div className="mp-profile-summary-card">
            <div className="mp-card-header-gradient"></div>

            <div className="mp-profile-info-content">
              <img
                src={`${host}/mypage/view/${member.uploadFileNames}`}
                alt="Profile"
                className="mp-mini-profile-img"
              />

              <div className="mp-name-group">
                {/* 닉네임이 안 나왔다면 member.nickname 확인 */}
                <h2 className="mp-user-nickname">
                  {member.nickname || "꿀템유저"}
                </h2>
                <span className="mp-user-email">{member.email}</span>
              </div>

              <div className="mp-info-mini-list">
                <div className="mp-mini-item">
                  <span className="mp-label">가입일</span>
                  <span className="mp-value">
                    {member.regDate
                      ? member.regDate.substring(0, 10)
                      : "2026-03-18"}
                  </span>
                </div>
                <div className="mp-mini-item">
                  <span className="mp-label">계정유형</span>
                  <span className="mp-value badge">
                    {member.email === "admin@honey.com"
                      ? "관리자"
                      : member.social
                        ? `${email.split("_")[0]}`
                        : "일반"}
                  </span>
                </div>
              </div>

              <button
                className="mp-btn-modify-nav"
                type="button"
                onClick={() => moveToMyPageModify()}
              >
                수정하기
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MyPageMain;
