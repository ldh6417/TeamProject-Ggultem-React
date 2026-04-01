import { useNavigate, useSearchParams } from "react-router";
import { getList, deleteOne, API_SERVER_HOST } from "../../api/ItemBoardApi"; // ItemBoardApi 사용
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PageComponent from "../common/PageComponent";
import axios from "axios";
import { getListByGroup } from "../../api/admin/CodeDetailApi";
import "./MyPageComponent.css";

const host = API_SERVER_HOST;

const MyPageList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [checkedItems, setCheckedItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  const loginState = useSelector((state) => state.loginSlice);
  const email = loginState?.email;

  const page = parseInt(searchParams.get("page")) || 1;
  const size = parseInt(searchParams.get("size")) || 10;
  const searchType = searchParams.get("searchType") || "all";
  const keyword = searchParams.get("keyword") || "";

  const [searchState, setSearchState] = useState({
    type: searchType,
    word: keyword,
  });

  const [serverData, setServerData] = useState({
    dtoList: [],
    totalCount: 0,
    pageNumList: [],
    prev: false,
    next: false,
  });

  // 내 상품 목록 가져오기 (getList 활용)
  const fetchMyItemList = () => {
    if (!email) return;

    getList({ page, size, searchType, keyword, email })
      .then((data) => {
        if (data && data.dtoList) {
          // 1. 삭제되지 않은 상품(enabled !== 0)
          // 2. AND 작성자 이메일이 현재 로그인한 이메일과 일치하는 상품만 필터링
          const myActiveItems = data.dtoList.filter(
            (item) => item.enabled !== 0 && item.email === email,
          );

          setServerData({
            ...data,
            dtoList: myActiveItems,
            // 필터링된 결과에 맞춰 전체 개수도 시각적으로 조정 (옵션)
            totalCount: data.totalCount,
          });
        }
      })
      .catch((err) => console.error("데이터 로드 실패:", err));
  };

  useEffect(() => {
    fetchMyItemList();

    // 카테고리 및 지역 코드 로드 (공통 코드)
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
      .catch((err) => console.error("코드 로드 실패:", err));
  }, [page, size, searchType, keyword, email]);

  const moveToList = (pageParam) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageParam.page);
    navigate(`/mypage/list?${params.toString()}`); // 경로에 맞춰 수정하세요
  };

  const getCodeName = (codeList, codeValue) => {
    if (!codeList || codeList.length === 0) return codeValue;
    const found = codeList.find(
      (c) => String(c.codeValue) === String(codeValue),
    );
    return found ? found.codeName : codeValue;
  };

  const handleAllCheck = (checked) => {
    if (checked) {
      setCheckedItems(serverData.dtoList.map((item) => item.id));
    } else {
      setCheckedItems([]);
    }
  };

  const handleSingleCheck = (checked, id) => {
    if (checked) {
      setCheckedItems([...checkedItems, id]);
    } else {
      setCheckedItems(checkedItems.filter((el) => el !== id));
    }
  };

  // 단일 삭제 (ItemBoard용 deleteOne 호출)
  const handleDelete = async (id) => {
    if (window.confirm("등록한 상품을 삭제하시겠습니까?")) {
      try {
        await deleteOne(id);
        setServerData((prev) => ({
          ...prev,
          dtoList: prev.dtoList.filter((item) => item.id !== id),
          totalCount: prev.totalCount - 1,
        }));
        alert("삭제되었습니다.");
      } catch (error) {
        console.error("삭제 실패:", error);
      }
    }
  };

  // 선택 삭제
  const handleSelectDelete = async () => {
    if (checkedItems.length === 0) return alert("삭제할 상품을 선택해주세요.");
    if (!window.confirm(`${checkedItems.length}개의 상품을 삭제하시겠습니까?`))
      return;

    try {
      await Promise.all(checkedItems.map((id) => deleteOne(id)));
      alert("선택한 상품이 삭제되었습니다.");
      fetchMyItemList(); // 삭제 후 목록 새로고침
      setCheckedItems([]);
    } catch (error) {
      alert("일부 상품 삭제에 실패했습니다.");
    }
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("searchType", searchState.type);
    params.set("keyword", searchState.word.trim());
    navigate(`/mypage/list?${params.toString()}`);
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>내가 등록한 상품 관리</h2>
        <p className="cart-count">
          총 <strong>{serverData.totalCount}</strong>개
        </p>
      </div>

      <div className="cart-search-bar">
        <form onSubmit={handleSearch}>
          <select
            name="type"
            value={searchState.type}
            onChange={(e) =>
              setSearchState({ ...searchState, type: e.target.value })
            }
            className="search-select"
          >
            <option value="all">전체</option>
            <option value="title">상품명</option>
            <option value="location">지역</option>
          </select>
          <input
            type="text"
            name="word"
            value={searchState.word}
            onChange={(e) =>
              setSearchState({ ...searchState, word: e.target.value })
            }
            placeholder="검색어를 입력하세요"
            className="search-input"
          />
          <button type="submit" className="search-btn">
            검색
          </button>
        </form>
      </div>

      <div className="cart-controls">
        <label className="checkbox-label">
          <input
            type="checkbox"
            onChange={(e) => handleAllCheck(e.target.checked)}
            checked={
              checkedItems.length === serverData.dtoList.length &&
              serverData.dtoList.length > 0
            }
          />
          <span>전체 선택</span>
        </label>
        <button className="select-delete-btn" onClick={handleSelectDelete}>
          선택 삭제
        </button>
      </div>

      <div className="cart-list">
        {serverData.dtoList.length > 0 ? (
          serverData.dtoList.map((item) => (
            <div key={item.id} className="cart-item-card">
              <div className="cart-item-left">
                <input
                  type="checkbox"
                  className="item-checkbox"
                  checked={checkedItems.includes(item.id)}
                  onChange={(e) => handleSingleCheck(e.target.checked, item.id)}
                />
                <div
                  className="cart-item-info"
                  onClick={() => navigate(`/itemBoard/read/${item.id}`)}
                >
                  <div className="cart-img-wrapper">
                    <img
                      src={`${host}/itemBoard/view/s_${item.uploadFileNames?.[0] || "default.jpg"}`}
                      alt={item.title}
                    />
                  </div>
                  <div className="cart-text-details">
                    <h4 className="cart-item-title">{item.title}</h4>
                    <p className="cart-item-price">
                      {item.price?.toLocaleString()}원
                    </p>
                    <p className="cart-item-location">
                      {getCodeName(locations, item.location)}
                    </p>
                    {/* 판매 상태 표시 (enabled 값에 따라) */}
                    <span
                      className={`status-badge ${
                        String(item.status) === "true" ||
                        String(item.enabled) === "2"
                          ? "sold"
                          : "sale"
                      }`}
                    >
                      {String(item.status) === "true" ||
                      String(item.enabled) === "2"
                        ? "판매완료"
                        : "판매중"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="cart-item-right">
                <button
                  className="item-modify-btn"
                  onClick={() => navigate(`/itemBoard/modify/${item.id}`)}
                >
                  수정
                </button>
                <button
                  className="item-delete-btn"
                  onClick={() => handleDelete(item.id)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-cart">
            <p>등록한 상품이 없습니다.</p>
            <button onClick={() => navigate("/itemBoard/register")}>
              첫 상품 등록하기
            </button>
          </div>
        )}
        <PageComponent serverData={serverData} moveToList={moveToList} />
      </div>
    </div>
  );
};

export default MyPageList;
