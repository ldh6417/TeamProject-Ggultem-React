import { useEffect, useState } from "react";
import { getList, API_SERVER_HOST } from "../../../api/admin/MemberApi";
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
    moveToMemberList,
  } = useCustomMove();
  const [serverData, setServerData] = useState(initState);
  const [codeSearchType, setCodeSearchType] = useState("all");
  const [codeKeyword, setCodeKeyword] = useState("");
  const [enabledFilter, setEnabledFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    getList({ page, size, keyword, searchType, enabled }).then((data) => {
      console.log(data);
      setServerData(data);
    });
  }, [page, size, keyword, searchType, refresh, enabled]);

  const handleReset = () => {
    setCodeKeyword(""); // 입력창 비우기
    setCodeSearchType("all");

    navigate("/admin/member/list");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    moveToMemberList({
      page: 1, // 검색 시에는 1페이지로 이동하는 게 좋습니다
      size,
      keyword: codeKeyword,
      searchType: codeSearchType,
      enabled: enabledFilter === "all" ? null : enabledFilter,
    });
  };

  return (
    <div className="member-list-wrapper">
      <div className="member-list-container">
        {/* 헤더 섹션 */}
        <div className="member-header">
          <div className="title-group">
            <h2 className="member-title">
              <span className="member-title-point">꿀템</span> 회원정보 관리
            </h2>
            <p className="member-subtitle">
              서비스에 가입된 전체 회원 목록입니다.
            </p>
          </div>
          <form className="codegroup-search-form" onSubmit={handleSearch}>
            <div className="codegroup-actions">
              <select
                className="admin-search status-filter"
                value={enabledFilter}
                onChange={(e) => setEnabledFilter(e.target.value)}
              >
                <option value="all">계정상태</option>
                <option value="1">활성 계정</option>
                <option value="0">비활성 계정</option>
              </select>
              <select
                className="admin-search"
                value={codeSearchType}
                onChange={(e) => setCodeSearchType(e.target.value)}
              >
                <option value="all">전체</option>
                <option value="nickname">닉네임</option>
                <option value="email">이메일</option>
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
              className="admin-btn biz-btn"
              onClick={() => navigate("/admin/businessmember/list")}
            >
              비즈니스 회원
            </button>
            <button
              className="admin-btn money-btn"
              onClick={() => navigate("/admin/bizmoney/list")}
            >
              비즈머니 내역
            </button>
            <button
              className="admin-btn add-btn"
              onClick={() => navigate("/admin/member/register")}
            >
              회원 추가
            </button>
          </div>
        </div>

        {/* 테이블 섹션 */}
        <div className="member-table-responsive">
          <table className="member-table">
            <thead>
              <tr>
                <th className="member-th-email">회원 이메일</th>
                <th className="member-th-nickname">닉네임</th>
                <th className="member-th-social">소셜 구분</th>
                <th className="member-th-date">등록일</th>
                <th className="member-th-status">상태</th>
              </tr>
            </thead>
            <tbody>
              {serverData.dtoList.length > 0 ? (
                serverData.dtoList.map((member) => (
                  <tr
                    key={member.email}
                    className="member-tr"
                    onClick={() => navigate(`/admin/member/${member.email}`)}
                  >
                    <td className="member-td-email">{member.email}</td>
                    <td className="member-td-nickname">
                      <span className="nickname-badge">{member.nickname}</span>
                    </td>
                    <td className="member-td-social">
                      {member.email === "admin@honey.com" ? (
                        <span className="social-badge admin">Admin</span>
                      ) : member.social ? (
                        <span className="social-badge kakao">Social</span>
                      ) : (
                        <span className="social-badge general">General</span>
                      )}
                    </td>
                    <td className="member-td-date">
                      {member.regDate ? member.regDate.split("T")[0] : "-"}
                    </td>
                    <td className="member-td-status">
                      <span
                        className={`status-dot ${member.claims.enabled === 0 ? "inactive" : "active"}`}
                      ></span>
                      {member.claims.enabled === 0 ? "비활성" : "활성"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-list">
                    가입된 회원이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 페이징 */}
          <div className="member-pagination-wrapper">
            <PageComponent
              serverData={serverData}
              moveToList={moveToMemberList}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListComponent;
