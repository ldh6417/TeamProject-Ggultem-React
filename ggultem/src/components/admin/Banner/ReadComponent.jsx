import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOne, API_SERVER_HOST, removeBanner } from "../../../api/BannerApi";
import "./ReadComponent.css";

const host = API_SERVER_HOST;

const initState = {
  no: 0,
  title: "",
  content: "",
  link: "",
  enabled: 0,
  regDate: null,
  endDate: null,
  uploadFileNames: [],
};

const ReadPage = ({ no }) => {
  const navigate = useNavigate();
  const [banner, setBanner] = useState(initState);

  useEffect(() => {
    if (no) {
      getOne(no).then((data) => {
        setBanner(data);
      });
    }
  }, [no]);

  const handlerRemove = () => {
    if (!window.confirm("배너를 삭제하시겠습니까?")) {
      return; // 취소를 누르면 함수 종료
    }

    removeBanner(no).then(() => {
      alert("배너를 삭제하였습니다.");
      navigate("/admin/banner/list", { replace: true });
    });
  };

  if (!no || !banner.no)
    return (
      <div className="memberinfo-loading">배너 정보를 불러오는 중입니다...</div>
    );

  return (
    <div className="banner-read-container">
      <div className="banner-read-card">
        {/* 1. 상단 배너 이미지 영역 */}
        <div className="banner-read-image-section">
          {banner.uploadFileNames && banner.uploadFileNames.length > 0 ? (
            <img
              src={`${host}/admin/banner/view/${banner.uploadFileNames[0]}`}
              alt="Banner Preview"
              className="banner-read-img"
            />
          ) : (
            <div className="banner-read-no-image">
              등록된 이미지가 없습니다.
            </div>
          )}
          <div
            className={`banner-read-status-badge ${banner.enabled === 1 ? "active" : "inactive"}`}
          >
            {banner.enabled === 1 ? "운영 중" : "비활성"}
          </div>
        </div>

        {/* 2. 하단 상세 정보 영역 */}
        <div className="banner-read-info-section">
          <div className="info-row main-title">
            <span className="info-label">배너 제목</span>
            <div className="info-value">{banner.title}</div>
          </div>

          <div className="info-row">
            <span className="info-label">연결 링크</span>
            <div className="info-value">
              <a
                href={banner.link}
                target="_blank"
                rel="noopener noreferrer"
                className="banner-link-url"
              >
                {banner.link || "연결된 링크가 없습니다."}
              </a>
            </div>
          </div>

          <div className="info-row">
            <span className="info-label">배너 내용</span>
            <div className="info-value content-box">{banner.content}</div>
          </div>

          <div className="info-row date-row">
            <span className="info-label">광고 기간</span>
            <div className="info-value">
              <span className="date-text">{banner.regDate?.split("T")[0]}</span>
              <span className="date-separator"> ~ </span>
              <span className="date-text">
                {banner.endDate?.split("T")[0] || "무기한"}
              </span>
            </div>
          </div>
        </div>

        {/* 3. 버튼 그룹 */}
        <div className="banner-read-buttons">
          <button
            className="btn-back"
            onClick={() => navigate("/admin/banner/list")}
          >
            목록으로
          </button>
          <button
            className="btn-modify"
            onClick={() => navigate(`/admin/banner/modify/${banner.no}`)}
          >
            수정하기
          </button>
          <button className="btn-remove" onClick={handlerRemove}>
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadPage;
