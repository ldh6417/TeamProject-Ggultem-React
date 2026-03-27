import { useRef, useState, useEffect } from "react";
import {
  API_SERVER_HOST,
  getOne,
  postItemBoardRemove,
} from "../../../api/BusinessApi";
import { useNavigate } from "react-router";
import useCustomLogin from "../../../hooks/useCustomLogin";
import "./ReadComponent.css";
import useCustomMove from "../../../hooks/useCustomMove";

const initState = {
  title: "",
  price: 0,
  content: "",
  category: "",
  email: "",
  writer: "",
  moveUrl: "",
  sign: false,
  enabled: 0,
  onOff: false,
  regDate: null,
  endDate: "",
  files: [],
  uploadFileNames: [],
};

const host = API_SERVER_HOST;

const ReadComponent = ({ no }) => {
  const { moveToBusinessBoardModify } = useCustomMove();
  const navigate = useNavigate();
  const [item, setItem] = useState({ ...initState });

  useEffect(() => {
    getOne(no).then((data) => {
      setItem(data);
    });
  }, [no]);

  const modifyOnClick = () => {
    moveToBusinessBoardModify(no);
  };
  const removeOnClick = () => {
    postItemBoardRemove(no)
      .then(() => {
        alert("삭제되었습니다.");
      })
      .catch(() => {
        alert("삭제에 실패하였습니다.");
      });
  };

  return (
    <div className="businessboard-read-wrapper">
      <div className="businessboard-read-container">
        {/* 상단 타이틀 및 버튼 */}
        <div className="businessboard-read-header">
          <h2 className="businessboard-read-title">광고 상세 정보</h2>
          <div className="businessboard-read-actions">
            <button
              className="businessboard-read-btn approve"
              onClick={modifyOnClick}
            >
              수정하기
            </button>
            <button
              className="businessboard-read-btn reject"
              onClick={removeOnClick}
            >
              삭제하기
            </button>

            <button
              className="businessboard-read-btn list"
              onClick={() => navigate(`/business/board/list`)}
            >
              목록으로
            </button>
          </div>
        </div>

        <div className="businessboard-read-content">
          {/* 왼쪽: 프로필 이미지 및 권한 배지 */}
          <div className="businessboard-read-profile-section">
            <div className="businessboard-read-image-box">
              {item.uploadFileNames && item.uploadFileNames.length > 0 ? (
                <img
                  src={`${host}/business/board/view/${item.uploadFileNames[0]}`}
                  alt="Business Item"
                />
              ) : (
                <div className="businessboard-read-no-image">No Image</div>
              )}
            </div>
            <div className="businessboard-read-category-badges">
              <span className={`businessboard-role-badge ${item.category}`}>
                {item.category === "powershoping" ? "파워쇼핑" : "파워링크"}
              </span>
              <span
                className={`businessboard-role-badge ${item.sign ? "verified" : "unverified"}`}
              >
                {item.sign ? "승인 완료" : "승인 대기"}
              </span>
              <span
                className={`businessboard-state-badge ${item.onOff ? "on" : "off"}`}
              >
                {item.onOff ? "운영중" : "종료"}
              </span>
            </div>
          </div>

          {/* 오른쪽: 상세 정보 리스트 (새로 추가된 부분) */}
          <div className="businessboard-read-info-section">
            <div className="businessboard-info-group">
              <h3>📋 기본 정보</h3>
              <div className="businessboard-info-row">
                <span className="info-label">광고주(이메일)</span>
                <span className="info-value">{item.email}</span>
              </div>
              <div className="businessboard-info-row">
                <span className="info-label">상호명</span>
                <span className="info-value">{item.writer}</span>
              </div>
            </div>

            <div className="businessboard-info-group">
              <h3>📝 광고 컨텐츠</h3>
              <div className="businessboard-info-row">
                <span className="info-label">광고 제목</span>
                <span className="info-value font-bold">{item.title}</span>
              </div>
              <div className="businessboard-info-row">
                <span className="info-label">광고 문구</span>
                <span className="info-value">{item.content}</span>
              </div>
              <div className="businessboard-info-row">
                <span className="info-label">연결 URL</span>
                <span className="info-value url-text">{item.moveUrl}</span>
              </div>
            </div>

            <div className="businessboard-info-group">
              <h3>💰 가격 및 기간</h3>
              <div className="businessboard-info-row">
                <span className="info-label">판매 금액</span>
                <span className="info-value price-text">
                  {item.price?.toLocaleString()}원
                </span>
              </div>
              <div className="businessboard-info-row">
                <span className="info-label">등록 일시</span>
                <span className="info-value">
                  {item.regDate ? item.regDate.replace("T", " ") : "-"}
                </span>
              </div>
              <div className="businessboard-info-row">
                <span className="info-label">종료 예정일</span>
                <span className="info-value end-date">
                  {item.endDate ? item.endDate.split("T")[0] : "-"}
                </span>
              </div>
              <div className="businessboard-info-row">
                <span className="info-label">누적 클릭수</span>
                <span className="info-value">{item.viewCount}회</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadComponent;
