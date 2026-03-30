import React, { useEffect, useState } from "react";
import { getMyInfo, API_SERVER_HOST } from "../../api/MemberApi";
import { useLocation, useNavigate } from "react-router";
import { getList as getItemList } from "../../api/ItemBoardApi";
import useCustomMove from "../../hooks/useCustomMove";
import PageComponent from "../common/PageComponent";
import "./MyPageComponent.css";
import axios from "axios";

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
  const location = useLocation();
  const { moveToMyPageModify } = useCustomMove();
  const [itemPage, setItemPage] = useState(1); // 상품용 페이지
  const [cartPage, setCartPage] = useState(1); // 장바구니용 페이지
  const size = 5;
  const [serverData, setServerData] = useState({
    dtoList: [],
    totalCount: 0,
    pageNumList: [],
    prev: false,
    next: false,
  });

  const [cartData, setCartData] = useState({
    dtoList: [],
    totalCount: 0,
    pageNumList: [],
    prev: false,
    next: false,
  });

  const getAllData = () => {
    if (!email) return;

    // 회원 정보 로드
    getMyInfo(email).then((data) => setMember(data));

    // 내 상품 리스트 로드
    getItemList({ page: itemPage, size: size, email: email }).then((data) => {
      if (data) setServerData(data);
    });

    // 장바구니 리스트 로드
    axios
      .get(`${host}/cart/list`, {
        params: { page: cartPage, size: size, email: email },
      })
      .then((res) => {
        setCartData(res.data);
      });
  };

  // 2. 통합 useEffect
  useEffect(() => {
    getAllData();

    // ✨ 핵심: CartList에서 보낸 { refresh: true } 신호가 있으면 데이터를 다시 부름
    if (location.state?.refresh) {
      getAllData();

      // 사용한 신호는 비워줌 (다시 들어왔을 때 무한 리프레시 방지)
      window.history.replaceState({}, document.title);
    }

    // location.key를 넣어 페이지 이동(뒤로가기 포함) 시 매번 체크하도록 설정
  }, [email, itemPage, cartPage, location.key]);

  const moveItemPage = (pageParam) => {
    setItemPage(pageParam.page);
  };

  // 장바구니 페이지 변경 (필요할 경우)
  const moveCartPage = (pageParam) => {
    setCartPage(pageParam.page);
  };

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
            {serverData.dtoList && serverData.dtoList.length > 0 ? (
              serverData.dtoList
                .filter((item) => item.email === email)
                .map((item) => (
                  <div
                    key={item.id}
                    className="mp-item-card"
                    onClick={() => navigate(`/itemBoard/read/${item.id}`)}
                  >
                    <img
                      src={
                        item.uploadFileNames && item.uploadFileNames.length > 0
                          ? `${host}/itemBoard/view/s_${item.uploadFileNames[0]}`
                          : `${host}/itemBoard/view/default.jpg`
                      }
                      alt="item"
                    />
                    <div className="mp-item-info">
                      <span className="mp-item-title">{item.title}</span>
                      <span className="mp-item-price">
                        {item.price?.toLocaleString() || 0}원
                      </span>
                      <span className="mp-item-date">
                        추가한 날짜: {item.regDate?.substring(0, 10)}
                      </span>
                    </div>
                  </div>
                ))
            ) : (
              <div className="mp-empty-placeholder">
                등록된 상품이 없습니다.
              </div>
            )}
            <div className="mp-pagination-wrapper">
              <PageComponent
                moveToList={moveItemPage}
                serverData={serverData}
              />
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
            {cartData.dtoList && cartData.dtoList.length > 0 ? (
              cartData.dtoList.map((item) => (
                <div
                  key={item.id}
                  className="mp-item-card"
                  onClick={() =>
                    navigate(`/itemBoard/read/${item.itemBoard.id}`)
                  }
                >
                  <img
                    src={
                      item.itemBoard.itemList &&
                      item.itemBoard.itemList.length > 0
                        ? `${host}/itemBoard/view/s_${item.itemBoard.itemList[0].fileName}`
                        : item.itemBoard.uploadFileNames &&
                            item.itemBoard.uploadFileNames.length > 0
                          ? `${host}/itemBoard/view/s_${item.itemBoard.uploadFileNames[0]}`
                          : `${host}/itemBoard/view/default.jpg`
                    }
                    alt="cart-item"
                  />
                  <div className="mp-item-info">
                    <span className="mp-item-title">
                      {item.itemBoard.title}
                    </span>
                    <span className="mp-item-price">
                      {item.itemBoard.price?.toLocaleString() || 0}원
                    </span>
                    <span className="mp-item-date">
                      담은 날짜: {item.itemBoard.regDate?.substring(0, 10)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="mp-empty-placeholder">
                장바구니가 비어 있습니다.
              </div>
            )}
            <div className="mp-pagination-wrapper">
              <PageComponent moveToList={moveCartPage} serverData={cartData} />
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
                  <span className="mp-value-badge">
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
