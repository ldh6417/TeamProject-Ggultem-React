import React, { useEffect, useState } from "react";
import {
  getListByGroup,
  deleteDetailOne,
  putDetailOne,
} from "../../api/admin/CodeDetailApi";
import useCustomMove from "../../hooks/useCustomMove";
import { useNavigate } from "react-router";
import PageComponent from "../common/PageComponent";
import "./DetailListComponent.css";

const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0,
};

const DetailListComponent = ({ groupCode, refresh, changeRefresh }) => {
  const [editDetail, setEditDetail] = useState(null); // 현재 수정 중인 데이터 상태

  const { page, size, keyword, searchType, moveToDetailCodeList } =
    useCustomMove();
  const [serverData, setServerData] = useState(initState);
  const [codeSearchType, setCodeSearchType] = useState("all");
  const [codeKeyword, setCodeKeyword] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    getListByGroup({ page, size, keyword, searchType }, groupCode)
      .then((data) => {
        console.log(data);
        setServerData(data);
      })
      .catch((err) => console.error("데이터 호출 에러:", err));
  }, [groupCode, page, size, keyword, searchType, refresh]);

  const handleSearch = (e) => {
    e.preventDefault();
    // 선택한 카테고리와 키워드를 가지고 이동
    moveToDetailCodeList(
      {
        page,
        size,
        keyword: codeKeyword,
        searchType: codeSearchType,
      },
      groupCode,
    );
  };

  const handleReset = () => {
    setCodeKeyword(""); // 입력창 비우기
    setCodeSearchType("all");

    nav(`/admin/codegroup/read/${groupCode}`);
  };

  // 수정 버튼 클릭 시 해당 행을 수정 모드로 변경
  const startEdit = (detail) => {
    setEditDetail({ ...detail });
  };

  // 수정 취소
  const cancelEdit = () => {
    setEditDetail(null);
  };

  // 입력값 변경 핸들러
  const handleEditChange = (e) => {
    setEditDetail({ ...editDetail, [e.target.name]: e.target.value });
  };

  // 수정 저장 (PUT)
  const handleSave = () => {
    putDetailOne(editDetail).then(() => {
      alert("수정되었습니다.");
      setEditDetail(null);
      changeRefresh(); // 목록 새로고침
    });
  };

  const handleDelete = (codeValue) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteDetailOne(groupCode, codeValue).then(() => {
        alert("삭제 완료");
        changeRefresh();
      });
    }
  };

  return (
    <div className="detail-list-wrapper">
      <div className="detail-list-header">
        <h4>📋 상세 코드 목록</h4>
        {/* 검색 폼 (생략 가능, 필요시 상단 배치) */}
      </div>

      <table className="detail-table">
        <thead>
          <tr>
            <th style={{ width: "20%" }}>상세 코드</th>
            <th style={{ width: "40%" }}>상세 명칭</th>
            <th style={{ width: "10%" }}>사용</th>
            <th style={{ width: "20%" }}>관리</th>
          </tr>
        </thead>
        <tbody>
          {serverData.dtoList && serverData.dtoList.length > 0 ? (
            serverData.dtoList.map((d) => (
              <tr key={d.codeValue}>
                {editDetail && editDetail.codeValue === d.codeValue ? (
                  <>
                    <td>
                      <strong>{d.codeValue}</strong>
                    </td>
                    <td>
                      <input
                        name="codeName"
                        value={editDetail.codeName}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <select
                        name="useYn"
                        value={editDetail.useYn}
                        onChange={handleEditChange}
                      >
                        <option value="Y">Y</option>
                        <option value="N">N</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="detail-btn btn-save"
                        onClick={handleSave}
                      >
                        저장
                      </button>
                      <button
                        className="detail-btn btn-cancel"
                        onClick={cancelEdit}
                      >
                        취소
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{d.codeValue}</td>
                    <td>{d.codeName}</td>
                    <td>{d.useYn === "Y" ? "✅ 사용 중" : "❌사용 안함"}</td>
                    <td>
                      <button
                        className="detail-btn btn-edit"
                        onClick={() => startEdit(d)}
                      >
                        수정
                      </button>
                      <button
                        className="detail-btn btn-delete"
                        onClick={() => handleDelete(d.codeValue)}
                      >
                        삭제
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="empty-list">
                등록된 상세 코드가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="detail-pagination">
        <PageComponent
          serverData={serverData}
          movePage={moveToDetailCodeList}
        />
      </div>
    </div>
  );
};

export default DetailListComponent;
