import ReactDOM from "react-dom";
import { CheckoutPage } from "../../pages/Pay/CheckoutPage";
import "./ChargeModal.css";

const ChargeModal = ({ isOpen, onClose, member }) => {
  if (!isOpen) return null;

  return (
    // createPortal을 빼고 그냥 div로 감싸서 리턴하세요!
    <div className="charge-modal-overlay" onClick={onClose}>
      <div
        className="charge-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          X
        </button>

        {/* 아까 만든 토스 결제 컴포넌트 호출 */}
        <CheckoutPage email={member.email} nickname={member.nickname} />
      </div>
    </div>
  );
};

export default ChargeModal;
