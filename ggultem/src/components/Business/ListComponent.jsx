import { useEffect, useState } from "react";
import { getList, API_SERVER_HOST, getMyPage } from "../../api/BusinessApi";
import useCustomMove from "../../hooks/useCustomMove";
import PageComponent from "../common/PageComponent";
import { useNavigate } from "react-router-dom";
import "./ListComponent.css";
import { useSelector } from "react-redux";

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

const ListComponent = () => {
  const loginState = useSelector((state) => state.loginSlice);
  const {
    page,
    size,
    keyword,
    searchType,
    refresh,
    moveToBusinessBoardRead,
    moveToBusinessBoardList,
  } = useCustomMove();
  const [serverData, setServerData] = useState(initState);
  const [member, setMember] = useState(initStateMember);
  const navigate = useNavigate();

  //내가 등록한 businessBoard 리스트
  useEffect(() => {
    getList({ page, size, keyword, searchType }).then((data) => {
      console.log(data);
      setServerData(data);
    });
  }, [page, size, keyword, searchType, refresh]);

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

      {/* 📦 하단 상품 게시판 리스트 */}
      <section className="biz-item-list-section">
        <div className="list-header">
          <h3>내가 등록한 상품 ({serverData.totalCount})</h3>
          <button
            className="add-btn"
            onClick={() => navigate("/business/board/register")}
          >
            + 새 상품 등록
          </button>
        </div>

        <table className="biz-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>이미지</th>
              <th>상품명</th>
              <th>가격</th>
              <th>조회수</th>
              <th>등록일</th>
              <th>종료일</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {serverData.dtoList.length > 0 ? (
              serverData.dtoList.map((item) => (
                <tr
                  key={item.no}
                  onClick={() => moveToBusinessBoardRead(item.no)}
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
          moveToList={moveToBusinessBoardList}
        />
      </section>
    </div>
  );
};

export default ListComponent;
