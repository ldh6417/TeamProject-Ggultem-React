import { useEffect, useState } from "react";
import { getBusinessStats } from "../../../api/BusinessApi";
import { useNavigate } from "react-router-dom";
import "./DataComponent.css";

// 광고 차트를 위한 import
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

// 날짜를 YYYY-MM-DD 형식의 문자열로 만들어주는 헬퍼 함수
const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

const getInitialDateRange = () => {
  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7); // 7일 전으로 설정

  return {
    start: formatDate(lastWeek),
    end: formatDate(today),
  };
};

const DataComponent = () => {
  const [statsData, setStatsData] = useState({
    totalPowerLinkClicks: 0,
    totalPowerLinkCount: 0,
    totalPowerShoppingClicks: 0,
    totalPowerShoppingCount: 0,
    dailyStats: [], // 차트 map 에러 방지를 위해 빈 배열 필수
  });
  const [dateRange, setDateRange] = useState(getInitialDateRange);
  const loginState = useSelector((state) => state.loginSlice);

  // API 호출 시 날짜 포함
  useEffect(() => {
    getBusinessStats(loginState.email, dateRange.start, dateRange.end).then(
      (data) => {
        setStatsData(data);
      },
    );
  }, [loginState.email, dateRange]);

  // 막대그래프 데이터 설정
  const chartData = {
    labels: statsData?.dailyStats?.map((m) => m.day) || [],
    datasets: [
      {
        label: "파워쇼핑",
        data:
          statsData?.dailyStats?.map((m) => m.powerShoppingClick || 0) || [],
        backgroundColor: "#ffcc00",
        borderRadius: 5,
      },
      {
        label: "파워링크",
        data: statsData?.dailyStats?.map((m) => m.powerLinkClick || 0) || [],
        backgroundColor: "#6d5908",
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "기간별 광고 집행 및 클릭 현황",
        font: { size: 16 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  // return 문 바로 위에서 계산
  const totalClicks =
    (statsData.totalPowerLinkClicks || 0) +
    (statsData.totalPowerShoppingClicks || 0);
  const totalAdCount =
    (statsData.totalPowerLinkCount || 0) +
    (statsData.totalPowerShoppingCount || 0);

  return (
    <div className="biz-list-wrapper">
      {/* 📈 상단 통계 대시보드 */}
      <section className="biz-stats-container">
        <div className="stats-summary">
          <div className="stats-card">
            <h4>All DashBoard</h4>
            <div className="info-wrapper">
              <p>
                {/* 서버에서 받아온 전체 통계(statsData)를 사용하세요 */}총
                클릭수: <span>{totalClicks.toLocaleString()}</span>
              </p>
              <p>
                등록 광고: <span>{totalAdCount.toLocaleString()}</span>
              </p>
            </div>
          </div>
          <div className="stats-summary-2">
            <div className="stats-card">
              <h4>파워쇼핑 DashBoard</h4>
              <div className="info-wrapper">
                <p>
                  총 클릭수:{" "}
                  <span>
                    {(statsData.totalPowerShoppingClicks || 0).toLocaleString()}
                  </span>
                </p>
                <p>
                  등록 광고:{" "}
                  <span>{statsData.totalPowerShoppingCount || 0}</span>
                </p>
              </div>
            </div>
            <div className="stats-card">
              <h4>파워링크 DashBoard</h4>
              <div className="info-wrapper">
                <p>
                  {/* 서버에서 받아온 전체 통계(statsData)를 사용하세요 */}총
                  클릭수:{" "}
                  <span>
                    {(statsData.totalPowerLinkClicks || 0).toLocaleString()}
                  </span>
                </p>
                <p>
                  등록 광고: <span>{statsData.totalPowerLinkCount || 0}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 📊 막대그래프로 변경된 차트 영역 */}
        <div className="date-filter-container">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange({ ...dateRange, start: e.target.value })
            }
          />
          <span>~</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange({ ...dateRange, end: e.target.value })
            }
          />
        </div>
        <div
          className="stats-chart"
          style={{ height: "300px", position: "relative" }}
        >
          {/* 데이터가 확실히 있을 때만 Bar 컴포넌트를 올립니다 */}
          {statsData &&
          statsData.dailyStats &&
          statsData.dailyStats.length > 0 ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <div className="no-chart-data">
              조회된 기간에 통계 데이터가 없습니다. 🍯
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DataComponent;
