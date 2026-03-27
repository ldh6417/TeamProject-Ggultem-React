import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { getList } from "../../../api/admin/ItemBoardApi";
import PageComponent from "../../common/PageComponent";
import axios from "axios";
import { getListByGroup } from "../../../api/admin/CodeDetailApi";
import "./AdminListComponent.css";
import { API_SERVER_HOST } from "../../../api/ItemBoardApi";

const host = API_SERVER_HOST;

const AdminListComponent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [serverData, setServerData] = useState({
    dtoList: [],
    totalCount: 0,
    pageNumList: [],
    prev: false,
    next: false,
  });

  // URL에서 검색 타입과 키워드 가져오기
  const searchType = searchParams.get("searchType") || "all";
  const keyword = searchParams.get("keyword") || "";
  const page = parseInt(searchParams.get("page")) || 1;
  const size = parseInt(searchParams.get("size")) || 10;
  const enabled = searchParams.get("enabled") || "all";

  //검색후 초기화
  const handleSearch = () => {
    const type = document.getElementById("searchType").value;
    const inputElement = document.getElementById("searchKeyword");
    const word = inputElement.value.trim(); // 공백 제거

    navigate(
      `/admin/itemBoard/list?page=1&searchType=${type}&keyword=${encodeURIComponent(word)}`,
    );

    // 입력창 비우기
    inputElement.value = "";
  };

  // 코드값을 넣으면 한글명을 찾아주는 마법의 함수
  const getCodeName = (codeList, codeValue) => {
    if (!codeList || codeList.length === 0) return codeValue;
    const found = codeList.find(
      (c) => String(c.codeValue) === String(codeValue),
    );
    return found ? found.codeName : codeValue;
  };

  const moveToList = (pageParam) => {
    const params = new URLSearchParams();
    params.set("page", pageParam.page);
    params.set("searchType", searchType);
    params.set("keyword", keyword);

    if (enabled !== "all") {
      params.set("enabled", enabled);
    }

    navigate(`/admin/itemBoard/list?${params.toString()}`);
  };

  useEffect(() => {
    const params = {
      page,
      size,
      searchType: searchType || "all", // 타입이 없으면 'all'
    };

    if (keyword && keyword.trim() !== "") {
      params.keyword = keyword;
    }

    // 판매 상태 필터링 처리
    if (enabled !== "all" && enabled !== null && enabled !== undefined) {
      params.enabled = Number(enabled);
    }

    getList(params).then((data) => setServerData(data));

    const pageParam = { page: 1, size: 100 };

    // 공통 코드 그룹 전체 조회
    axios
      .get(`${host}/api/codegroup/list`, { params: pageParam })
      .then((res) => {
        const allGroups = res.data.dtoList || [];
        allGroups.forEach((group) => {
          const gCode = group.groupCode.toUpperCase();

          // 카테고리 데이터 가져오기
          if (gCode.includes("ITEM_CATEGORY") || gCode.includes("ITEM_CAT")) {
            getListByGroup(pageParam, group.groupCode).then((data) =>
              setCategories(data.dtoList),
            );
          }
          // 지역 데이터 가져오기
          if (gCode.includes("ITEM_LOCATION") || gCode.includes("ITEM_LOC")) {
            getListByGroup(pageParam, group.groupCode).then((data) =>
              setLocations(data.dtoList),
            );
          }
        });
      });
  }, [page, size, enabled, searchType, keyword]);

  return (
    <div className="admin-main-wrapper">
      <div className="admin-content-box">
        <div className="admin-header">
          <h3 className="admin-title">
            상품 관리 <span className="yellow-point">마스터</span>
          </h3>

          {/* 검색 영역 추가 */}
          <div className="admin-search-bar">
            <select id="searchType" defaultValue={searchType}>
              <option value="all">전체</option>
              <option value="title">상품명</option>
              <option value="writer">판매자</option>
            </select>
            <input
              type="text"
              id="searchKeyword"
              placeholder="검색어를 입력하세요"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <button
              className="search-btn"
              onClick={() => {
                handleSearch();
              }}
            >
              검색
            </button>
          </div>

          <select
            id="searchEnabled"
            className="admin-status-select"
            value={enabled}
            onChange={(e) => {
              const enabled = e.target.value;
              // 상태 변경 시 바로 해당 조건으로 이동
              navigate(`/admin/itemBoard/list?page=1&enabled=${enabled}`);
            }}
          >
            <option value="all">판매상태(전체)</option>
            <option value="1">판매중</option>
            <option value="2">판매완료</option>
            <option value="0">삭제</option>
          </select>
          <button
            className="yellow-btn"
            onClick={() => navigate("/admin/itemBoard/register")}
          >
            신규 상품 등록
          </button>
          <button
            className="yellow-btn"
            onClick={() => navigate("/admin/itemBoard/reply")}
          >
            댓글 관리
          </button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>카테고리</th>
              <th>상품명</th>
              <th>판매자</th>
              <th>가격</th>
              <th>등록일</th>
              <th>상품상태</th>
            </tr>
          </thead>
          <tbody>
            {serverData.dtoList.map((item) => (
              <tr
                key={item.id}
                onClick={() => navigate(`/admin/itemBoard/read/${item.id}`)}
              >
                <td>{item.id}</td>
                <td>
                  <span className="cat-badge">
                    {getCodeName(categories, item.category)}
                  </span>
                </td>
                <td className="text-left">
                  <strong>{item.title}</strong>
                </td>
                <td>{item.nickname || item.writer}</td>
                <td className="price-bold">{item.price?.toLocaleString()}원</td>
                <td>{new Date(item.regDate).toLocaleDateString()}</td>
                {/* AdminListComponent.js 의 해당 부분 수정 */}
                <td>
                  <div className="status-container">
                    {/* 1. 삭제 상태 확인 (enabled가 0이면 무조건 삭제) */}
                    {item.enabled === 0 ? (
                      <span className="status-badge deleted">
                        <span className="dot"></span> 삭제됨
                      </span>
                    ) : (
                      <>
                        {/* 2. 판매 완료 확인 (enabled가 2이거나, status가 "판매완료" 또는 "true"인 경우) */}
                        {item.enabled === 2 ||
                        item.status === "판매완료" ||
                        item.status === "true" ? (
                          <span className="status-badge sold-out">
                            <span className="dot"></span> 판매완료
                          </span>
                        ) : (
                          /* 3. 그 외에는 판매중 */
                          <span className="status-badge active">
                            <span className="dot"></span> 판매중
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="admin-paging">
          <PageComponent serverData={serverData} moveToList={moveToList} />
        </div>
      </div>
    </div>
  );
};

export default AdminListComponent;
