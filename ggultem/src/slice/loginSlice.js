import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginPost } from "../api/MemberApi";
import { setCookie, getCookie, removeCookie } from "../util/cookieUtil";

const initState = {
  email: "",
};

const loadMemberCookie = () => {
  //쿠키에서 로그인 정보 로딩
  const memberInfo = getCookie("member");
  //닉네임 처리
  if (memberInfo && memberInfo.nickname) {
    // %ED%99%8D%EA%B8%B8%EB%8F%99 => 홍길동
    memberInfo.nickname = decodeURIComponent(memberInfo.nickname);
  }
  return memberInfo;
};

export const loginPostAsync = createAsyncThunk("loginPostAsync", (param) => {
  return loginPost(param);
});

const loginSlice = createSlice({
  name: "LoginSlice",
  initialState: loadMemberCookie() || initState,
  reducers: {
    login: (state, action) => {
      if (action.payload && !action.payload.error) {
        setCookie("member", JSON.stringify(action.payload), 1);
      }
      return action.payload;
    },
    logout: (state, action) => {
      removeCookie("member");
      return { ...initState };
    },
    // ✨ 추가: 회원 정보 수정 시 리덕스 상태와 쿠키를 동시에 바꾸는 액션
    update: (state, action) => {
      const payload = action.payload; // 서버에서 받은 '수정된' 회원 정보
      // 1. 쿠키를 새 정보로 덮어씁니다.
      setCookie("member", JSON.stringify(payload), 1);
      // 2. 리덕스 상태를 새 정보로 리턴합니다.
      return payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginPostAsync.fulfilled, (state, action) => {
      console.log("fulfilled : 완료" + action.payload.nickname);
      if (!action.payload.error) {
        setCookie("member", JSON.stringify(action.payload), 1);
      }
      return action.payload;
    });
    builder.addCase(loginPostAsync.pending, (state, action) => {
      console.log("pending : 처리중");
    });
    builder.addCase(loginPostAsync.rejected, (state, action) => {
      console.log("rejected : 오류");
    });
  },
});

export const { login, logout } = loginSlice.actions;
export default loginSlice.reducer;
