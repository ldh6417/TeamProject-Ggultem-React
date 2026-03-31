import "./ADSection.css";
import {
  getADSPList,
  viewCountAdd,
  spendMoneyByClick,
} from "../../../api/BusinessApi";
import { useEffect, useState } from "react";
import { API_SERVER_HOST } from "../../../api/BusinessApi"; // 이미지 경로용 호스트
import { useNavigate } from "react-router";

const host = API_SERVER_HOST;

export default function ADSection() {
  const [adList, setAdList] = useState([]); // 광고는 단순 리스트이므로 배열로 관리
  const navigate = useNavigate();

  useEffect(() => {
    getADSPList().then((data) => {
      setAdList(data);
    });
  }, []); // 빈 배열을 넣어야 컴포넌트 마운트 시 한 번만 실행

  // 클릭 시 URL로 이동하는 함수
  const handleClickAd = async (linkUrl, no, email, title) => {
    if (!linkUrl) {
      alert("연결된 링크가 없습니다.");
      return;
    }

    try {
      // 1. 조회수와 비즈머니 차감을 병렬로 처리 (속도 UP!)
      const cpcAmount = 100;
      await Promise.all([
        viewCountAdd(no, email),
        spendMoneyByClick(email, cpcAmount, title),
      ]);

      console.log("정산 및 조회수 증가 완료 🐝");

      // 2. 모든 처리가 끝난 후 안전하게 이동
      const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("처리 중 오류 발생:", err);
    }
  };

  return (
    <div className="AD-section-container">
      <div className="AD-section-header">
        <h2 className="AD-section-title">오늘의 추천 꿀템</h2>
        <span className="AD-badge">AD</span>
      </div>

      {/* 🚩 조건부 렌더링: 광고 리스트가 있을 때만 map 실행 */}
      {adList && adList.length > 0 ? (
        <div className="AD-card-wrapper">
          {adList.map((dto) => (
            <div
              key={dto.no}
              className="AD-card"
              onClick={() =>
                handleClickAd(dto.moveUrl, dto.no, dto.email, dto.title)
              }
            >
              <div className="AD-card-image-box">
                {dto.uploadFileNames && dto.uploadFileNames.length > 0 ? (
                  <img
                    src={`${host}/business/board/view/s_${dto.uploadFileNames[0]}`}
                    alt={dto.title}
                  />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>
              <div className="AD-card-content">
                <div className="AD-card-top">
                  <span className="AD-card-category">{dto.category}</span>
                </div>
                <h4 className="AD-card-title">{dto.title}</h4>
                <p className="AD-card-price">{dto.price.toLocaleString()}원</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* 🚩 광고 리스트가 없을 때 보여줄 화면 */
        <div className="AD-empty-state">
          <p className="AD-empty-text">현재 등록된 광고가 없습니다.</p>
          <p className="AD-suggest-text">
            꿀템의 비즈니스 파트너가 되시겠습니까?
          </p>
          <button
            className="AD-partner-btn"
            onClick={() => navigate("/business/register")}
          >
            파워쇼핑 신청하기
          </button>
        </div>
      )}
    </div>
  );
}
