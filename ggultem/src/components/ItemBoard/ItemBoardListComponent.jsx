import { useEffect, useState } from "react";
import { getList, API_SERVER_HOST } from "../../api/ItemBoardApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getListByGroup } from "../../api/admin/CodeDetailApi";
import "./ItemBoardListComponent.css";
import axios from "axios";
import KakaoMap from "./ItemBoardMapComponent";

const host = API_SERVER_HOST;

const ItemBoardList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const status = searchParams.get("status") || "all";
  const category = searchParams.get("category") || "all";
  const searchType = searchParams.get("searchType") || "all";
  const keyword = searchParams.get("keyword") || "";

  const [categories, setCategories] = useState([]);
  const [searchState, setSearchState] = useState({
    type: searchType,
    word: keyword,
  });

  // 카테고리 데이터 로드
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
        });
      })
      .catch((err) => console.error("그룹 로드 실패:", err));
  }, []);

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
    <div className="board-list-full-wrapper">
      <div className="board-header-fixed">
        <h2>🍯 꿀템 매물 목록</h2>
      </div>

      <div className="search-area-center">
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
      </div>

      <div className="map-content-section">
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
