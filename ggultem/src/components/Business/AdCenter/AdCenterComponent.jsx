import { useEffect, useState } from "react";
import {
  getMyPage,
  getBizMoneyHistory,
  chargeBizMoney,
  getTodaySpend,
  getTotalClick,
  getTotalSpend,
  getTodayClick,
} from "../../../api/BusinessApi";
import { useNavigate } from "react-router-dom";
import "./AdCenterComponent.css";
import PageComponent from "../../common/PageComponent";
import useCustomLogin from "../../../hooks/useCustomLogin";
import useCustomMove from "../../../hooks/useCustomMove";
import ChargeModal from "../../common/ChargeModal";

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

const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0,
};

const AdCenterComponent = () => {
  const navigate = useNavigate();
  const { loginState } = useCustomLogin();
  const [myHistory, setMyHistory] = useState(initState);
  const [todaySpend, setTodaySpend] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);
  const [todayClick, setTodayClick] = useState(0);
  const [totalClick, setTotalClick] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [codeKeyword, setCodeKeyword] = useState("");
  const [bizSearchType, setBizSearchType] = useState("all");
  const [bizState, setBizState] = useState("all");
  const [member, setMember] = useState(initStateMember);

  const {
    page,
    size,
    keyword,
    searchType,
    state,
    refresh,
    moveToBizMoneyList,
  } = useCustomMove();

  useEffect(() => {
    getMyPage(loginState.email).then((data) => {
      setMember(data);
    });
    getBizMoneyHistory(
      { page, size, keyword, searchType, state },
      loginState.email,
    ).then((data) => {
      console.log(data);
      setMyHistory(data);
    });
    getTodaySpend(loginState.email).then((data) => setTodaySpend(data));
    getTotalSpend(loginState.email).then((data) => setTotalSpend(data));
    getTodayClick(loginState.email).then((data) => setTodayClick(data));
    getTotalClick(loginState.email).then((data) => setTotalClick(data));
  }, [page, size, keyword, searchType, state, refresh, loginState.email]);

  const handleReset = (e) => {
    e.preventDefault(); // 폼 제출 방지

    // 1. 모든 상태값 초기화
    setCodeKeyword("");
    setBizSearchType("all");
    setBizState("all");

    // 2. ✨ URL 파라미터 초기화 이동
    moveToBizMoneyList({
      page: 1,
      size: 10,
      keyword: "", // 빈 키워드
      searchType: "all",
      state: "all", // 전체 내역으로
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    moveToBizMoneyList({
      page: 1,
      size,
      keyword: codeKeyword,
      searchType: bizSearchType,
      state: bizState,
    });
  };

  return (
    <div className="ad-center-wrapper">
      {/* 상단 비즈머니 현황판 */}
      <div className="ad-center-biz-money-card">
        <div className="ad-center-card-left">
          <span className="ad-center-label">사용 가능한 비즈머니</span>
          <h2 className="ad-center-amount">
            {member.bizMoney?.toLocaleString()} 원
          </h2>
        </div>
        <button
          className="ad-center-charge-btn-main"
          onClick={() => {
            console.log("버튼 클릭됨!");
            setShowModal(true);
          }}
        >
          충전하기
        </button>
      </div>

      {/* 중간 정산 섹션 (간략하게) */}
      <section className="biz-stats-container">
        <div className="stats-summary">
          {/* 1. 상단 큰 카드 */}
          <div className="stats-card">
            <h4>All DashBoard</h4>
            <div className="info-wrapper">
              <p>
                <span>누적 광고비</span>{" "}
                <strong>{totalSpend.toLocaleString()}원</strong>
              </p>
              <p>
                <span>누적 클릭수</span>{" "}
                <strong>{totalClick.toLocaleString()}회</strong>
              </p>
            </div>
          </div>

          {/* 2. 하단 작은 카드 2개 묶음 */}
          <div className="stats-summary-2">
            <div className="stats-card">
              <h4>Today Spend</h4>
              <div className="info-wrapper">
                <strong>{todaySpend.toLocaleString()}원</strong>
              </div>
            </div>
            <div className="stats-card">
              <h4>Today Click</h4>
              <div className="info-wrapper">
                <strong>{todayClick.toLocaleString()}회</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 하단 상세 내역 리스트 */}
      <div className="history-table-container">
        <div className="table-header">
          <h4>비즈머니 이용 상세 내역</h4>
          <span className="total-count">전체 {myHistory.length}건</span>
        </div>

        <form className="codegroup-search-form" onSubmit={handleSearch}>
          <div className="codegroup-actions">
            <select
              className="admin-search status-filter"
              value={bizState}
              onChange={(e) => {
                const nextState = e.target.value;
                setBizState(nextState); // 1. 상태 업데이트

                // 2. ✨ 즉시 페이지 이동 (검색 버튼 안 눌러도 됨)
                moveToBizMoneyList({
                  page: 1,
                  size: 10,
                  keyword: codeKeyword,
                  searchType: bizSearchType,
                  state: nextState, // 변경된 값을 바로 넘김
                });
              }}
            >
              <option value="all">지출내역</option>
              <option value="SPEND">지출</option>
              <option value="CHARGE">충전</option>
            </select>
            <select
              className="admin-search"
              value={bizSearchType}
              onChange={(e) => setBizSearchType(e.target.value)}
            >
              <option value="all">전체</option>
              <option value="detail">상세내용</option>
              <option value="amount">금액</option>
            </select>
            <input
              type="text"
              value={codeKeyword}
              onChange={(e) => setCodeKeyword(e.target.value)}
              placeholder="검색어를 입력하세요"
            />
            <button type="submit" className="search-btn-wide">
              검색
            </button>
            <button
              type="button"
              className="admin-btn reset-btn"
              onClick={handleReset}
            >
              목록 초기화
            </button>
          </div>
        </form>

        <table className="biz-history-table">
          <thead>
            <tr>
              <th>거래 일시</th>
              <th>유형</th>
              <th>상세 내용</th>
              <th>변동 금액</th>
              <th>잔액</th>
            </tr>
          </thead>
          <tbody>
            {myHistory.dtoList.length > 0 ? (
              myHistory.dtoList.map((item) => (
                <tr key={item.hno}>
                  <td className="date-cell">{item.regDate}</td>
                  <td>
                    <span className={`type-badge ${item.type.toLowerCase()}`}>
                      {item.type === "CHARGE" ? "충전" : "지출"}
                    </span>
                  </td>
                  <td className="detail-cell">{item.detail}</td>
                  <td
                    className={`amount-cell ${item.amount > 0 ? "plus" : "minus"}`}
                  >
                    {item.amount > 0
                      ? `+${item.amount.toLocaleString()}`
                      : item.amount.toLocaleString()}
                    원
                  </td>
                  <td className="balance-cell">
                    {item.balance.toLocaleString()}원
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  이용 내역이 없습니다. 🐝
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <PageComponent serverData={myHistory} moveToList={moveToBizMoneyList} />
      </div>
      {/* 충전 모달 */}
      {showModal && (
        <ChargeModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          member={member}
        />
      )}
    </div>
  );
};

export default AdCenterComponent;
