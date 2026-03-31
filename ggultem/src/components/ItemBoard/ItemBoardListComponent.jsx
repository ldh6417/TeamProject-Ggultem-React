import { useEffect, useState } from "react";
import { getList, API_SERVER_HOST } from "../../api/ItemBoardApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageComponent from "../common/PageComponent";
import { getListByGroup } from "../../api/admin/CodeDetailApi";
import "./ItemBoardListComponent.css";
import axios from "axios";
import KakaoMap from "./ItemBoardMapComponent";

const host = API_SERVER_HOST;

const ItemBoardList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page")) || 1;
  const size = parseInt(searchParams.get("size")) || 10;
  const status = searchParams.get("status") || "all";
  const category = searchParams.get("category") || "all";
  const location = searchParams.get("location") || "all";
  const searchType = searchParams.get("searchType") || "all";
  const keyword = searchParams.get("keyword") || "";

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [serverData, setServerData] = useState({
    dtoList: [],
    totalCount: 0,
    pageNumList: [],
    prev: false,
    next: false,
  });

  const [searchState, setSearchState] = useState({
    type: searchType,
    word: keyword,
  });

  useEffect(() => {
    const pageParam = { page: 1, size: 100 };
    axios
      .get(`${host}/api/codegroup/list`, { params: pageParam })
      .then((res) => {
        const allGroups = res.data.dtoList || [];
        allGroups.forEach((group) => {
          const gCode = group.groupCode.toUpperCase();
          if (gCode.includes("ITEM_CATEGORY") || gCode.includes("ITEM_CAT")) {
            getListByGroup(pageParam, group.groupCode).then((data) => {
              if (data?.dtoList) setCategories(data.dtoList);
            });
          }
          if (gCode.includes("ITEM_LOCATION") || gCode.includes("ITEM_LOC")) {
            getListByGroup(pageParam, group.groupCode).then((data) => {
              if (data?.dtoList) setLocations(data.dtoList);
            });
          }
        });
      })
      .catch((err) => console.error("그룹 로드 실패:", err));
  }, []);

  useEffect(() => {
    getList({ page, size, searchType, keyword, status, category, location })
      .then((data) => {
        if (data) setServerData(data);
      })
      .catch((err) => console.error("게시글 로드 실패:", err));
  }, [page, size, searchType, keyword, status, category, location]);

  const getCodeName = (codeList, codeValue) => {
    const found = codeList.find((item) => item.codeValue === codeValue);
    return found ? found.codeName : codeValue;
  };

  const handleFilterChange = (type, value) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (value === "all") params.delete(type);
    else params.set(type, value);
    navigate(`/itemBoard/list?${params.toString()}`);
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("searchType", searchState.type);
    params.set("keyword", searchState.word.trim());
    navigate(`/itemBoard/list?${params.toString()}`);
  };

  return (
    <div className="board-list-container">
      <div className="board-header">
        <h2>🍯 꿀템 매물 목록</h2>
        <button
          className="write-btn"
          onClick={() => navigate("/itemBoard/Register")}
        >
          상품 등록
        </button>
      </div>

      <div className="hero-section">
        <form className="search-form-wide" onSubmit={handleSearch}>
          <select
            name="type"
            className="search-type-select"
            value={searchState.type}
            onChange={(e) =>
              setSearchState({ ...searchState, type: e.target.value })
            }
          >
            <option value="all">전체조건</option>
            <option value="title">상품명</option>
            <option value="content">내용</option>
          </select>
          <input
            type="text"
            className="search-input-wide"
            value={searchState.word}
            onChange={(e) =>
              setSearchState({ ...searchState, word: e.target.value })
            }
            placeholder="어떤 꿀템을 찾으시나요?"
          />
          <button type="submit" className="search-btn-wide">
            검색
          </button>
        </form>
        <KakaoMap
          currentFilters={{
            category,
            status,
            searchType,
            keyword,
          }}
          status={status}
          category={category}
          categories={categories}
          handleFilterChange={handleFilterChange}
        />
      </div>
    </div>
  );
};

export default ItemBoardList;
