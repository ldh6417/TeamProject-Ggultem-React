import { useEffect, useState } from "react";
import { getList, API_SERVER_HOST } from "../../api/BusinessApi";
import useCustomMove from "../../hooks/useCustomMove";
import PageComponent from "../common/PageComponent";
import { useNavigate } from "react-router-dom";
import "./ListComponent.css";
import useCustomLogin from "../../hooks/useCustomLogin";

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
    sign,
    category,
    moveToBusinessList,
    moveToBusinessBoardR,
  } = useCustomMove();
  const [serverData, setServerData] = useState(initState);
  const [codeSearchType, setCodeSearchType] = useState("all");
  const [codeKeyword, setCodeKeyword] = useState("");
  const [adSign, setAdSign] = useState("all");
  const [adCategory, setAdCategory] = useState("all");
  const navigate = useNavigate();
  const { loginState } = useCustomLogin();

  //내가 등록한 businessBoard 리스트
  useEffect(() => {
    getList(
      { page, size, keyword, searchType, sign, category },
      loginState.email,
    ).then((data) => {
      console.log(data);
      setServerData(data);
    });
  }, [
    page,
    size,
    keyword,
    searchType,
    sign,
    category,
    refresh,
    loginState.email,
  ]);

  const handleReset = () => {
    setCodeKeyword(""); // 입력창 비우기
    setCodeSearchType("all");
    setAdSign("all");
    setAdCategory("all");
    navigate("/business/list");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    moveToBusinessList({
      page: 1, // 검색 시에는 1페이지로 이동하는 게 좋습니다
      size,
      keyword: codeKeyword,
      searchType: codeSearchType,
      sign: adSign,
      category: adCategory,
    });
  };
  return (
    <div className="biz-list-wrapper">
      {/* 📦 하단 상품 게시판 리스트 */}
      <section className="biz-item-list-section">
        <div className="businessboard-header">
          <div className="list-header">
            <h3>내가 등록한 상품 ({serverData.totalCount})</h3>
          </div>
          <form className="codegroup-search-form" onSubmit={handleSearch}>
            <div className="codegroup-actions">
              <select
                className="admin-search status-filter"
                value={adSign}
                onChange={(e) => setAdSign(e.target.value)}
              >
                <option value="all">광고상태</option>
                <option value="true">승인 광고</option>
                <option value="false">비승인 광고</option>
              </select>
              <select
                className="admin-search status-filter"
                value={adCategory}
                onChange={(e) => setAdCategory(e.target.value)}
              >
                <option value="all">광고구분</option>
                <option value="powershoping">파워쇼핑</option>
                <option value="powerlink">파워링크</option>
              </select>
              <select
                className="admin-search"
                value={codeSearchType}
                onChange={(e) => setCodeSearchType(e.target.value)}
              >
                <option value="all">전체</option>
                <option value="title">제목</option>
                <option value="content">내용</option>
                <option value="writer">비즈니스 회원명</option>
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
          <div className="admin-btn-group">
            <button className="admin-btn reset-btn" onClick={handleReset}>
              목록 초기화
            </button>
            <button
              className="admin-btn add-btn"
              onClick={() => navigate("/business/board/register")}
            >
              새 광고 상품 등록
            </button>
            <button
              className="admin-btn delete-btn"
              onClick={() => navigate("/business/board/deletelist")}
            >
              휴지통
            </button>
          </div>
        </div>

        <table className="biz-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>이미지</th>
              <th>상품명</th>
              <th>가격</th>
              <th>클릭수</th>
              <th>등록일</th>
              <th>종료일</th>
              <th>광고 승인</th>
              <th>광고 상태</th>
            </tr>
          </thead>
          <tbody>
            {serverData.dtoList.length > 0 ? (
              serverData.dtoList.map((item) => (
                <tr
                  key={item.no}
                  onClick={() => moveToBusinessBoardR(item.no)}
                  className="table-row"
                >
                  <td>{item.no}</td>
                  <td>
                    <img
                      src={`${host}/business/board/view/s_${item.uploadFileNames?.[0]}`}
                      alt="thumb"
                      className="table-thumb"
                    />
                  </td>
                  <td className="table-title">{item.title}</td>
                  <td>{item.price?.toLocaleString()}원</td>
                  <td>{item.viewCount?.toLocaleString()}회</td>
                  <td>{item.regDate?.substring(0, 10)}</td>
                  <td>{item.endDate?.substring(0, 10)}</td>
                  <td
                    className={`businessboard-td-status ${item.sign === false ? "inactive" : "active"}`}
                  >
                    <span
                      className={`status-dot ${item.sign === false ? "inactive" : "active"}`}
                    ></span>
                    {item.sign === false ? "비활성" : "활성"}
                  </td>
                  <td
                    className={`businessboard-td-status ${item.onOff === false ? "inactive" : "active"}`}
                  >
                    <span
                      className={`status-dot ${item.onOff === false ? "inactive" : "active"}`}
                    ></span>
                    {item.onOff === true ? "운영중" : "종료"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  등록된 상품이 없습니다. 첫 상품을 등록해 보세요! 🍯
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <PageComponent
          serverData={serverData}
          moveToList={moveToBusinessList}
        />
      </section>
    </div>
  );
};

export default ListComponent;
