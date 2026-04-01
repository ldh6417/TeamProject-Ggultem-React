import React from "react";
import "./ReadPage.css";
import ModifyComponent from "../../../components/admin/Banner/ModifyComponent";
import Menu from "../../../include/admin/Menu"; // Menu 임포트 확인!
import { useParams } from "react-router-dom";

const ReadPage = () => {
  const { no } = useParams();

  return (
    <div className="mainbanner-page-wrapper">
      <Menu />
      <main className="mainbanner-main-content">
        <div className="mainbanner-hero-section">
          <ModifyComponent no={no} />
        </div>
      </main>
    </div>
  );
};

export default ReadPage;
