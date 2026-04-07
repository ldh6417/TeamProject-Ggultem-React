import React, { useEffect, useState } from "react";
import Header from "../include/Header";
import "./MainPage.css";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../include/Footer";
import AD from "../include/business/AD";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { API_SERVER_HOST } from "../api/config";
import { getBannerList } from "../api/BannerApi";

// Swiper 스타일 import
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const host = API_SERVER_HOST;

const MainPage = () => {
  const [keyword, setKeyword] = useState("");
  const [searchType, setSearchType] = useState("all"); // 카테고리 상태
  const [bannerImages, setBannerImages] = useState([]); // 배너 이미지 상태
  const navigate = useNavigate();

  // 1. 관리자가 등록한 배너 이미지 목록 가져오기 (가상 로직)
  useEffect(() => {
    // API 호출을 통해 배너 이미지 리스트를 가져온다고 가정합니다.
    getBannerList().then((data) => setBannerImages(data));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!keyword.trim()) {
      alert("검색어를 입력해주세요!");
      return;
    }
    if (searchType === "report") {
      // 사기조회 페이지로 키워드와 함께 이동
      navigate(`/report?keyword=${keyword}`);
    } else {
      // 기존 카테고리(중고거래, 커뮤니티 등) 검색 로직
      navigate(`/${searchType}/list?page=1&size=10&keyword=${keyword}`);
    }
  };

  return (
    <div className="mainpage-container">
      <Header />

      <main className="mainpage-content-area">
        <div className="mainpage-hero-section">
          <h2>달콤한 득템, 꿀템!</h2>

          {/* ✅ 와이드 검색창 + 카테고리 선택 */}
          <form className="mainpage-search-form-wide" onSubmit={handleSearch}>
            <select
              className="mainpage-search-type-select"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="">선택</option>
              <option value="itemBoard">중고거래</option>
              <option value="board">커뮤니티</option>
              <option value="notice">공지사항</option>
            </select>

            <input
              type="text"
              className="mainpage-search-input-wide"
              placeholder="동네에서 꿀템을 검색해보세요!"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit" className="mainpage-search-btn-wide">
              검색
            </button>
          </form>
        </div>

        {/* ✅ 중앙 와이드 슬라이드 배너 */}
        <div className="mainpage-center-banner-wrapper">
          {/* dtoList에서 enabled가 1인 데이터만 필터링 */}
          {(() => {
            const activeBanners =
              bannerImages.dtoList?.filter((banner) => banner.enabled === 1) ||
              [];

            return activeBanners.length > 0 ? (
              <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mainpage-mySwiper"
              >
                {activeBanners.map((banner) => (
                  <SwiperSlide key={banner.no}>
                    <Link to={banner.link || "#"}>
                      <img
                        src={`${host}/admin/banner/view/${banner.uploadFileNames[0]}`}
                        alt={`Banner ${banner.no}`}
                        className="mainpage-banner-img"
                      />
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              /* 🍯 활성화된 광고가 없을 때 */
              <div className="mainpage-no-banner">
                <p>꿀같은 아이템을 내 손 안에! 꿀템!</p>
              </div>
            );
          })()}
        </div>

        {/* 하단 버튼형 메뉴 */}
        <div className="mainpage-content-wrapper-wide">
          <Link to="/itemBoard/list" className="mainpage-content-card-wide">
            <div className="mainpage-icon-box">📦</div> {/* 아이콘 자리 */}
            <div className="mainpage-content-box">중고거래</div>
          </Link>

          <Link to="/report" className="mainpage-content-card-wide">
            <div className="mainpage-icon-box">🔍</div>
            <div className="mainpage-content-box">사기조회</div>
          </Link>

          <Link to="/board/list" className="mainpage-content-card-wide">
            <div className="mainpage-icon-box">💬</div>
            <div className="mainpage-content-box">커뮤니티</div>
          </Link>

          <Link to="/notice/list" className="mainpage-content-card-wide">
            <div className="mainpage-icon-box">📢</div>
            <div className="mainpage-content-box">공지사항</div>
          </Link>
        </div>
        <AD />
      </main>

      <Footer />
    </div>
  );
};

export default MainPage;
