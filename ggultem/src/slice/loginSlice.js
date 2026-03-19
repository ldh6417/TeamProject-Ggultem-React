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
