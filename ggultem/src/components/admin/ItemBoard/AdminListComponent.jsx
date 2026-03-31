import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { getList } from "../../../api/admin/ItemBoardApi";
import PageComponent from "../../common/PageComponent";
import axios from "axios";
import { getListByGroup } from "../../../api/admin/CodeDetailApi";
import { API_SERVER_HOST } from "../../../api/ItemBoardApi";
import "./AdminListComponent.css";

const host = API_SERVER_HOST;

const AdminListComponent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [serverData, setServerData] = useState({
    dtoList: [],
    totalCount: 0,
    pageNumList: [],
    prev: false,
    next: false,
  });

  const searchType = searchParams.get("searchType") || "all";
  const keyword = searchParams.get("keyword") || "";
  const page = parseInt(searchParams.get("page")) || 1;
  const size = parseInt(searchParams.get("size")) || 10;
  const enabled = searchParams.get("enabled") || "all";

  const handleSearch = () => {
    const type = document.getElementById("itemSearchType").value;
    const inputElement = document.getElementById("itemSearchKeyword");
    const word = inputElement.value.trim();
    navigate(
      `/admin/itemBoard/list?page=1&searchType=${type}&keyword=${encodeURIComponent(word)}`,
    );
    inputElement.value = "";
  };

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
    if (enabled !== "all") params.set("enabled", enabled);
    navigate(`/admin/itemBoard/list?${params.toString()}`);
  };

  useEffect(() => {
    const params = { page, size, searchType: searchType || "all" };
    if (keyword && keyword.trim() !== "") params.keyword = keyword;
    if (enabled !== "all" && enabled !== null) params.enabled = Number(enabled);

    getList(params).then((data) => setServerData(data));

    const pageParam = { page: 1, size: 100 };
    axios
      .get(`${host}/api/codegroup/list`, { params: pageParam })
      .then((res) => {
        const allGroups = res.data.dtoList || [];
        allGroups.forEach((group) => {
          const gCode = group.groupCode.toUpperCase();
          if (gCode.includes("ITEM_CATEGORY")) {
            getListByGroup(pageParam, group.groupCode).then((data) =>
              setCategories(data.dtoList),
            );
          }
        });
      });
  }, [page, size, enabled, searchType, keyword]);

  return (
    <div className="item-main-wrapper">
      <div className="item-content-box">
        <div className="item-header">
          <h3 className="item-title">
            상품 관리 <span className="yellow-point">마스터</span>
          </h3>

          <div className="item-search-bar">
            <select id="itemSearchType" defaultValue={searchType}>
              <option value="all">전체</option>
              <option value="title">상품명</option>
              <option value="writer">판매자</option>
            </select>
            <input
              type="text"
              id="itemSearchKeyword"
              placeholder="검색어를 입력하세요"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="item-search-btn" onClick={handleSearch}>
              검색
            </button>
          </div>

          <div className="item-header-right">
            <select
              className="item-status-select"
              value={enabled}
              onChange={(e) =>
                navigate(
                  `/admin/itemBoard/list?page=1&enabled=${e.target.value}`,
                )
              }
            >
              <option value="all">판매상태(전체)</option>
              <option value="1">판매중</option>
              <option value="2">판매완료</option>
              <option value="0">삭제</option>
            </select>
            <button
              className="item-yellow-btn"
              onClick={() => navigate("/admin/itemBoard/register")}
            >
              신규 상품 등록
            </button>
            <button
              className="item-yellow-btn"
              onClick={() => navigate("/admin/itemBoard/reply")}
            >
              댓글 관리
            </button>
          </div>
        </div>

        <table className="item-table">
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
                  <span className="item-cat-badge">
                    {getCodeName(categories, item.category)}
                  </span>
                </td>
                <td className="item-text-left">
                  <strong>{item.title}</strong>
                </td>
                <td>{item.nickname || item.writer}</td>
                <td className="item-price-bold">
                  {item.price?.toLocaleString()}원
                </td>
                <td>{new Date(item.regDate).toLocaleDateString()}</td>
                <td>
                  <div className="item-status-container">
                    {item.enabled === 0 ? (
                      <span className="item-status-badge deleted">
                        <span className="item-dot"></span> 삭제됨
                      </span>
                    ) : (
                      <span
                        className={`item-status-badge ${item.enabled === 2 ? "sold-out" : "active"}`}
                      >
                        <span className="item-dot"></span>{" "}
                        {item.enabled === 2 ? "판매완료" : "판매중"}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="item-paging">
          <PageComponent serverData={serverData} moveToList={moveToList} />
        </div>
      </div>
    </div>
  );
};

export default AdminListComponent;
