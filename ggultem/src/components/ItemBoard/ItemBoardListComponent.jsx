import { useEffect, useState } from "react";
import { getList, API_SERVER_HOST } from "../../api/ItemBoardApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageComponent from "../common/PageComponent";
import "./ItemBoardListComponent.css";

const host = API_SERVER_HOST;

const ItemBoardList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page")) || 1;
  const size = parseInt(searchParams.get("size")) || 10;

  // ✅ 필터
  const status = searchParams.get("status") || "all";
  const category = searchParams.get("category") || "all";
  const location = searchParams.get("location") || "all";

  // ✅ 검색
  const searchType = searchParams.get("searchType") || "all";
  const keyword = searchParams.get("keyword") || "";

  const moveToList = (pageParam) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageParam.page);
    params.set("searchType", searchType);
    params.set("keyword", keyword);

    navigate(`/itemBoard/list?${params.toString()}`);
  };

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

  // ✅ 데이터 호출 (검색 + 필터 같이 전달)
  useEffect(() => {
    getList({
      page,
      size,
      searchType,
      keyword,
      status,
      category,
      location,
    })
      .then((data) => {
        if (data) setServerData(data);
      })
      .catch((err) => console.error("데이터 로드 실패:", err));
  }, [page, size, searchType, keyword, status, category, location]);

  // ✅ 필터 변경
  const handleFilterChange = (type, value) => {
    const params = new URLSearchParams(searchParams);

    params.set("page", "1");

    if (value === "all") {
      params.delete(type);
    } else {
      params.set(type, value);
    }

    navigate(`/itemBoard/list?${params.toString()}`);
  };

  // ✅ 검색 input 변경
  const handleChangeSearch = (e) => {
    setSearchState({
      ...searchState,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ 검색 실행
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
        {/* ✅ 검색 */}
        <form className="search-form-wide" onSubmit={handleSearch}>
          <select
            name="type"
            className="search-type-select"
            value={searchState.type}
            onChange={handleChangeSearch}
          >
            <option value="all">전체조건</option>
            <option value="title">상품명</option>
            <option value="content">내용</option>
          </select>

          <input
            type="text"
            name="word"
            className="search-input-wide"
            placeholder="어떤 꿀템을 찾으시나요?"
            value={searchState.word}
            onChange={handleChangeSearch}
          />

          <button type="submit" className="search-btn-wide">
            검색
          </button>
        </form>

        {/* ✅ 필터 */}
        <div className="filter-bar">
          {/* 🔥 상태 (수정됨) */}
          <select
            className="filter-select"
            value={status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="all">전체 상태</option>
            <option value="false">판매중</option>
            <option value="true">판매완료</option>
          </select>

          {/* 카테고리 */}
          <select
            className="filter-select"
            value={category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
          >
            <option value="all">모든 카테고리</option>
            <option value="electronics">전자제품</option>
            <option value="clothing">의류</option>
            <option value="sports">스포츠</option>
            <option value="books">도서</option>
            <option value="furniture">가구</option>
          </select>

          {/* 지역 */}
          <select
            className="filter-select"
            value={location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
          >
            <option value="all">전체 지역</option>
            <option value="서울">서울</option>
            <option value="경기">경기</option>
            <option value="부산">부산</option>
          </select>

          <button
            className="filter-reset-btn"
            onClick={() => navigate("/itemBoard/list")}
          >
            필터 초기화
          </button>
        </div>
      </div>

      {/* ✅ 리스트 */}
      <div className="item-grid">
        {serverData.dtoList?.length > 0 ? (
          serverData.dtoList.map((item) => (
            <div
              key={item.id}
              className="item-card"
              onClick={() =>
                navigate(
                  `/itemBoard/read/${item.id}?${searchParams.toString()}`,
                )
              }
            >
              <div className="item-image">
                {/* 🔥 상태 표시 수정 */}
                {item.status === "true" && (
                  <div className="sold-out-overlay">
                    <span>SOLD OUT</span>
                  </div>
                )}

                <img
                  src={
                    item.uploadFileNames?.length > 0
                      ? `${host}/itemBoard/view/s_${item.uploadFileNames[0]}`
                      : `${host}/itemBoard/view/default.jpg`
                  }
                  alt={item.title}
                  className={item.status === "true" ? "img-dark" : ""}
                />
              </div>

              <div className="item-info">
                <div className="item-category">{item.category}</div>
                <div className="item-title">{item.title}</div>
                <div className="item-price">
                  {item.price?.toLocaleString()}원
                </div>
                <div className="item-footer">
                  <span>{item.location}</span>
                  <span>{item.regDate?.split("T")[0]}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">조건에 맞는 상품이 없습니다.</div>
        )}
      </div>
      <PageComponent serverData={serverData} moveToList={moveToList} />
    </div>
  );
};

export default ItemBoardList;
