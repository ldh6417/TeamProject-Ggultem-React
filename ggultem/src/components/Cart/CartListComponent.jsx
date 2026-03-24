import { useNavigate, useSearchParams } from "react-router";
import { getList, deleteOne, API_SERVER_HOST } from "../../api/CartApi";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./CartListComponent.css"; // CSS 파일 임포트

const host = API_SERVER_HOST;

const CartList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [checkedItems, setCheckedItems] = useState([]);
  const loginState = useSelector((state) => state.loginSlice);
  const email = loginState?.email;

  const page = parseInt(searchParams.get("page")) || 1;
  const size = parseInt(searchParams.get("size")) || 10;
  const searchType = searchParams.get("searchType") || "all";
  const keyword = searchParams.get("keyword") || "";

  const [serverData, setServerData] = useState({
    dtoList: [],
    totalCount: 0,
  });

  const fetchCartList = () => {
    if (!email) return;
    getList({ page, size, searchType, keyword, email })
      .then((data) => {
        console.log("서버 원본 데이터:", data);

        if (data && data.dtoList) {
          // 1. enabled가 1(정상)인 항목만 추출 (0인 삭제 데이터 제외)
          const activeItems = data.dtoList.filter((item) => item.enabled === 0);

          // 2. 필터링된 리스트로 상태 업데이트
          setServerData({
            ...data,
            dtoList: activeItems,
            // 전체 개수 표시도 필터링된 개수에 맞춰서 조정 (선택사항)
            totalCount: activeItems.length,
          });
        }
      })
      .catch((err) => console.error("데이터 로드 실패:", err));
  };

  useEffect(() => {
    fetchCartList();
  }, [page, size, searchType, keyword, email]);

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
        fetchCartList();
      })
      .catch(() => alert("삭제 중 오류가 발생했습니다."));
  };

  const handleSelectDelete = async () => {
    if (checkedItems.length === 0) return alert("삭제할 상품을 선택해주세요.");

    if (!window.confirm(`${checkedItems.length}개의 상품을 삭제하시겠습니까?`))
      return;

    try {
      // 선택된 모든 ID에 대해 deleteOne 호출
      const deletePromises = checkedItems.map((id) => deleteOne(id));

      await Promise.all(deletePromises);

      alert("선택한 상품이 모두 삭제되었습니다.");
      setCheckedItems([]); // 체크박스 초기화
      fetchCartList(); // 목록 새로고침
    } catch (error) {
      console.error("선택 삭제 실패:", error);
      alert("일부 상품 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>관심 상품 목록</h2>
        <p className="cart-count">
          총 <strong>{serverData.totalCount}</strong>개
        </p>
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
                      {item.itemBoard?.location}
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
      </div>
    </div>
  );
};

export default CartList;
