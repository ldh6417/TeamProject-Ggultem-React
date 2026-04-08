import React, { useEffect, useState } from 'react';
import { getDashboardStats, getDashboardLists } from "../../api/admin/MainDashBoardApi";
import './MainDashBoard.css';

const MainDashBoard = () => {
    const [stats, setStats] = useState([]);      // 상단 5개 카드
    const [lists, setLists] = useState({
        latestCommunity: [],
        latestNotice: [],
        latestReports: [],
        blacklists: [],
        userStatusCounts: {}
    });    // 중단/하단 리스트 데이터
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 두 API를 동시에 호출하여 대기 시간 단축
        Promise.all([getDashboardStats(), getDashboardLists()])
            .then(([statsData, listsData]) => {
                // 상단 카드 데이터 포맷팅 (색상과 아이콘 유지)
                const formattedStats = [
                    { title: "회원 등록 수", value: statsData.memberCount.toLocaleString(), unit: "명", icon: "👤", color: "#4e73df" },
                    { title: "중고거래 등록", value: statsData.itemCount.toLocaleString(), unit: "건", icon: "🛍️", color: "#1cc88a" },
                    { title: "광고 등록 수", value: statsData.adCount.toLocaleString(), unit: "건", icon: "📢", color: "#36b9cc" },
                    { title: "비즈머니 충전", value: statsData.totalCharge.toLocaleString(), unit: "원", icon: "💰", color: "#f6c23e" },
                    { title: "비즈머니 매출", value: statsData.totalSales.toLocaleString(), unit: "원", icon: "📈", color: "#e74a3b" },
                ];

                setStats(formattedStats);
                setLists(listsData);
                setLoading(false);
                console.log(stats);
                console.log(lists);
            })
            .catch(err => {
                console.error("데이터 로드 실패", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="loading-honey">꿀템 데이터 가져오는 중 ...</div>;

return (
        <div className="dashboard-container">
            {/* 1. 상단 Info 카드 섹션 */}
            <div className="stats-grid">
                {stats.map((stat, idx) => (
                    <div key={idx} className="stat-card" style={{ borderLeft: `5px solid ${stat.color}` }}>
                        <div className="stat-content">
                            <span className="stat-label">{stat.title}</span>
                            <div className="stat-value-group">
                                <span className="stat-value">{stat.value}</span>
                                <span className="stat-unit">{stat.unit}</span>
                            </div>
                        </div>
                        <span className="stat-icon">{stat.icon}</span>
                    </div>
                ))}
            </div>

            {/* 2. 중단 최신 내역 리스트 섹션 */}
            <div className="middle-grid">
                <section className="list-section">
                    <h3>커뮤니티 최신글</h3>
                    <ul>
                        {lists.latestCommunity?.length > 0 ? lists.latestCommunity.map(item => (
                            <li key={item.boardNo}>
                                {item.title.length > 18 ? item.title.substring(0, 18) + "..." : item.title}
                                <span>{item.writer}</span>
                            </li>
                        )) : <li>게시글이 없습니다. 🐝</li>}
                    </ul>
                </section>

                <section className="list-section">
                    <h3>공지사항</h3>
                    <ul>
                        {lists.latestNotice?.length > 0 ? lists.latestNotice.map(item => (
                            <li key={item.noticeId}>
                                {item.title} <span>{item.regDate?.split(' ')[0]}</span>
                            </li>
                        )) : <li>공지사항이 없습니다. 🍯</li>}
                    </ul>
                </section>

                <section className="list-section report-section">
                    <h3>신고 미처리 내역 ⚠️</h3>
                    <ul>
                        {lists.latestReports?.length > 0 ? lists.latestReports.map(item => (
                            <li key={item.reportId} className="urgent">
                                [{item.reportType}] {item.reason.length > 15 ? item.reason.substring(0, 15) + "..." : item.reason}
                                <span>{item.targetMemberId?.split('@')[0]}</span>
                            </li>
                        )) : <li>미처리 내역이 없습니다. ✅</li>}
                    </ul>
                </section>
            </div>

            {/* 3. 하단 블랙리스트 및 유저 통계 섹션 */}
            <div className="bottom-section">
                <div className="blacklist-container">
                    {/* 하단 왼쪽 2/3: 블랙리스트 리스트 */}
                    <section className="blacklist-table-area">
                        <h3>블랙리스트 최근 현황 🚫</h3>
                        <div className="table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>대상 계정</th>
                                        <th>차단 사유</th>
                                        <th>상태</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lists.blacklists?.length > 0 ? lists.blacklists.map(bl => (
                                        <tr key={bl.blId}>
                                            <td>{bl.email}</td>
                                            <td>{bl.reason}</td>
                                            <td><span className={bl.status === 'Y' ? "badge-red" : "badge-yellow"}>{bl.status === 'Y' ? "BANNED" : "PENDING"}</span></td>
                                        </tr>
                                    )) : <tr><td colSpan="3" style={{textAlign:'center', padding:'20px'}}>내역이 없습니다.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* 하단 오른쪽 1/3: 유저 상태 원차트 (CSS 동적 계산) */}
                    <section className="chart-area">
                        <h3>유저 상태 비율 👤</h3>
                        <div className="pie-chart-placeholder">
                            <div className="mock-pie-chart" style={{
                                background: `conic-gradient(
                                    #4e73df 0% ${(lists.userStatusCounts["1"] || 0) / (stats[0]?.value || 1) * 100}%, 
                                    #f6c23e ${(lists.userStatusCounts["1"] || 0) / (stats[0]?.value || 1) * 100}% ${(lists.userStatusCounts["1"] || 0 + lists.userStatusCounts["2"] || 0) / (stats[0]?.value || 1) * 100}%,
                                    #858796 ${(lists.userStatusCounts["1"] || 0 + lists.userStatusCounts["2"] || 0) / (stats[0]?.value || 1) * 100}% 100%
                                )`
                            }}>
                                <div className="pie-center">
                                    <strong>TOTAL</strong>
                                    <span>{stats[0]?.value}명</span>
                                </div>
                            </div>
                            <ul className="chart-legend">
                                <li><span className="dot status-1"></span> 활성 ({lists.userStatusCounts["1"] || 0})</li>
                                <li><span className="dot status-2"></span> 정지 ({lists.userStatusCounts["2"] || 0})</li>
                                <li><span className="dot status-0"></span> 기타 ({lists.userStatusCounts["0"] || 0})</li>
                            </ul>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default MainDashBoard;