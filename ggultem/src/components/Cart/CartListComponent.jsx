import { useNavigate, useSearchParams } from "react-router";
import { getList, deleteOne, API_SERVER_HOST } from "../../api/CartApi";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PageComponent from "../common/PageComponent";
import axios from "axios"; // axios 추가
import { getListByGroup } from "../../api/admin/CodeDetailApi"; // 경로 확인 필요
import "./CartListComponent.css";

const host = API_SERVER_HOST;

const CartList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [checkedItems, setCheckedItems] = useState([]);
  const [categories, setCategories] = useState([]); // 카테고리 상태 추가
  const [locations, setLocations] = useState([]); // 지역 상태 추가
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

  const fetchCartList = () => {
    if (!email) return;
    getList({ page, size, searchType, keyword, email })
      .then((data) => {
        if (data && data.dtoList) {
          // enabled가 0인 데이터(정상)만 필터링 (사용자님 로직 유지)
          const activeItems = data.dtoList.filter((item) => item.enabled === 1);
          setServerData({
            ...data,
            dtoList: activeItems,
            totalCount: data.totalCount,
          });
        }
      })
      .catch((err) => console.error("데이터 로드 실패:", err));
  };

  // ✅ 통합 useEffect: 목록 로드 및 공통 코드 로드
  useEffect(() => {
    fetchCartList();

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
    navigate(`/cart/list?${params.toString()}`);
  };

  // ✅ 코드값 -> 명칭 변환 함수 (문자열 비교 안전하게 처리)
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

  const handleDelete = (id) => {
    if (!window.confirm("관심 상품에서 삭제하시겠습니까?")) return;
    deleteOne(id)
      .then(() => {
        alert("삭제되었습니다.");
        navigate("/mypage", { state: { refresh: true } });
      })
      .catch(() => alert("삭제 중 오류가 발생했습니다."));
  };

  const handleSelectDelete = async () => {
    if (checkedItems.length === 0) return alert("삭제할 상품을 선택해주세요.");
    if (!window.confirm(`${checkedItems.length}개의 상품을 삭제하시겠습니까?`))
      return;

    try {
      const deletePromises = checkedItems.map((id) => deleteOne(id));
      await Promise.all(deletePromises);
      alert("선택한 상품이 모두 삭제되었습니다.");
      setCheckedItems([]);
      navigate("/mypage", { state: { refresh: true } });
    } catch (error) {
      alert("일부 상품 삭제에 실패했습니다.");
    }
  };

  const handleChangeSearch = (e) => {
    setSearchState({ ...searchState, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("searchType", searchState.type);
    params.set("keyword", searchState.word.trim());
    navigate(`/cart/list?${params.toString()}`);
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>관심 상품 목록</h2>
        <p className="cart-count">
          총 <strong>{serverData.totalCount}</strong>개
        </p>
      </div>

      <div className="cart-search-bar">
        <form onSubmit={handleSearch}>
          <select
            name="type"
            value={searchState.type}
            onChange={handleChangeSearch}
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
            onChange={handleChangeSearch}
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
                  onClick={() => navigate(`/itemBoard/read/${item.itemId}`)}
                >
                  <div className="cart-img-wrapper">
                    <img
                      src={`${host}/itemBoard/view/s_${item.itemBoard?.itemList?.[0]?.fileName || "default.jpg"}`}
                      alt={item.itemBoard?.title}
                    />
                  </div>
                  <div className="cart-text-details">
                    <h4 className="cart-item-title">{item.itemBoard?.title}</h4>
                    <p className="cart-item-price">
                      {item.itemBoard?.price?.toLocaleString()}원
                    </p>
                    <p className="cart-item-location">
                      {/* item.location 또는 item.itemBoard.location 중 실제 데이터가 들어오는 곳을 확인하세요 */}
                      {getCodeName(
                        locations,
                        item.itemBoard?.location || item.location,
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="cart-item-right">
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
            <p>장바구니가 비어 있습니다.</p>
            <button onClick={() => navigate("/itemBoard/list")}>
              상품 보러가기
            </button>
          </div>
        )}
        <PageComponent serverData={serverData} moveToList={moveToList} />
      </div>
    </div>
  );
};

export default CartList;
