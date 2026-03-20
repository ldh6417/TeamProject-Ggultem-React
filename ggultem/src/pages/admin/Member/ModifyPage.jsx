import React from "react";
import "./ReadPage.css";
import ModifyComponent from "../../../components/admin/Member/ModifyComponent";
import Menu from "../../../include/admin/Menu"; // Menu 임포트 확인!
import { useParams } from "react-router-dom";

const ReadPage = () => {
  const { email } = useParams();

  return (
    <div className="memberinfo-page-wrapper">
      <Menu />
      <main className="memberinfo-main-content">
        <div className="memberinfo-hero-section">
          {/* 상세 컴포넌트에 이메일 전달 */}
          <ModifyComponent email={email} />
        </div>
      </main>
    </div>
  );
};

export default ReadPage;
