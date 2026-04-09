import React, { useState, useRef, useEffect } from "react";
import Header from "../../include/Header";
import Footer from "../../include/Footer";
import { getList } from "../../api/admin/BlackListApi";
import "./FraudSearchPage.css";

const FraudSearchPage = () => {
  // 상태 관리: IDLE(대기), LOADING(로딩), SAFE(정상회원), DANGER(블랙리스트), NOT_FOUND(데이터없음)
  const [status, setStatus] = useState("IDLE");
  const [searchResult, setSearchResult] = useState(null);
  const [lastInput, setLastInput] = useState("");

  // 통계 및 그래프 데이터
  const [stats, setStats] = useState({
    totalCount: 0,
    weeklyCount: 0,
    dailyCount: 0,
    chartData: [0, 0, 0, 0, 0],
  });

  const inputRef = useRef(null);

  // 1. 페이지 로드 시 전체 리스트를 분석하여 통계 및 그래프 데이터 생성
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await getList({ page: 1, size: 100 });

        if (data && data.dtoList) {
          const now = new Date();
          const todayStr = now.toISOString().split("T")[0];

          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(now.getDate() - 7);

          const last5Days = [...Array(5)].map((_, i) => {
            const d = new Date();
            d.setDate(now.getDate() - (4 - i));
            return d.toISOString().split("T")[0];
          });

          let daily = 0;
          let weekly = 0;
          const chartCounts = [0, 0, 0, 0, 0];

          data.dtoList.forEach((item) => {
            if (!item.startDate) return;
            const itemDate = item.startDate.split("T")[0];
            const itemDateObj = new Date(item.startDate);

            if (itemDate === todayStr) daily++;
            if (itemDateObj >= oneWeekAgo) weekly++;

            const dayIndex = last5Days.indexOf(itemDate);
            if (dayIndex !== -1) {
              chartCounts[dayIndex]++;
            }
          });

          setStats({
            totalCount: data.totalCount || 0,
            weeklyCount: weekly,
            dailyCount: daily,
            chartData: chartCounts,
          });
        }
      } catch (error) {
        console.error("통계 데이터 로드 실패:", error);
      }
    };
    fetchStatistics();
  }, []);

  const getBarHeight = (count) => {
    const max = Math.max(...stats.chartData, 1);
    return `${(count / max) * 85 + 10}%`;
  };

  // 2. 검색 로직
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const userInput = inputRef.current.value.trim();
    if (!userInput) return;

    setStatus("LOADING");
    setLastInput(userInput);

    try {
      const data = await getList({
        page: 1,
        size: 10,
        searchType: "e",
        keyword: userInput,
      });

      const now = new Date();

      if (!data || !data.dtoList || data.dtoList.length === 0) {
        setStatus("NOT_FOUND");
        setSearchResult(null);
        return;
      }

      const exactMatch = data.dtoList.find((item) => item.email === userInput);

      if (!exactMatch) {
        setStatus("NOT_FOUND");
        setSearchResult(null);
      } else {
        const isExpired =
          exactMatch.endDate && new Date(exactMatch.endDate) < now;

        if (exactMatch.status === "Y" && !isExpired) {
          setStatus("DANGER");
          setSearchResult(exactMatch);
        } else {
          setStatus("SAFE");
          setSearchResult(exactMatch);
        }
      }
    } catch (error) {
      console.error("조회 실패:", error);
      setStatus("IDLE");
    }
  };

  return (
    <div className="fraud-page-root">
      <Header />
      <div className="fraud-layout-container">
        <div className="fraud-content-wrapper">
          <main className="fraud-main-section">
            <div className="fraud-search-header-box">
              <h2 className="fraud-search-title">사기 의심 유저 조회</h2>
              <form
                onSubmit={handleSearch}
                className="fraud-search-input-group"
              >
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="조회할 이메일 주소를 입력하세요"
                />
                <button type="submit" disabled={status === "LOADING"}>
                  {status === "LOADING" ? "..." : "조회"}
                </button>
              </form>
            </div>

            <div className="fraud-result-display-area">
              {status === "IDLE" && (
                <div className="fraud-placeholder">
                  조회하실 정보를 입력하고 검색을 눌러주세요.
                </div>
              )}

              {/* 결과 없음 */}
              {status === "NOT_FOUND" && (
                <div className="fraud-status-box not-found">
                  <div className="fraud-status-icon">❓</div>
                  <h3>회원 정보를 찾을 수 없습니다.</h3>
                  <p className="not-found-text">
                    입력하신 <strong>{lastInput}</strong>님은 가입되지 않았거나
                    존재하지 않는 이메일입니다.
                  </p>
                </div>
              )}

              {/* 위험 상태 */}
              {status === "DANGER" && searchResult && (
                <div className="fraud-status-box danger">
                  <div className="fraud-status-icon">⚠️</div>
                  <h3 className="danger-text">
                    주의! 블랙리스트 등록 사용자입니다.
                  </h3>
                  <table className="fraud-info-table">
                    <tbody>
                      <tr>
                        <th>대상 유저</th>
                        <td>{searchResult.email}</td>
                      </tr>
                      <tr>
                        <th>블랙리스트 등록 사유</th>
                        <td>{searchResult.reason}</td>
                      </tr>
                      <tr>
                        <th>블랙리스트 등록 기간</th>
                        <td>
                          {searchResult.startDate?.split("T")[0]} ~{" "}
                          {searchResult.endDate?.split("T")[0] || "영구"}
                        </td>
                      </tr>
                      <tr>
                        <th>현재 상태</th>
                        <td className="status-highlight-red">차단 활성(Y)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* 정상 회원 상태 */}
              {status === "SAFE" && (
                <div className="fraud-status-box safe">
                  <div className="fraud-status-icon">🛡️</div>
                  <h3>안전한 회원입니다.</h3>
                  <table className="fraud-info-table">
                    <tbody>
                      <tr>
                        <th>검색 대상</th>
                        <td>{lastInput}</td>
                      </tr>
                      <tr>
                        <th>블랙리스트 등록 사유</th>
                        <td>해당 없음 (깨끗한 상태)</td>
                      </tr>
                      <tr>
                        <th>현재 상태</th>
                        <td className="status-highlight-green">정상</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="safe-notice">
                    * 해당 사용자는 현재 어떠한 블랙리스트 등록 기록도 발견되지 않았습니다.
                  </p>
                </div>
              )}
            </div>
          </main>

          <aside className="fraud-sidebar">
            <div className="stat-cards-group">
              <div className="stat-card">
                <span className="stat-label">누적 등록수</span>
                <span className="stat-value">
                  {stats.totalCount.toLocaleString()}
                </span>
              </div>
              <div className="stat-card">
                <span className="stat-label">주간 등록수</span>
                <span className="stat-value">
                  {stats.weeklyCount.toLocaleString()}
                </span>
              </div>
              <div className="stat-card highlight-card">
                <span className="stat-label">오늘 등록수</span>
                <span className="stat-value">
                  {stats.dailyCount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="fraud-chart-section">
              <h4 className="chart-title">블랙리스트 발생 트렌드 (최근 5일)</h4>
              <div className="bar-chart-visual">
                {stats.chartData.map((count, idx) => (
                  <div key={idx} className="bar-container">
                    <div
                      className="bar"
                      style={{ height: getBarHeight(count) }}
                    >
                      <span className="bar-tooltip">{count}건</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="chart-footer">
                실시간 블랙리스트 데이터가 반영되었습니다.
              </p>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FraudSearchPage;
