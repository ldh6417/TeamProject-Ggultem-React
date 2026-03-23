import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { getOne, putOne, API_SERVER_HOST } from "../../api/ItemBoardApi";
import useCustomLogin from "../../hooks/useCustomLogin";
import "./ItemBoardModifyComponent.css"; // 별도의 CSS 파일 추천

const host = API_SERVER_HOST;

const initState = {
  id: 0,
  title: "",
  price: 0,
  content: "",
  category: "",
  location: "",
  uploadFileNames: [],
};

const ItemBoardModifyComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loginState } = useCustomLogin();
  const uploadRef = useRef();

  const [item, setItem] = useState({ ...initState });
  const [fetching, setFetching] = useState(false);

  // 삭제할 기존 이미지 목록 관리
  const [removedFileNames, setRemovedFileNames] = useState([]);

  useEffect(() => {
    getOne(id).then((data) => {
      // 본인 확인 (보안 강화)
      if (loginState.email !== data.email) {
        alert("수정 권한이 없습니다.");
        navigate(`/itemBoard/read/${id}`);
        return;
      }
      setItem(data);
      setFetching(false);
    });
  }, [id, loginState.email, navigate]);

  const handleChangeItem = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  // 기존 이미지 삭제 버튼 클릭 시 (화면에서만 숨기고 목록에 기록)
  const handleClickRemoveFile = (fileName) => {
    setRemovedFileNames([...removedFileNames, fileName]);
    const updatedFiles = item.uploadFileNames.filter(
      (name) => name !== fileName,
    );
    setItem({ ...item, uploadFileNames: updatedFiles });
  };

  const handleClickModify = () => {
    const files = uploadRef.current.files;
    const formData = new FormData();

    // 새 이미지 파일 추가
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    // 기존 데이터 추가
    formData.append("title", item.title);
    formData.append("price", Number(item.price));
    formData.append("content", item.content);
    formData.append("category", item.category);
    formData.append("location", item.location);

    // 유지할 기존 이미지 파일명 목록 추가
    for (let i = 0; i < item.uploadFileNames.length; i++) {
      formData.append("uploadFileNames", item.uploadFileNames[i]);
    }

    setFetching(true);
    putOne(id, formData)
      .then((data) => {
        setFetching(false);
        alert("상품 정보가 수정되었습니다.");
        navigate(`/itemBoard/read/${id}`);
      })
      .catch((err) => {
        setFetching(false);
        alert("수정 중 오류가 발생했습니다.");
      });
  };

  if (fetching && !item.title)
    return <div className="loading">데이터 로딩 중...</div>;

  return (
    <div className="modify-container">
      <div className="modify-form">
        <h2>상품 정보 수정</h2>

        <div className="form-group">
          <label>제목</label>
          <input
            name="title"
            type="text"
            value={item.title}
            onChange={handleChangeItem}
          />
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

        <div className="form-group">
          <label>카테고리</label>
          <select
            name="category"
            value={item.category}
            onChange={handleChangeItem}
          >
            <option value="">선택하세요</option>
            <option value="electronics">전자제품</option>
            <option value="clothing">의류</option>
            <option value="sports">스포츠</option>
            <option value="books">도서</option>
            <option value="health">건강식품</option>
            <option value="furniture">가구</option>
          </select>
        </div>

        <div className="form-group">
          <label>거래 지역</label>
          <input
            name="location"
            type="text"
            value={item.location}
            onChange={handleChangeItem}
          />
        </div>

        <div className="form-group">
          <label>상세 설명</label>
          <textarea
            name="content"
            value={item.content}
            onChange={handleChangeItem}
            rows="5"
          ></textarea>
        </div>

        <div className="form-group">
          <label>이미지 추가</label>
          <input ref={uploadRef} type="file" multiple={true} accept="image/*" />
        </div>

        <div className="form-group">
          <label>기존 이미지 (클릭 시 삭제)</label>
          <div className="modify-image-list">
            {item.uploadFileNames.map((fileName, idx) => (
              <div
                key={idx}
                className="modify-image-item"
                onClick={() => handleClickRemoveFile(fileName)}
              >
                <img src={`${host}/itemBoard/view/s_${fileName}`} alt="item" />
                <div className="delete-overlay">삭제</div>
              </div>
            ))}
          </div>
        </div>

        <div className="modify-btn-group">
          <button
            className="modify-submit-btn"
            onClick={handleClickModify}
            disabled={fetching}
          >
            수정 완료
          </button>
          <button className="modify-cancel-btn" onClick={() => navigate(-1)}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemBoardModifyComponent;
