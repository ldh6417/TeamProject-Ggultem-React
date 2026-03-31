import { useState } from "react";
import useCustomLogin from "../../hooks/useCustomLogin";
import ReactDOM from "react-dom";
import "./ChargeModal.css";

const ChargeModal = ({ isOpen, onClose, onChargeConfirm }) => {
  const [selectedAmount, setSelectedAmount] = useState(10000); // 기본값 1만원
  const { loginState } = useCustomLogin();

  if (!isOpen) return null;

  const amounts = [10000, 30000, 50000, 100000];

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      {/* 팝업 내부 클릭 시 닫히지 않게 stopPropagation 추가 */}
      <div
        className="charge-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>비즈머니 충전</h3>
          <button className="close-x" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-desc">광고 집행을 위한 비즈머니를 충전합니다.</p>

          <div className="amount-grid">
            {amounts.map((amount) => (
              <button
                key={amount}
                className={`amount-btn ${selectedAmount === amount ? "active" : ""}`}
                onClick={() => setSelectedAmount(amount)}
              >
                {amount.toLocaleString()}원
              </button>
            ))}
          </div>

          <div className="total-display">
            <span>최종 충전 금액</span>
            <strong>{selectedAmount.toLocaleString()}원</strong>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            취소
          </button>
          <button
            className="confirm-btn"
            onClick={() => onChargeConfirm(loginState.email, selectedAmount)}
          >
            충전하기
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ChargeModal;
