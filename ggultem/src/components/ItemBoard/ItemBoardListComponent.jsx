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

    const type = document.getElementById("itemSearchType").value;
    const inputElement = document.getElementById("itemSearchKeyword");
    const word = inputElement.value.trim();

    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("searchType", type);
    params.set("keyword", word);

    // 검색 실행 후 URL 이동
    navigate(`/itemBoard/list?${params.toString()}`);

    // ★ 입력창 초기화
    inputElement.value = "";
  };

  return (
    <div className="itemboard-list-full-wrapper">
      <div className="itemboard-header-fixed">
        <h2>우리동네 꿀템목록</h2>
      </div>

      <div className="itemboard-search-area-center">
        <form className="itemboard-search-form-wide" onSubmit={handleSearch}>
          <select
            id="itemSearchType"
            className="search-type-select"
            defaultValue={searchType} // searchState 대신 defaultValue 사용
          >
            <option value="all">전체조건</option>
            <option value="title">상품명</option>
            <option value="content">내용</option>
          </select>
          <input
            type="text"
            id="itemSearchKeyword"
            className="search-input-wide"
            placeholder="어떤 꿀템을 찾으시나요?"
            defaultValue={""} // 초기값 비움
          />
          <button type="submit" className="itemboard-search-btn-wide">
            검색
          </button>
        </form>
      </div>

      <div className="itemboard-map-content-section">
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
//테스팅 주석
