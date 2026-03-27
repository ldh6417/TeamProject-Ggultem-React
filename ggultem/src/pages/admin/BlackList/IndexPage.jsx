import React from "react";
import { useNavigate } from "react-router-dom"; // 👈 이동 기능을 위해 추가
import BlackListDashboard from "../../../components/admin/BlackList/BlackListDashboard";
import "./IndexPage.css";

const IndexPage = () => {
  const navigate = useNavigate();

  return (
    /* 기준점을 잡기 위해 relative를 유지하고, overflow를 방지합니다. */
    <div
      className="p-4 w-full bg-white relative"
      style={{ position: "relative" }}
    >
      {/* 🚀 우측 상단 강제 고정 탭 */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 100,
        }}
      >
        <button
          onClick={() => navigate("/admin")} // 👈 관리자 메뉴 경로
          style={{
            padding: "10px 20px",
            backgroundColor: "#f8f9fa",
            color: "#333",
            fontWeight: "bold",
            border: "1px solid #ddd",
            borderRadius: "8px",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          🏠 관리자 메뉴로
        </button>
      </div>

      <div className="text-3xl font-extrabold mb-6">블랙리스트 관리 시스템</div>
      <BlackListDashboard />
    </div>
  );
};

export default IndexPage;
