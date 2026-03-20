import { useRef, useState } from "react";
import { postAdd } from "../../api/ItemBoardApi";
import "./ItemBoardRegisterComponent.css";
import { useNavigate } from "react-router";

// ✅ 1. 컴포넌트 외부 초기값 (정석)
const initState = {
  title: "",
  writer: "",
  price: 0,
  content: "",
  category: "디지털기기",
  location: "",
};

const ItemBoardRegister = () => {
  // ✅ 2. setItem은 오직 여기서 한 번만 선언 (중복 에러 방지)
  const [item, setItem] = useState({ ...initState });
  const [fetching, setFetching] = useState(false);
  const navigate = useNavigate();
  const uploadRef = useRef();

  const handleChangeItem = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleClickAdd = () => {
    // 🔍 3. 로컬스토리지 데이터 확인 (모든 가능성 체크)
    // 카카오 로그인 시 'member'라는 키로 저장했는지 확인이 필요합니다.
    const savedMember = localStorage.getItem("member");

    console.log("검사 시작 - 로컬스토리지 원본:", savedMember);

    if (!savedMember) {
      alert(
        "로그인 정보가 브라우저에 저장되지 않았습니다. 다시 로그인해주세요.",
      );
      // 현재 로컬스토리지에 뭐가 들어있는지 콘솔에 다 찍어버립니다 (범인 찾기용)
      console.log("현재 로컬스토리지 전체 내용:", { ...localStorage });
      return;
    }

    const memberInfo = JSON.parse(savedMember);
    console.log("파싱된 멤버 객체:", memberInfo);

    // 🔍 4. 이메일 추출 (memberInfo 구조에 따라 email 또는 id 등으로 갈릴 수 있음)
    // 카카오 로그인 성공 데이터의 필드명을 확인해서 email이 아니면 고쳐야 합니다.
    const loginEmail = memberInfo.email || memberInfo.id;
    const loginNickname = memberInfo.nickname || memberInfo.pname || "익명";

    if (!loginEmail) {
      alert(
        "데이터는 있으나 'email' 필드를 찾을 수 없습니다. 콘솔을 확인하세요.",
      );
      return;
    }

    const files = uploadRef.current.files;
    const formData = new FormData();

    // 파일 추가
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
    }

    // ✅ 5. 서버 DTO 필드명 전송 (보내주신 DTO 구조에 맞춤)
    formData.append("email", loginEmail);
    formData.append("writer", loginNickname);
    formData.append("title", item.title);
    formData.append("price", item.price);
    formData.append("content", item.content);
    formData.append("category", item.category);
    formData.append("location", item.location);

    setFetching(true);

    postAdd(formData)
      .then(() => {
        setFetching(false);
        alert("상품이 등록되었습니다!");
        navigate("/itemBoard/list");
      })
      .catch((err) => {
        setFetching(false);
        console.error("서버 응답 에러:", err.response?.data);
        alert("등록 중 오류 발생! 서버 파라미터를 확인하세요.");
      });
  };

  return (
    <div className="register-container">
      {fetching && <div className="loading-overlay">등록 중...</div>}

      <div className="register-header">
        <h2>중고 물품 등록</h2>
      </div>

      <div className="register-form">
        <div className="form-group">
          <label>상품 이미지</label>
          <input type="file" ref={uploadRef} multiple />
        </div>

        <div className="form-group">
          <label>제목</label>
          <input
            name="title"
            value={item.title}
            onChange={handleChangeItem}
            placeholder="제목을 입력하세요"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>카테고리</label>
            <select
              name="category"
              value={item.category}
              onChange={handleChangeItem}
            >
              <option value="디지털기기">디지털기기</option>
              <option value="생활가전">생활가전</option>
              <option value="의류">의류</option>
              <option value="잡화">잡화</option>
            </select>
          </div>
          <div className="form-group">
            <label>가격</label>
            <input
              name="price"
              type="number"
              value={item.price}
              onChange={handleChangeItem}
            />
          </div>
        </div>

        <div className="form-group">
          <label>장소</label>
          <input
            name="location"
            value={item.location}
            onChange={handleChangeItem}
            placeholder="거래 장소"
          />
        </div>

        <div className="form-group">
          <label>설명</label>
          <textarea
            name="content"
            rows="10"
            value={item.content}
            onChange={handleChangeItem}
          />
        </div>

        <div className="button-group">
          <button onClick={() => navigate("/itemBoard/list")}>취소</button>
          <button onClick={handleClickAdd}>등록하기</button>
        </div>
      </div>
    </div>
  );
};

export default ItemBoardRegister;
