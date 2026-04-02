import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getOne, deleteOne, API_SERVER_HOST } from "../../api/ItemBoardApi";
import { getListByGroup } from "../../api/admin/CodeDetailApi";
import useCustomLogin from "../../hooks/useCustomLogin";
import ItemBoardReplyComponent from "./ItemBoardReplyComponent";
import "./ItemBoardReadComponent.css";
import { postAdd } from "../../api/CartApi";
import { postChatAdd } from "../../api/ChatApi";
import axios from "axios";

const host = API_SERVER_HOST;

const ItemBoardReadComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loginState } = useCustomLogin();
  const [item, setItem] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  // 2. 데이터 및 공통 코드 로드
  useEffect(() => {
    if (id) {
      getOne(id)
        .then((data) => {
          setItem(data);
          setFetching(false);
        })
        .catch((err) => {
          setFetching(false);
          navigate("/itemBoard/list");
        });

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
        });
    }
  }, [id, navigate]);

  const getCodeName = (codeList, codeValue) => {
    const found = codeList.find((c) => c.codeValue === codeValue);
    return found ? found.codeName : codeValue;
  };

  const handleCopyClipBoard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("URL이 복사되었습니다!");
      setShowShareOptions(false);
    } catch (err) {
      alert("URL 복사에 실패했습니다.");
    }
  };

  const handleClickDelete = () => {
    if (window.confirm("정말로 이 상품을 삭제하시겠습니까?")) {
      setFetching(true);
      deleteOne(id).then(() => {
        setFetching(false);
        alert("삭제되었습니다.");
        navigate("/itemBoard/list");
      });
    }
  };

  const handleClickAddCart = () => {
    const cartObj = { itemId: Number(id), email: loginState.email };
    postAdd(cartObj).then(() => {
      alert("장바구니 담기 성공!");
      navigate("/cart/list");
    });
  };

  const handleClickAddChat = () => {
    const roomName = `${item.writer} 님의 [${item.title}]`;
    const chatObj = {
      itemId: Number(id),
      buyerId: loginState.email,
      sellerId: item.email,
      roomName: roomName,
    };
    postChatAdd(chatObj).then((data) => {
      alert("새로운 채팅방이 개설되었습니다.");
      navigate(`/chat/${data.roomId}`);
    });
  };

  if (fetching && !item)
    return <div className="loading">데이터를 불러오는 중...</div>;
  if (!item) return null;

  const isSoldOut = item.status === "판매완료" || item.status === "true";

  return (
    <div className="read-container">
      <div className="read-header">
        <button
          className="back-btn"
          onClick={() => navigate("/itemBoard/list")}
        >
          ← 목록으로
        </button>
        <h2>상품 상세 정보</h2>
      </div>

      <div className="read-content">
        <div className="image-section">
          {item.uploadFileNames && item.uploadFileNames.length > 0 ? (
            item.uploadFileNames.map((fileName, idx) => (
              <img
                key={idx}
                src={`${host}/itemBoard/view/${fileName}`}
                alt="product"
                className="detail-img"
              />
            ))
          ) : (
            <img
              src={`${host}/itemBoard/view/default.jpg`}
              alt="default"
              className="detail-img"
            />
          )}
        </div>

        <div className="info-section">
          {/* ✅ 카테고리와 공유버튼을 한 줄에 배치 */}
          <div className="info-top-line">
            <span className="info-category">
              [{getCodeName(categories, item.category)}]
            </span>

            <div className="share-wrapper">
              <button
                className="main-share-btn"
                onClick={() => setShowShareOptions(!showShareOptions)}
              >
                <span className="share-icon">공유하기</span>
              </button>
              {showShareOptions && (
                <div className="share-dropdown">
                  <button
                    onClick={handleCopyClipBoard}
                    className="dropdown-item"
                  >
                    🔗 URL 복사
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="info-main">
            <span
              className={`status-badge ${isSoldOut ? "sold-out" : "on-sale"}`}
            >
              {isSoldOut ? "판매 완료" : "판매 중"}
            </span>
            <h1 className="info-title">{item.title}</h1>
            <h2 className="info-price">{item.price?.toLocaleString()}원</h2>
          </div>

          <div className="info-details">
            <div className="detail-row">
              <span className="label">판매자</span>
              <span className="value">
                {item.writer} ({item.email})
              </span>
            </div>
            <div className="detail-row">
              <span className="label">거래지역</span>
              <span className="value">
                {getCodeName(locations, item.location)}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">등록일</span>
              <span className="value">{item.regDate}</span>
            </div>
          </div>

          <div className="info-content-box">
            <span className="label">상품 설명</span>
            <p className="info-content">{item.content}</p>
          </div>

          <ItemBoardReplyComponent itemId={id} />

          <div className="read-footer-btns">
            {loginState.email === item.email ? (
              <div className="owner-btns">
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/itemBoard/modify/${id}`)}
                >
                  수정하기
                </button>
                <button className="delete-btn" onClick={handleClickDelete}>
                  삭제하기
                </button>
              </div>
            ) : (
              <>
                <button className="chat-btn" onClick={handleClickAddChat}>
                  판매자와 채팅하기
                </button>
                <button className="chat-btn" onClick={handleClickAddCart}>
                  장바구니 담기
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemBoardReadComponent;
