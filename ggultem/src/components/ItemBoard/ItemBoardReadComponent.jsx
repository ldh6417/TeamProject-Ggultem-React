import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getOne, deleteOne, API_SERVER_HOST } from "../../api/ItemBoardApi";
import { getListByGroup } from "../../api/admin/CodeDetailApi";
import useCustomLogin from "../../hooks/useCustomLogin";
import ItemBoardReplyComponent from "./ItemBoardReplyComponent";
import { postAdd } from "../../api/CartApi";
import { postChatAdd } from "../../api/ChatApi";
import useReport from "../../hooks/useReport";
import ReportModal from "../../common/ReportModal";
import axios from "axios";
import "./ItemBoardReadComponent.css";

const host = API_SERVER_HOST;

const ItemBoardReadComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loginState } = useCustomLogin();
  const { showModal, setShowModal, sendReport } = useReport();

  const [item, setItem] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [targetData, setTargetData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  const email = loginState?.email;

  useEffect(() => {
    if (id) {
      getOne(id)
        .then((data) => {
          setItem(data);
          setFetching(false);
        })
        .catch(() => {
          setFetching(false);
          navigate("/itemBoard/list");
        });

      // 공통 코드(카테고리/지역) 가져오기
      const pageParam = { page: 1, size: 100 };
      axios
        .get(`${host}/api/codegroup/list`, { params: pageParam })
        .then((res) => {
          const allGroups = res.data?.dtoList || [];
          allGroups.forEach((group) => {
            const gCode = group.groupCode?.toUpperCase() || "";
            if (gCode.includes("ITEM_CATEGORY")) {
              getListByGroup(pageParam, group.groupCode).then((data) => {
                if (data?.dtoList) setCategories(data.dtoList);
              });
            }
            if (gCode.includes("ITEM_LOCATION")) {
              getListByGroup(pageParam, group.groupCode).then((data) => {
                if (data?.dtoList) setLocations(data.dtoList);
              });
            }
          });
        });
    }
  }, [id, navigate]);

  const getCodeName = (codeList, codeValue) => {
    if (!codeList || !codeValue) return codeValue;
    const found = codeList.find((c) => c.codeValue === codeValue);
    return found ? found.codeName : codeValue;
  };

  // 🛡️ [해결 1] 데이터가 없으면 '로딩 중'만 보여주고 아래 HTML은 쳐다보지도 않게 함
  if (fetching || !item) {
    return (
      <div className="loading-state">
        <p>꿀템 정보를 가져오는 중입니다...</p>
      </div>
    );
  }

  // 데이터가 확실히 있을 때만 변수 설정
  const isSoldOut =
    String(item.status) === "판매완료" ||
    String(item.status) === "true" ||
    item.status === true;

  return (
    <div className="read-container">
      <div className="read-header">
        <button
          className="back-btn"
          onClick={() => navigate("/itemBoard/list")}
        >
          ← 목록으로
        </button>
      </div>

      <div className="read-content">
        <div className="image-section">
          {item.uploadFileNames?.length > 0 ? (
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
          <div className="info-top-line">
            <span className="info-category">
              [{getCodeName(categories, item.category)}]
            </span>
            <div className="share-wrapper">
              <button
                className="main-share-btn"
                onClick={() => setShowShareOptions(!showShareOptions)}
              >
                공유하기
              </button>
              {showShareOptions && (
                <div className="share-dropdown">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("복사 완료!");
                      setShowShareOptions(false);
                    }}
                    className="dropdown-item"
                  >
                    🔗 URL 복사
                  </button>
                </div>
              )}
              {email && item.email !== email && (
                <button
                  className="main-share-btn report-btn"
                  onClick={() => {
                    setTargetData({
                      targetType: "거래게시판",
                      targetNo: Number(item.itemId),
                      targetMemberId: item.email,
                    });
                    setShowModal(true);
                  }}
                >
                  신고하기
                </button>
              )}
            </div>
          </div>

          <div className="info-main">
            {/* ✅ [해결 2] 배지 클래스 자동 적용 */}
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
              <span className="value">{item.writer}</span>
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
        </div>
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
            <button
              className="delete-btn"
              onClick={() => {
                if (window.confirm("삭제하시겠습니까?"))
                  deleteOne(id).then(() => navigate("/itemBoard/list"));
              }}
            >
              삭제하기
            </button>
          </div>
        ) : (
          <div className="buyer-btns">
            <button
              className="chat-btn dark"
              onClick={() => {
                /* 채팅 로직 */
              }}
            >
              판매자와 채팅하기
            </button>
            <button
              className="chat-btn yellow"
              onClick={() => {
                /* 장바구니 로직 */
              }}
            >
              장바구니 담기
            </button>
          </div>
        )}
      </div>
      <ReportModal
        show={showModal}
        targetData={targetData}
        callbackFn={() => setShowModal(false)}
        submitFn={sendReport}
      />
    </div>
  );
};

export default ItemBoardReadComponent;
