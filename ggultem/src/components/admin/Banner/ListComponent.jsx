import { useEffect, useState } from "react";
import { getBannerList, API_SERVER_HOST } from "../../../api/BannerApi";
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
    enabled,
    moveToBannerList,
  } = useCustomMove();
  const [serverData, setServerData] = useState(initState);
  const [codeSearchType, setCodeSearchType] = useState("all");
  const [codeKeyword, setCodeKeyword] = useState("");
  const [enabledFilter, setEnabledFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    getBannerList({ page, size, keyword, searchType, enabled }).then((data) => {
      console.log(data);
      setServerData(data);
    });
  }, [page, size, keyword, searchType, refresh, enabled]);

  const handleReset = () => {
    setCodeKeyword(""); // 입력창 비우기
    setCodeSearchType("all");

    navigate("/admin/banner/list");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    moveToBannerList({
      page: 1, // 검색 시에는 1페이지로 이동하는 게 좋습니다
      size,
      keyword: codeKeyword,
      searchType: codeSearchType,
      enabled: enabledFilter === "all" ? null : enabledFilter,
    });
  };

  return (
    <div className="banner-list-wrapper">
      <div className="banner-list-container">
        {/* 헤더 섹션 */}
        <div className="banner-header">
          <div className="title-group">
            <h2 className="banner-title">
              <span className="banner-title-point">꿀템</span> 배너 관리
            </h2>
            <p className="banner-subtitle">
              등록된 광고 배너를 관리하는 페이지입니다.
            </p>
          </div>
          <form className="codegroup-search-form" onSubmit={handleSearch}>
            <div className="codegroup-actions">
              <select
                className="admin-search status-filter"
                value={enabledFilter}
                onChange={(e) => setEnabledFilter(e.target.value)}
              >
                <option value="all">배너상태</option>
                <option value="1">운영배너</option>
                <option value="0">삭제배너</option>
              </select>
              <select
                className="admin-search"
                value={codeSearchType}
                onChange={(e) => setCodeSearchType(e.target.value)}
              >
                <option value="all">전체</option>
                <option value="title">배너제목</option>
                <option value="content">배너내용</option>
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
          <button
            className="admin-btn add-btn"
            onClick={() => navigate("/admin/banner/register")}
          >
            배너 추가
          </button>
        </div>
      </div>

      {/* 테이블 섹션 */}
      <div className="banner-table-responsive">
        <table className="banner-table">
          <thead>
            <tr>
              <th className="banner-th-email">배너No</th>
              <th className="banner-th-nickname">배너제목</th>
              <th className="banner-th-social">배너등록일</th>
              <th className="banner-th-date">배너마감일</th>
              <th className="banner-th-status">상태</th>
            </tr>
          </thead>
          <tbody>
            {serverData.dtoList.length > 0 ? (
              serverData.dtoList.map((banner) => (
                <tr
                  key={banner.no}
                  className="banner-tr"
                  onClick={() => navigate(`/admin/banner/${banner.no}`)}
                >
                  <td className="banner-td-no">{banner.no}</td>
                  <td className="banner-td-title">
                    <span className="title-badge">{banner.title}</span>
                  </td>
                  <td className="banner-td-regdate">
                    {banner.regDate ? banner.regDate.split("T")[0] : "-"}
                  </td>
                  <td className="banner-td-enddate">
                    {banner.endDate ? banner.endDate.split("T")[0] : "-"}
                  </td>
                  <td className="banner-td-status">
                    <span
                      className={`status-dot ${banner.enabled === 0 ? "inactive" : "active"}`}
                    ></span>
                    {banner.enabled === 0 ? "비활성" : "활성"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-list">
                  등록된 배너가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* 페이징 */}
        <div className="banner-pagination-wrapper">
          <PageComponent
            serverData={serverData}
            moveToList={moveToBannerList}
          />
        </div>
      </div>
    </div>
  );
};

export default ListComponent;
