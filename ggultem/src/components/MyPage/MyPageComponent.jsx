import React, { useCallback, useEffect, useState } from "react";
import { getMyInfo, API_SERVER_HOST, removeMember } from "../../api/MemberApi";
import { useLocation, useNavigate } from "react-router";
import { getList as getItemList } from "../../api/ItemBoardApi";
import useCustomMove from "../../hooks/useCustomMove";
import useCustomLogin from "../../hooks/useCustomLogin";
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
  const { doLogout } = useCustomLogin();
  const { moveToMyPageModify } = useCustomMove();
  const [itemPage, setItemPage] = useState(1);
  const [cartPage, setCartPage] = useState(1);
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

  const getAllData = useCallback(() => {
    if (!email) return;

    // 1. 회원 정보 로드
    getMyInfo(email).then((data) => setMember(data));

    // 2. 내 상품 리스트 로드 및 프론트엔드 강제 필터링
    getItemList({ page: itemPage, size: size, email: email }).then((data) => {
      if (data && data.dtoList) {
        // ✨ [강제 필터링] 서버 데이터 중 내 이메일과 일치하는 것만 추출
        const myItems = data.dtoList.filter((item) => item.email === email);

        // ✨ [페이징 재계산] 내 아이템 개수에 맞는 페이지 번호 생성
        const myTotalCount = myItems.length;
        const myPageNumList = [];
        const totalPages = Math.ceil(myTotalCount / size) || 1; // 최소 1페이지

        for (let i = 1; i <= totalPages; i++) {
          myPageNumList.push(i);
        }

        setServerData({
          ...data,
          dtoList: myItems, // 내 것만 담기
          totalCount: myTotalCount, // 내 것 개수만 넣기
          pageNumList: myPageNumList, // 내 것 전용 페이지 번호
          next: false, // 프론트 필터링 시 다음 페이지 계산이 어려우므로 일단 비활성
          prev: false,
        });
      }
    });

    // 3. 장바구니 리스트 로드 (장바구니도 동일한 로직 적용)
    axios
      .get(`${host}/cart/list`, {
        params: { page: cartPage, size: size, email: email },
      })
      .then((res) => {
        const data = res.data;
        if (data && data.dtoList) {
          // 장바구니는 itemBoard 안에 email이 있는지 확인해야 함
          const myCartItems = data.dtoList.filter(
            (item) => item.email === email || item.itemBoard?.email === email,
          );

          const cartTotalPages = Math.ceil(myCartItems.length / size) || 1;
          const cartPageList = [];
          for (let i = 1; i <= cartTotalPages; i++) cartPageList.push(i);

          setCartData({
            ...data,
            dtoList: myCartItems,
            totalCount: myCartItems.length,
            pageNumList: cartPageList,
            next: false,
            prev: false,
          });
        }
      });
  }, [email, itemPage, cartPage, size]);

  useEffect(() => {
    getAllData();
    if (location.state?.refresh) {
      getAllData();
      window.history.replaceState({}, document.title);
    }
  }, [getAllData, location.state?.refresh, location.key]);

  const moveItemPage = (pageParam) => setItemPage(pageParam.page);
  const moveCartPage = (pageParam) => setCartPage(pageParam.page);

  const removeHandler = (email) => {
    if (
      !window.confirm(
        "정말 회원 탈퇴를 하시겠습니까?\n탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다.",
      )
    ) {
      return;
    }
    removeMember(email)
      .then(() => {
        alert("회원 탈퇴에 성공하였습니다. 그동안 이용해 주셔서 감사합니다.");
        doLogout();
        navigate("/", { replace: true });
      })
      .catch((error) => {
        console.error("탈퇴 오류:", error);
        alert("탈퇴 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      });
  };

  if (!member)
    return (
      <div className="text-center mt-10">데이터를 불러오는 중입니다...</div>
    );

  // ✨ 페이징 번호를 실제 데이터 개수에 맞게 필터링하는 함수
  const getValidServerData = (data) => {
    const lastPage = Math.ceil(data.totalCount / size);
    return {
      ...data,
      pageNumList: data.pageNumList.filter((n) => n <= lastPage),
    };
  };

  return (
    <div className="mp-mypage-wrapper">
      <div className="mp-mypage-container">
        {/* 1. 왼쪽 섹션 (판매내역, 장바구니) */}
        <div className="mp-left-content">
          <section className="mp-content-box">
            <div className="mp-section-header">
              <h3 className="mp-section-title">내가 올린 중고거래</h3>
              <button
                className="mp-add-item-btn"
                onClick={() => navigate("/itemboard/myPage")}
              >
                중고거래 리스트
              </button>
            </div>

            {serverData.dtoList && serverData.dtoList.length > 0 ? (
              serverData.dtoList.map((item) => {
                const isSoldOut =
                  item.status === "판매완료" ||
                  item.status === "true" ||
                  Number(item.enabled) === 2;
                return (
                  <div
                    key={item.id}
                    className="mp-item-card"
                    onClick={() => navigate(`/itemBoard/read/${item.id}`)}
                  >
                    <div className="mp-image-container">
                      {isSoldOut && (
                        <div className="mp-sold-out-overlay">SOLD OUT</div>
                      )}
                      <img
                        className={`mp-item-img ${isSoldOut ? "mp-img-darken" : ""}`}
                        src={
                          item.uploadFileNames &&
                          item.uploadFileNames.length > 0
                            ? `${host}/itemBoard/view/s_${item.uploadFileNames[0]}`
                            : `${host}/itemBoard/view/default.jpg`
                        }
                        alt="item"
                      />
                    </div>
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
                );
              })
            ) : (
              <div className="mp-empty-placeholder">
                등록된 상품이 없습니다.
              </div>
            )}

            {/* ✨ 수정: 보정된 페이징 데이터 전달 */}
            {serverData.totalCount > 0 && (
              <div className="mp-pagination-wrapper">
                <PageComponent
                  moveToList={moveItemPage}
                  serverData={getValidServerData(serverData)}
                />
              </div>
            )}
          </section>

          {/* 2. 장바구니 섹션 */}
          <section className="mp-content-box">
            <div className="mp-section-header">
              <h3 className="mp-section-title">장바구니</h3>
              <button
                className="mp-add-item-btn"
                onClick={() => navigate("/cart/list")}
              >
                장바구니 리스트
              </button>
            </div>
            {cartData.dtoList && cartData.dtoList.length > 0 ? (
              cartData.dtoList.map((item) => {
                const isSoldOut =
                  item.itemBoard?.status === "판매완료" ||
                  item.itemBoard?.status === "true" ||
                  Number(item.itemBoard?.enabled) === 2;

                return (
                  <div
                    key={item.id}
                    className="mp-item-card"
                    onClick={() =>
                      navigate(`/itemBoard/read/${item.itemBoard.id}`)
                    }
                  >
                    <div className="mp-image-container">
                      {isSoldOut && (
                        <div className="mp-sold-out-overlay">SOLD OUT</div>
                      )}
                      <img
                        className={`mp-item-img ${isSoldOut ? "mp-img-darken" : ""}`}
                        src={
                          item.itemBoard.itemList &&
                          item.itemBoard.itemList.length > 0
                            ? `${host}/itemBoard/view/s_${item.itemBoard.itemList[0].fileName}`
                            : `${host}/itemBoard/view/default.jpg`
                        }
                        alt="cart-item"
                      />
                    </div>
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
                );
              })
            ) : (
              <div className="mp-empty-placeholder">
                장바구니가 비어 있습니다.
              </div>
            )}

            {/* ✨ 수정: 보정된 장바구니 페이징 데이터 전달 */}
            {cartData.totalCount > 0 && (
              <div className="mp-pagination-wrapper">
                <PageComponent
                  moveToList={moveCartPage}
                  serverData={getValidServerData(cartData)}
                />
              </div>
            )}
          </section>
        </div>

        {/* 2. 오른쪽 섹션 (회원 정보 카드) */}
        <aside className="mp-right-sidebar">
          <div className="mp-profile-summary-card">
            <div className="mp-card-header-gradient"></div>
            <div className="mp-profile-info-content">
              <img
                src={
                  member.uploadFileNames && member.uploadFileNames.length > 0
                    ? `${host}/mypage/view/${member.uploadFileNames[0]}`
                    : `${host}/mypage/view/default.jpg`
                }
                alt="Profile"
                className="mp-mini-profile-img"
              />

              <div className="mp-name-group">
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
                        ? `${member.email.split("_")[0]}`
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
              <button
                className="mp-btn-remove-nav"
                type="button"
                onClick={() => removeHandler(member.email)}
              >
                회원탈퇴
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MyPageMain;
