import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getOne, deleteOne, API_SERVER_HOST } from "../../api/ItemBoardApi"; // deleteOne 추가 확인
import useCustomLogin from "../../hooks/useCustomLogin";
import ItemBoardReplyComponent from "./ItemBoardReplyComponent";
import "./ItemBoardReadComponent.css";
import { postAdd } from "../../api/CartApi";

const host = API_SERVER_HOST;

const ItemBoardReadComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loginState } = useCustomLogin();
  const [item, setItem] = useState(null);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (id) {
      getOne(id)
        .then((data) => {
          console.log("상세 데이터:", data);
          setItem(data);
          setFetching(false);
        })
        .catch((err) => {
          setFetching(false);
          console.error("데이터 로딩 실패:", err);
          alert("존재하지 않는 상품입니다.");
          navigate("/itemBoard/list");
        });
    }
  }, [id, navigate]);

  // 삭제 함수
  const handleClickDelete = () => {
    if (window.confirm("정말로 이 상품을 삭제하시겠습니까?")) {
      setFetching(true);
      deleteOne(id)
        .then((data) => {
          console.log("삭제 성공:", data);
          setFetching(false);
          alert("삭제되었습니다.");
          navigate("/itemBoard/list");
        })
        .catch((err) => {
          setFetching(false);
          alert("삭제 중 오류가 발생했습니다.");
        });
    }
  };

  if (fetching && !item)
    return <div className="loading">데이터를 불러오는 중...</div>;
  if (!item) return null;

  //장바구니 담기
  const handleClickAddCart = () => {
    const cartObj = {
      itemId: Number(id), // 숫자로 확실히 변환
      email: loginState.email,
    };

    console.log("전송 데이터:", cartObj); // 전송 직전 로그 확인

    postAdd(cartObj)
      .then((data) => {
        alert("장바구니 담기 성공!");
        navigate("/cart/list");
      })
      .catch((err) => {
        console.error("에러 발생:", err.response); // 여기서 상세 에러 확인 가능
      });
  };
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
        {/* 왼쪽: 이미지 섹션 */}
        <div className="image-section">
          {item.uploadFileNames && item.uploadFileNames.length > 0 ? (
            item.uploadFileNames.map((fileName, idx) => (
              <img
                key={idx}
                src={`${host}/itemBoard/view/${fileName}`}
                alt={`product-${idx}`}
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

        {/* 오른쪽: 정보 상세 섹션 */}
        <div className="info-section">
          <div className="info-main">
            <span className="info-category">{item.category}</span>
            <span
              className={`status-badge ${String(item.status) ? "sold-out" : "on-sale"}`}
            >
              {String(item.status) === "true" ? "판매 완료" : "판매 중"}
            </span>
            <h1 className="info-title">{item.title}</h1>
            <h2 className="info-price">{item.price?.toLocaleString()}원</h2>
          </div>

          <div className="detail-row">
            <span className="label">조회수</span>
            <span className="value">{item.viewCount || 0}</span>
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
              <span className="value">{item.location}</span>
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

          {/* 버튼 영역: 본인 확인 조건부 렌더링 */}
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
                <button className="chat-btn">판매자와 채팅하기</button>
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
