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
  const { page, size, keyword, searchType, refresh, moveToBoardList } =
    useCustomMove();
  const [serverData, setServerData] = useState(initState);
  const navigate = useNavigate();

  useEffect(() => {
    getList({ page, size, keyword, searchType }).then((data) => {
      setServerData(data);
    });
  }, [page, size, keyword, searchType, refresh]);

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
                        className={`status-dot ${member.enabled === 0 ? "inactive" : "active"}`}
                      ></span>
                      {member.enabled === 0 ? "비활성" : "활성"}
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
            <PageComponent serverData={serverData} movePage={moveToBoardList} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListComponent;
