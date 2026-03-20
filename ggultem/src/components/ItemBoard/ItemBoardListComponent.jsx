import { useEffect, useState } from "react";
import { getList, API_SERVER_HOST } from "../../api/BoardApi";
import useCustomMove from "../../hooks/useCustomMove";
import { useNavigate } from "react-router";
import "./ItemBoardListComponent.css";
import ItemBoardRegister from "./ItemBoardRegisterComponent";

const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0,
};

const host = API_SERVER_HOST;

const ItemBoardList = () => {
  const { page, size, keyword, searchType, refresh, moveToRead } =
    useCustomMove();
  const [serverData, setServerData] = useState(initState);
  const navigate = useNavigate();

  useEffect(() => {
    getList({ page, size, keyword, searchType }).then((data) => {
      console.log(data);
      setServerData(data);
    });
  }, [page, size, keyword, searchType, refresh]);

  return (
    <div className="board-list-container">
      <div className="board-header">
        <h2>꿀템 매물 목록</h2>
        <button
          className="write-btn"
          onClick={() => navigate("/itemBoard/Register")}
        >
          상품 등록
        </button>
      </div>

      <div className="item-grid">
        {serverData.dtoList.map((item) => (
          <div
            key={item.id}
            className="item-card"
            onClick={() => moveToRead(item.id)} // 상세 페이지 이동
          >
            <div className="item-image">
              {/* 이미지가 있으면 첫 번째 이미지, 없으면 기본 이미지 표시 */}
              <img
                src={
                  item.uploadFileNames && item.uploadFileNames.length > 0
                    ? `${host}/api/itemBoard/view/s_${item.uploadFileNames[0]}`
                    : `${host}/api/itemBoard/view/default.jpg`
                }
                alt={item.title}
              />
            </div>
            <div className="item-info">
              <div className="item-category">{item.category}</div>
              <div className="item-title">{item.title}</div>
              <div className="item-price">{item.price.toLocaleString()}원</div>
              <div className="item-footer">
                <span>{item.location}</span>
                <span>{item.regDate ? item.regDate.split("T")[0] : ""}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 컴포넌트 */}
    </div>
  );
};

export default ItemBoardList;
