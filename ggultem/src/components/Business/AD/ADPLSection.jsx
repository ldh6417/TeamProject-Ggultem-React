import "./ADPLSection.css";
import {
  getADPLList,
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
    getADPLList().then((data) => {
      console.log(data);
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
    <div className="AD-section-container compact-ad-section">
      <div className="AD-section-header">
        <h2 className="AD-section-title">꿀템 파트너스 파워링크</h2>
        <span className="AD-badge">AD</span>
      </div>

      <div className="AD-list-wrapper">
        {/* 🚩 조건부 렌더링: 광고 리스트가 있을 때 */}
        {adList && adList.length > 0 ? (
          adList.map((dto) => (
            <div key={dto.no} className="AD-compact-item">
              {/* [왼쪽 컨텐츠] 50px x 50px 썸네일 */}
              <div className="AD-compact-thumb">
                {dto.uploadFileNames && dto.uploadFileNames.length > 0 ? (
                  <img
                    src={`${host}/business/board/view/s_${dto.uploadFileNames[0]}`}
                    alt="thumb"
                    onClick={() =>
                      handleClickAd(dto.moveUrl, dto.no, dto.email, dto.title)
                    }
                  />
                ) : (
                  <div className="no-thumb"></div>
                )}
              </div>

              {/* [오른쪽 컨텐츠] 세로 정렬 */}
              <div className="AD-compact-info">
                <div className="AD-info-url">{dto.moveUrl}</div>
                <div
                  className="AD-info-title"
                  onClick={() =>
                    handleClickAd(dto.moveUrl, dto.no, dto.email, dto.title)
                  }
                >
                  {dto.title}
                </div>
                <div className="AD-info-desc">{dto.content}</div>
                <div className="AD-info-price">
                  {dto.price.toLocaleString()}원
                </div>
              </div>
            </div>
          ))
        ) : (
          /* 🚩 광고 리스트가 없을 때: 파워링크 스타일 전용 Empty State */
          <div className="ADPL-empty-container">
            <div className="ADPL-empty-content">
              <p className="ADPL-empty-main-text">
                새로운 비즈니스 파트너를 기다리고 있습니다.
              </p>
              <p className="ADPL-empty-sub-text">
                검색 상단 노출로 더 많은 고객과 만나보세요!
              </p>
              <button
                className="ADPL-register-btn"
                onClick={() => navigate("/business/register")}
              >
                파워링크 신청하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
