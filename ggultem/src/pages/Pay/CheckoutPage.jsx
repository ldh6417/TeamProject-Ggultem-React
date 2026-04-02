import { loadTossPayments } from "@tosspayments/tosspayments-sdk";

import { useEffect, useMemo, useState } from "react";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

export function CheckoutPage({ email, companyName }) {
  const customerKey = useMemo(() => email.replace(/[@.]/g, "_"), [email]);
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState({
    currency: "KRW",
    value: 0,
  });

  const [ready, setReady] = useState(false);

  const [widgets, setWidgets] = useState(null);

  useEffect(() => {
    async function fetchPaymentWidgets() {
      const tossPayments = await loadTossPayments(clientKey);

      const widgets = tossPayments.widgets({
        customerKey,
      });

      setWidgets(widgets);
    }

    fetchPaymentWidgets();
  }, [customerKey]);

  // Step 2로 넘어갔을 때만 위젯 렌더링
  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null || step !== 2) return;

      setReady(false);

      try {
        await widgets.setAmount(amount);

        // 🚩 Promise.all을 통해 UI 요소들을 다시 렌더링
        await Promise.all([
          widgets.renderPaymentMethods({
            selector: "#payment-method",
            variantKey: "DEFAULT",
          }),
          widgets.renderAgreement({
            selector: "#agreement",
            variantKey: "AGREEMENT",
          }),
        ]);

        setReady(true); // 이제 결제 버튼 활성화
      } catch (error) {
        console.error("위젯 렌더링 에러:", error);
      }
    }
    renderPaymentWidgets();
  }, [widgets, step]); // step이 2가 될 때 실행

  useEffect(() => {
    if (widgets == null || !ready) {
      return;
    }
    widgets.setAmount(amount);
  }, [widgets, amount, ready]);

  return (
    <div className="wrapper">
      {step === 1 ? (
        /* [1단계] 금액 선택 화면 */
        <div className="step-container">
          <h4 className="step-title">충전하실 금액을 선택해주세요</h4>
          <div className="amount-select-group">
            {[10000, 30000, 50000, 100000, 200000, 500000].map((val) => (
              <button
                key={val}
                className={`amount-btn ${amount.value === val ? "active" : ""}`}
                onClick={() => setAmount({ ...amount, value: Number(val) })}
              >
                {val.toLocaleString()}원
              </button>
            ))}
          </div>
          <div className="custom-amount-input-wrapper">
            <input
              type="number"
              className="custom-amount-input"
              placeholder="금액 직접 입력 (원)"
              value={amount.value || ""}
              onChange={(e) => {
                const val = e.target.value === "" ? 0 : Number(e.target.value);
                setAmount((prev) => ({ ...prev, value: val }));
              }}
            />
            <span className="unit">원</span>
          </div>

          <button
            className="next-button"
            onClick={() => {
              if (amount.value < 1000) {
                alert("최소 충전 금액은 1,000원입니다. 🍯");
                return;
              }
              setStep(2);
            }}
          >
            {amount.value.toLocaleString()}원 결제하러 가기
          </button>
        </div>
      ) : (
        /* [2단계] 결제 수단 선택 화면 */
        <div className="step-container">
          <div id="payment-method" />
          <div id="agreement" />
          <button
            className="pay-button"
            disabled={!ready}
            onClick={async () => {
              try {
                const orderId = `ORDER_${new Date().getTime()}`;
                await widgets.requestPayment({
                  orderId: orderId,
                  orderName: `꿀템 비즈머니 ${amount.value.toLocaleString()}원 충전`,
                  successUrl:
                    window.location.origin + "/business/bizmoney/success",
                  failUrl: window.location.origin + "/business/bizmoney/fail",
                  customerEmail: email,
                  customerName: companyName || "비즈니스회원",
                });
              } catch (error) {
                console.error(error);
              }
            }}
          >
            {amount.value.toLocaleString()}원 결제하기
          </button>
        </div>
      )}
    </div>
  );
}
