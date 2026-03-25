import { useRef, useState } from "react";
import { postAdd } from "../../../api/admin/NoticeApi";
import useCustomMove from "../../../hooks/useCustomMove";
import "./RegisterComponent.css";

const RegisterComponent = () => {
  // 1. 초기 상태에 isPinned: 0(일반 공지) 추가
  const [notice, setNotice] = useState({
    title: "",
    content: "",
    isPinned: 0,
  });

  const uploadRef = useRef(); // 파일 선택창 참조
  const { moveToAdminNoticeList } = useCustomMove();

  // 2. 입력 핸들러: 일반 텍스트와 체크박스를 구분하여 상태 업데이트
  const handleChangeNotice = (e) => {
    const { name, value, type, checked } = e.target;

    setNotice({
      ...notice,
      // 타입이 checkbox면 checked 여부에 따라 1(활성) 또는 0(일반) 세팅
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleClickAdd = () => {
    const files = uploadRef.current.files;
    const formData = new FormData();

    // 파일 첨부
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    // 데이터 첨부
    formData.append("title", notice.title);
    formData.append("content", notice.content);
    formData.append("memberEmail", "admin@honey.com"); // 관리자 계정
    formData.append("enabled", 1); // 게시글 활성 상태

    // 3. 현재 상태값(0 또는 1)을 서버로 전송
    formData.append("isPinned", notice.isPinned);

    postAdd(formData)
      .then((data) => {
        alert("공지사항이 등록되었습니다.");
        moveToAdminNoticeList();
      })
      .catch((err) => {
        console.error("등록 중 에러 발생", err);
        alert("등록에 실패했습니다. 다시 시도해주세요.");
      });
  };

  return (
    <div className="notice-reg-wrapper">
      <div className="notice-reg-container">
        <h2 className="notice-reg-title">공지사항 등록</h2>

        <div className="notice-reg-form">
          {/* 제목 입력 */}
          <div className="form-group">
            <label>제목</label>
            <input
              className="form-input"
              name="title"
              type="text"
              placeholder="공지사항 제목을 입력하세요"
              value={notice.title}
              onChange={handleChangeNotice}
            />
          </div>

          {/* 상단 고정 체크박스 영역 */}
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isPinned"
                // 1이면 체크된 상태, 0이면 해제된 상태로 동기화
                checked={notice.isPinned === 1}
                onChange={handleChangeNotice}
              />
              <span className="checkbox-text">
                상단 고정 공지로 설정 (활성화)
              </span>
            </label>
          </div>

          {/* 내용 입력 */}
          <div className="form-group">
            <label>내용</label>
            <textarea
              className="form-textarea"
              name="content"
              placeholder="공지사항 내용을 상세히 입력하세요"
              value={notice.content}
              onChange={handleChangeNotice}
            />
          </div>

          {/* 이미지 첨부 */}
          <div className="form-group">
            <label>이미지 첨부</label>
            <input
              ref={uploadRef}
              className="form-file"
              type="file"
              multiple={true}
              accept="image/*"
            />
          </div>

          {/* 버튼 영역 */}
          <div className="form-actions">
            <button className="cancel-btn" onClick={moveToAdminNoticeList}>
              취소
            </button>
            <button className="submit-btn" onClick={handleClickAdd}>
              등록하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterComponent;
