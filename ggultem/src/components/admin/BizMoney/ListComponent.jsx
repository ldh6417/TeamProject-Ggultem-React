import { useEffect, useState } from "react";
import {
  getList,
  API_SERVER_HOST,
  getBizMoneyHistoryAdmin,
  getBizMoneyTotalHistoryAdmin,
} from "../../../api/admin/BusinessApi";
import useCustomMove from "../../../hooks/useCustomMove";
import PageComponent from "../../common/PageComponent";
import { useNavigate } from "react-router-dom";
import "./ListComponent.css";

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

const host = API_SERVER_HOST;

const ListComponent = () => {
  const {
    page,
    size,
    keyword,
    searchType,
    refresh,
    state,
    moveToAdminBizMoneyList,
  } = useCustomMove();
  const [serverData, setServerData] = useState(initState);
  const [codeSearchType, setCodeSearchType] = useState("all");
  const [codeKeyword, setCodeKeyword] = useState("");
  const [bizState, setBizState] = useState("all");
  const [totalSummary, setTotalSummary] = useState(initState);
  const [isTotal, setIsTotal] = useState(false);
  const navigate = useNavigate();

  const clickIsTotal = () => {
    setIsTotal(!isTotal);
  };

  useEffect(() => {
    if (isTotal) {
      // 통계 모드일 때만 통계 API 호출
      getBizMoneyTotalHistoryAdmin({
        page,
        size,
        keyword,
        searchType,
        state,
      }).then((totalData) => {
        console.log(totalData);
        setTotalSummary(totalData);
      });
    } else {
      // 일반 모드일 때만 일반 API 호출
      getBizMoneyHistoryAdmin({ page, size, keyword, searchType, state }).then(
        (data) => {
          setServerData(data);
        },
      );
    }
  }, [page, size, keyword, searchType, refresh, state, isTotal]); // isTotal 추가

  const handleReset = () => {
    setCodeKeyword(""); // 입력창 비우기
    setCodeSearchType("all");
    setBizState("all");

    navigate("/admin/bizmoney/list");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    moveToAdminBizMoneyList({
      page: 1, // 검색 시에는 1페이지로 이동하는 게 좋습니다
      size,
      keyword: codeKeyword,
      searchType: codeSearchType,
      state: bizState,
    });
  };

  return (
    <div className="member-list-wrapper">
      <div className="member-list-container">
        {/* 헤더 섹션 */}
        <div className="member-header">
          <div className="title-group">
            <h2 className="member-title">
              {isTotal ? " 비즈머니 회원 통계" : " 비즈머니 내역 관리"}
            </h2>
            <p className="member-subtitle">
              {isTotal
                ? "회원별 충전/지출 합계 요약입니다."
                : "꿀템 사이트의 비즈머니 이용내역 리스트입니다."}
            </p>
          </div>
          <form className="codegroup-search-form" onSubmit={handleSearch}>
            <div className="codegroup-actions">
              <select
                className="admin-search status-filter"
                value={bizState}
                onChange={(e) => setBizState(e.target.value)}
              >
                <option value="all">구분</option>
                <option value="SPEND">지출내역</option>
                <option value="CHARGE">충전내역</option>
              </select>
              <select
                className="admin-search"
                value={codeSearchType}
                onChange={(e) => setCodeSearchType(e.target.value)}
              >
                <option value="all">전체</option>
                <option value="detail">상세정보</option>
                <option value="email">회원이메일</option>
              </select>
              <input
                type="text"
                value={codeKeyword}
                onChange={(e) => setCodeKeyword(e.target.value)}
                placeholder="검색어를 입력하세요"
              />
              <button type="submit" className="search-btn-wide">
                🍯 검색
              </button>
            </div>
          </form>
        </div>
        <div className="admin-btn-group">
          <button className="admin-btn reset-btn" onClick={handleReset}>
            목록 초기화
          </button>

          <div className="member-actions">
            <button
              className="admin-btn member-btn"
              onClick={() => navigate("/admin/member/list")}
            >
              일반회원
            </button>
            <button
              className="admin-btn biz-btn"
              onClick={() => navigate("/admin/businessmember/list")}
            >
              비즈니스 회원
            </button>
            <button className="admin-btn add-btn" onClick={clickIsTotal}>
              {isTotal ? "전체목록" : "회원통계"}
            </button>
          </div>
        </div>
        {/* ✨ 테이블 섹션 전환 로직 수정 */}
        <div className="member-table-responsive">
          {!isTotal ? (
            /* [모드 1] 일반 이용 내역 테이블 */
            <>
              <table className="member-table">
                <thead>
                  <tr>
                    <th>회원이메일</th>
                    <th>거래 일시</th>
                    <th>유형</th>
                    <th>상세 내용</th>
                    <th>변동 금액</th>
                    <th>잔액</th>
                  </tr>
                </thead>
                <tbody>
                  {serverData.dtoList && serverData.dtoList.length > 0 ? (
                    serverData.dtoList.map((item) => (
                      <tr key={item.hno}>
                        <td>{item.email}</td>
                        <td className="date-cell">{item.regDate}</td>
                        <td>
                          <span
                            className={`type-badge ${item.type.toLowerCase()}`}
                          >
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
                      <td colSpan="6" className="no-data">
                        내역이 없습니다. 🐝
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* 일반 내역용 페이징 */}
              <div className="member-pagination-wrapper">
                <PageComponent
                  serverData={serverData}
                  moveToList={moveToAdminBizMoneyList}
                />
              </div>
            </>
          ) : (
            /* [모드 2] 회원별 통계 테이블 */
            <>
              <table className="member-table">
                <thead>
                  <tr>
                    <th>회원이메일</th>
                    <th>유형</th>
                    <th>총 합계 금액</th>
                  </tr>
                </thead>
                <tbody>
                  {totalSummary.dtoList && totalSummary.dtoList.length > 0 ? (
                    totalSummary.dtoList.map((item, idx) => (
                      <tr key={`${item.email}-${item.type}-${idx}`}>
                        <td>{item.email}</td>
                        <td>
                          <span
                            className={`type-badge ${item.type?.toLowerCase()}`}
                          >
                            {item.type === "CHARGE" ? "충전" : "지출"}
                          </span>
                        </td>
                        <td
                          className={`amount-cell ${item.total > 0 ? "plus" : "minus"}`}
                        >
                          {(item.total || 0).toLocaleString()}원
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="no-data">
                        통계 데이터가 없습니다. 🐝
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* 통계 내역용 페이징 */}
              <div className="member-pagination-wrapper">
                <PageComponent
                  serverData={totalSummary}
                  moveToList={moveToAdminBizMoneyList}
                />
              </div>
            </>
          )}
          {/* 👈 여기서 삼항 연산자가 깔끔하게 닫혀야 합니다! */}
        </div>
      </div>
    </div>
  );
};

export default ListComponent;
