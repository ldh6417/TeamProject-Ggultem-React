import { useNavigate, useSearchParams } from "react-router";
import { getList, deleteOne, API_SERVER_HOST } from "../../api/ItemBoardApi";
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

  const fetchMyItemList = () => {
    if (!email) return;

    getList({ page, size, searchType, keyword, email })
      .then((data) => {
        if (data && data.dtoList) {
          const myActiveItems = data.dtoList.filter(
            (item) => item.enabled !== 0 && item.email === email,
          );

          setServerData({
            ...data,
            dtoList: myActiveItems,
            totalCount: data.totalCount,
          });
        }
      })
      .catch((err) => console.error("데이터 로드 실패:", err));
  };

  useEffect(() => {
    fetchMyItemList();

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
    navigate(`/mypage/list?${params.toString()}`);
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

  const handleSelectDelete = async () => {
    if (checkedItems.length === 0) return alert("삭제할 상품을 선택해주세요.");
    if (!window.confirm(`${checkedItems.length}개의 상품을 삭제하시겠습니까?`))
      return;

    try {
      await Promise.all(checkedItems.map((id) => deleteOne(id)));
      alert("선택한 상품이 삭제되었습니다.");
      fetchMyItemList();
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
          serverData.dtoList.map((item) => {
            // ✅ 판매 완료 상태 체크 로직 통일
            const isSoldOut =
              String(item.status) === "true" || String(item.enabled) === "2";

            return (
              <div key={item.id} className="cart-item-card">
                <div className="cart-item-left">
                  <input
                    type="checkbox"
                    className="item-checkbox"
                    checked={checkedItems.includes(item.id)}
                    onChange={(e) =>
                      handleSingleCheck(e.target.checked, item.id)
                    }
                  />
                  <div className="cart-item-info">
                    {/* ✅ SOLD OUT 오버레이 적용 부분 */}
                    <div
                      className="cart-img-wrapper"
                      onClick={() => navigate(`/itemBoard/read/${item.id}`)}
                    >
                      {isSoldOut && (
                        <div className="mp-sold-out-overlay">SOLD OUT</div>
                      )}
                      <img
                        className={isSoldOut ? "mp-img-darken" : ""}
                        src={`${host}/itemBoard/view/s_${item.uploadFileNames?.[0] || "default.jpg"}`}
                        alt={item.title}
                      />
                    </div>
                    <div
                      className="cart-text-details"
                      onClick={() => navigate(`/itemBoard/read/${item.id}`)}
                    >
                      <h4 className="cart-item-title">{item.title}</h4>
                      <p className="cart-item-price">
                        {item.price?.toLocaleString()}원
                      </p>
                      <p className="cart-item-location">
                        {getCodeName(locations, item.location)}
                      </p>
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
            );
          })
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
