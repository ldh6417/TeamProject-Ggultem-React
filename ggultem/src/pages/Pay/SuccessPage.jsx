import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useCustomLogin from "../../hooks/useCustomLogin";

export function SuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginState } = useCustomLogin();
  const email = loginState.email;

  useEffect(() => {
    // 1. URL에서 토스가 보낸 파라미터 추출
    const requestData = {
      orderId: searchParams.get("orderId"),
      amount: searchParams.get("amount"),
      paymentKey: searchParams.get("paymentKey"),
      email,
    };

    axios
      .post(
        "http://localhost:8080/businessmember/admin/charge/confirm",
        requestData,
      )
      .then((res) => {
        alert("비즈머니 충전이 완료되었습니다!");
        navigate("/business/bizmoney"); // 내역 리스트로 이동
      })
      .catch((err) => {
        console.error("결제 승인 실패:", err);
        navigate("/business/bizmoney/fail");
      });
  }, [navigate, searchParams, email]);

  return <div>결제 승인 중입니다. 잠시만 기다려주세요...</div>;
}

export default SuccessPage;
