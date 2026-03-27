import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // 👈 회원 페이지 이동을 위해 추가
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import { getList } from "../../../api/admin/BlackListApi";
import useCustomMove from "../../../hooks/useCustomMove";
import PageComponent from "../../common/PageComponent";
import BlackListModal from "./BlackListModal";

ChartJS.register(ArcElement, Tooltip, Legend);

const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totalCount: 0,
  current: 0,
};

const BlackListDashboard = () => {
  const { page, size, refresh, keyword, searchType, moveToAdd, movePage } =
    useCustomMove();
  const navigate = useNavigate(); // 👈 네비게이트 훅 선언

  const [serverData, setServerData] = useState(initState);
  const [showModal, setShowModal] = useState(false);
  const [currentBlId, setCurrentBlId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");

  const selectRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const querySearchType = searchType || "e";
    const queryKeyword = keyword || "";

    if (selectRef.current) selectRef.current.value = querySearchType;
    if (inputRef.current) inputRef.current.value = queryKeyword;

    getList({
      page,
      size,
      searchType: querySearchType,
      keyword: queryKeyword,
    })
      .then((data) => {
        setServerData(data || initState);
      })
      .catch((err) => {
        console.error("데이터 로딩 실패:", err);
      });
  }, [page, size, refresh, keyword, searchType]);

  const filteredList =
    serverData.dtoList?.filter((item) => {
      if (filterStatus === "ALL") return true;
      return item.status === filterStatus;
    }) || [];

  const handleSearch = () => {
    const type = selectRef.current.value;
    const word = inputRef.current.value.trim();
    movePage({ page: 1, searchType: type, keyword: word });
  };

  const handleMoveToAddWithCheck = () => {
    const inputEmail = inputRef.current?.value.trim();
    if (inputEmail && selectRef.current?.value === "e") {
      const isAlreadyActive = serverData.dtoList.some(
        (item) => item.email === inputEmail && item.status === "Y",
      );
      if (isAlreadyActive) {
        alert(`[${inputEmail}]님은 이미 차단(Y) 상태입니다.`);
        return;
      }
    }
    moveToAdd();
  };

  const closeAfterAction = (isChanged) => {
    setShowModal(false);
    setCurrentBlId(null);
    if (isChanged) {
      movePage({ page, searchType, keyword });
    }
  };

  const activeCount =
    serverData.dtoList?.filter((item) => item.status === "Y").length || 0;
  const inactiveCount = (serverData.dtoList?.length || 0) - activeCount;

  const chartData = {
    labels: ["차단 중(Y)", "해제(N)"],
    datasets: [
      {
        label: "차단 상태 비율",
        data: [activeCount, inactiveCount],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" } },
  };

  const handleClickRead = (blId) => {
    setCurrentBlId(blId);
    setShowModal(true);
  };

  // 🚀 이메일 클릭 시 회원 상세 정보로 이동하는 함수
  const handleClickMember = (email) => {
    navigate(`/admin/member/${email}`);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* 통계 섹션 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "30px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          marginBottom: "30px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          border: "1px solid #eee",
        }}
      >
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: "0 0 15px 0", color: "#222" }}>
            Blacklist Statistics
          </h2>
          <p style={{ fontSize: "1.1rem", color: "#555" }}>
            전체 누적 기록:{" "}
            <strong style={{ color: "#333" }}>{serverData.totalCount}</strong>건
          </p>
          <p style={{ fontSize: "1.1rem", color: "#555" }}>
            현재 페이지 차단 중(Y):{" "}
            <span style={{ color: "#FF6384", fontWeight: "bold" }}>
              {activeCount}
            </span>
            건
          </p>
        </div>
        <div style={{ width: "220px", height: "220px" }}>
          {serverData.dtoList?.length > 0 ? (
            <Doughnut data={chartData} options={chartOptions} />
          ) : (
            <div
              style={{
                textAlign: "center",
                lineHeight: "220px",
                color: "#ccc",
                border: "1px dashed #ccc",
                borderRadius: "50%",
              }}
            >
              데이터 없음
            </div>
          )}
        </div>
      </div>

      {/* 카테고리 탭 영역 */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        {[
          { id: "ALL", label: "전체 목록" },
          { id: "Y", label: "차단 중(Y)" },
          { id: "N", label: "차단 해제(N)" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              border: "1px solid #ddd",
              backgroundColor: filterStatus === tab.id ? "#333" : "#fff",
              color: filterStatus === tab.id ? "#fff" : "#333",
              transition: "0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 검색 바 영역 */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          alignItems: "center",
        }}
      >
        <select
          ref={selectRef}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        >
          <option value="e">이메일</option>
          <option value="r">차단 사유</option>
        </select>
        <input
          ref={inputRef}
          type="text"
          placeholder="검색어를 입력하세요..."
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ddd",
            flex: 1,
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "8px 20px",
            backgroundColor: "#333",
            color: "#fff",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          검색
        </button>
        <button
          onClick={handleMoveToAddWithCheck}
          style={{
            padding: "8px 20px",
            backgroundColor: "#228be6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          + 신규 유저 차단
        </button>
      </div>

      {/* 테이블 리스트 */}
      <table
        style={{
          width: "100%",
          textAlign: "center",
          borderCollapse: "separate",
          borderSpacing: "0",
          fontSize: "14px",
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid #eee",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#f1f3f5",
              height: "50px",
              color: "#495057",
            }}
          >
            <th style={{ width: "70px" }}>ID</th>
            <th>EMAIL</th>
            <th>REASON</th>
            <th>ADMIN</th>
            <th>START_DATE</th>
            <th>END_DATE</th>
            <th style={{ width: "100px" }}>STATUS</th>
            <th style={{ width: "160px" }}>MANAGE</th>
          </tr>
        </thead>
        <tbody>
          {filteredList.length > 0 ? (
            filteredList.map((item) => {
              const isActive = item.status === "Y";
              return (
                <tr
                  key={item.blId}
                  style={{
                    backgroundColor: isActive ? "#FFF5F5" : "white",
                    height: "45px",
                  }}
                >
                  <td
                    style={{
                      backgroundColor: isActive ? "#E03131" : "#f8f9fa",
                      color: isActive ? "white" : "#666",
                      fontWeight: isActive ? "bold" : "normal",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {item.blId}
                  </td>

                  {/* 🚀 이메일 클릭 시 회원 상세로 이동 (스타일 추가) */}
                  <td
                    onClick={() => handleClickMember(item.email)}
                    style={{
                      textAlign: "left",
                      paddingLeft: "15px",
                      borderBottom: "1px solid #eee",
                      cursor: "pointer",
                      color: "#1c7ed6", // 파란색 링크 톤
                      textDecoration: "underline",
                      fontWeight: "bold",
                    }}
                    title="클릭 시 회원 상세정보로 이동합니다"
                  >
                    {item.email}
                  </td>

                  <td style={{ borderBottom: "1px solid #eee" }}>
                    {item.reason}
                  </td>
                  <td style={{ borderBottom: "1px solid #eee" }}>
                    {item.adminId || "관리자"}
                  </td>
                  <td style={{ borderBottom: "1px solid #eee" }}>
                    {item.startDate?.split("T")[0]}
                  </td>
                  <td style={{ borderBottom: "1px solid #eee" }}>
                    {isActive
                      ? item.endDate
                        ? item.endDate.split("T")[0]
                        : "영구(차단중)"
                      : item.endDate
                        ? item.endDate.split("T")[0]
                        : "-"}
                  </td>
                  <td
                    style={{
                      color: isActive ? "#E03131" : "#adb5bd",
                      fontWeight: "bold",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {isActive ? "차단(Y)" : "해제(N)"}
                  </td>
                  <td style={{ borderBottom: "1px solid #eee" }}>
                    <button
                      onClick={() => handleClickRead(item.blId)}
                      style={{
                        padding: "6px 12px",
                        cursor: "pointer",
                        backgroundColor: isActive ? "#495057" : "#e9ecef",
                        color: isActive ? "white" : "#495057",
                        border: "1px solid #ced4da",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      상세보기
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan="8"
                style={{
                  padding: "50px",
                  color: "#adb5bd",
                  backgroundColor: "#fafafa",
                }}
              >
                데이터가 존재하지 않습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div
        style={{ marginTop: "30px", display: "flex", justifyContent: "center" }}
      >
        <PageComponent serverData={serverData} movePage={movePage} />
      </div>

      {showModal && (
        <BlackListModal blId={currentBlId} callbackFn={closeAfterAction} />
      )}
    </div>
  );
};

export default BlackListDashboard;
