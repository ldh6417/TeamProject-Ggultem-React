import { useState } from "react";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
const getNum = (param, defaultValue) => {
  if (!param) {
    return defaultValue;
  }
  return parseInt(param);
};
// 문자열 파라미터 처리를 위한 보조 함수
const getString = (param, defaultValue) => {
  if (!param) return defaultValue;
  return param;
};

const useCustomMove = () => {
  const navigate = useNavigate();

  const [queryParams] = useSearchParams();
  const page = getNum(queryParams.get("page"), 1);
  const size = getNum(queryParams.get("size"), 10);
  const keyword = getString(queryParams.get("keyword"), "");
  const searchType = getString(queryParams.get("searchType"), "all");
  const enabled = getString(queryParams.get("enabled"), "all");
  const businessVerified = getString(
    queryParams.get("businessVerified"),
    "all",
  );
  const sign = getString(queryParams.get("sign"), "all");
  const category = getString(queryParams.get("category"), "all");
  const state = getString(queryParams.get("state"), "all");
  const queryDefault = createSearchParams({
    page,
    size,
    keyword,
    searchType,
  }).toString(); //새로 추가

  const [refresh, setRefresh] = useState(false);

  //********************************** Admin Member 영역 *************************************
  const moveToMemberList = (pageParam) => {
    let queryStr = "";
    if (pageParam) {
      const pageNum = getNum(pageParam.page, page);
      const sizeNum = getNum(pageParam.size, size);
      const keywordStr = getString(pageParam.keyword, keyword);
      const typeStr = getString(pageParam.searchType, searchType);
      const enabledStr = getString(pageParam.enabled, enabled);
      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
        keyword: keywordStr,
        searchType: typeStr,
        enabled: enabledStr,
      }).toString();
    } else {
      queryStr = queryDefault;
    }

    navigate({
      pathname: `../admin/member/list`,
      search: queryStr,
    });

    setRefresh(!refresh);
  };
  //********************************** Admin Banner 영역 *************************************
  const moveToBannerList = (pageParam) => {
    let queryStr = "";
    if (pageParam) {
      const pageNum = getNum(pageParam.page, page);
      const sizeNum = getNum(pageParam.size, size);
      const keywordStr = getString(pageParam.keyword, keyword);
      const typeStr = getString(pageParam.searchType, searchType);
      const enabledStr = getString(pageParam.enabled, enabled);
      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
        keyword: keywordStr,
        searchType: typeStr,
        enabled: enabledStr,
      }).toString();
    } else {
      queryStr = queryDefault;
    }

    navigate({
      pathname: `../admin/banner/list`,
      search: queryStr,
    });

    setRefresh(!refresh);
  };
  //********************************** Admin BusinessMember 영역 *************************************
  const moveToBusinessMemberList = (pageParam) => {
    let queryStr = "";
    if (pageParam) {
      const pageNum = getNum(pageParam.page, page);
      const sizeNum = getNum(pageParam.size, size);
      const keywordStr = getString(pageParam.keyword, keyword);
      const typeStr = getString(pageParam.searchType, searchType);
      const businessVerifiedStr = getString(
        pageParam.businessVerified,
        businessVerified,
      );
      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
        keyword: keywordStr,
        searchType: typeStr,
        businessVerified: businessVerifiedStr,
      }).toString();
    } else {
      queryStr = queryDefault;
    }

    navigate({
      pathname: `../admin/businessmember/list`,
      search: queryStr,
    });

    setRefresh(!refresh);
  };

  // ** Admin BlackList 영역 (추가됨) **

  // 1. 블랙리스트 목록으로 이동
  const moveToBlackListList = (pageParam) => {
    let queryStr = "";
    if (pageParam) {
      const pageNum = getNum(pageParam.page, page);
      const sizeNum = getNum(pageParam.size, size);
      const keywordStr = getString(pageParam.keyword, ""); // 검색 시 전달받은 값 우선
      const typeStr = getString(pageParam.searchType, "e");

      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
        keyword: keywordStr,
        searchType: typeStr,
      }).toString();
    } else {
      queryStr = queryDefault;
    }

    navigate({
      pathname: "../admin/blacklist/list",
      search: queryStr,
    });

    setRefresh(!refresh);
  };

  // 2. 블랙리스트 등록 화면으로 이동
  const moveToAdd = () => {
    navigate({
      pathname: "../admin/blacklist/add",
    });
  };

  // 3. 페이징 처리를 위한 단순 이동 함수
  const movePage = (pageParam) => {
    moveToBlackListList(pageParam);
  };

  //********************************** MyPage 영역 *************************************

  const moveToMyPageModify = () => {
    console.log(queryDefault);
    navigate({
      pathname: `../mypage/modify`,
      search: queryDefault, //수정시에 기존의 쿼리 스트링 유지를 위해
    });
  };

  //********************************** BusinessBoard 영역 *************************************
  const moveToBusinessList = (pageParam) => {
    let queryStr = "";
    if (pageParam) {
      const pageNum = getNum(pageParam.page, page);
      const sizeNum = getNum(pageParam.size, size);
      const keywordStr = getString(pageParam.keyword, keyword);
      const typeStr = getString(pageParam.searchType, searchType);
      const signStr = getString(pageParam.sign, sign);
      const categoryStr = getString(pageParam.category, category);
      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
        keyword: keywordStr,
        searchType: typeStr,
        sign: signStr,
        category: categoryStr,
      }).toString();
    } else {
      queryStr = queryDefault;
    }

    navigate({
      pathname: `../business/list`,
      search: queryStr,
    });

    setRefresh(!refresh);
  };

  const moveToBusinessBoardL = (pageParam) => {
    let queryStr = "";
    if (pageParam) {
      const pageNum = getNum(pageParam.page, page);
      const sizeNum = getNum(pageParam.size, size);
      const keywordStr = getString(pageParam.keyword, keyword);
      const typeStr = getString(pageParam.searchType, searchType);
      const signStr = getString(pageParam.sign, sign);
      const categoryStr = getString(pageParam.category, category);
      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
        keyword: keywordStr,
        searchType: typeStr,
        sign: signStr,
        category: categoryStr,
      }).toString();
    } else {
      queryStr = queryDefault;
    }

    navigate({
      pathname: `../business/board/list`,
      search: queryStr,
    });

    setRefresh(!refresh);
  };

  const moveToBusinessBoardDL = (pageParam) => {
    let queryStr = "";
    if (pageParam) {
      const pageNum = getNum(pageParam.page, page);
      const sizeNum = getNum(pageParam.size, size);
      const keywordStr = getString(pageParam.keyword, keyword);
      const typeStr = getString(pageParam.searchType, searchType);
      const signStr = getString(pageParam.sign, sign);
      const categoryStr = getString(pageParam.category, category);
      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
        keyword: keywordStr,
        searchType: typeStr,
        sign: signStr,
        category: categoryStr,
      }).toString();
    } else {
      queryStr = queryDefault;
    }

    navigate({
      pathname: `../business/board/deletelist`,
      search: queryStr,
    });

    setRefresh(!refresh);
  };

  const moveToBusinessBoardList = (pageParam) => {
    let queryStr = "";
    if (pageParam) {
      const pageNum = getNum(pageParam.page, page);
      const sizeNum = getNum(pageParam.size, size);
      const keywordStr = getString(pageParam.keyword, keyword);
      const typeStr = getString(pageParam.searchType, searchType);
      const signStr = getString(pageParam.sign, sign);
      const categoryStr = getString(pageParam.category, category);
      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
        keyword: keywordStr,
        searchType: typeStr,
        sign: signStr,
        category: categoryStr,
      }).toString();
    } else {
      queryStr = queryDefault;
    }

    navigate({
      pathname: `../admin/businessboard/list`,
      search: queryStr,
    });

    setRefresh(!refresh);
  };

  const moveToBusinessBoardRead = (no) => {
    navigate({
      pathname: `../admin/businessboard/read/${no}`,
      search: queryDefault, //수정시에 기존의 쿼리 스트링 유지를 위해
    });
  };

  const moveToBusinessBoardR = (no) => {
    navigate({
      pathname: `../business/board/${no}`,
      search: queryDefault, //수정시에 기존의 쿼리 스트링 유지를 위해
    });
  };

  const moveToBusinessBoardModify = (no) => {
    console.log(queryDefault);
    navigate({
      pathname: `../business/board/modify/${no}`,
      search: queryDefault, //수정시에 기존의 쿼리 스트링 유지를 위해
    });
  };

  //********************************** BizMoney 영역 *************************************
  const moveToBizMoneyList = (pageParam) => {
    let queryStr = "";
    if (pageParam) {
      // getString을 쓰지 말고 직접 체크해서 넣기!
      const pageNum = pageParam.page !== undefined ? pageParam.page : page;
      const sizeNum = pageParam.size !== undefined ? pageParam.size : size;
      const keywordStr =
        pageParam.keyword !== undefined ? pageParam.keyword : keyword; // ""도 값으로 인정!
      const typeStr =
        pageParam.searchType !== undefined ? pageParam.searchType : searchType;
      const stateStr = pageParam.state !== undefined ? pageParam.state : state;
      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
        keyword: keywordStr,
        searchType: typeStr,
        state: stateStr,
      }).toString();
    } else {
      queryStr = queryDefault;
    }

    navigate({
      pathname: `../business/bizmoney`,
      search: queryStr,
    });

    setRefresh(!refresh);
  };

  const moveToAdminBizMoneyList = (pageParam) => {
    let queryStr = "";
    if (pageParam) {
      // getString을 쓰지 말고 직접 체크해서 넣기!
      const pageNum = pageParam.page !== undefined ? pageParam.page : page;
      const sizeNum = pageParam.size !== undefined ? pageParam.size : size;
      const keywordStr =
        pageParam.keyword !== undefined ? pageParam.keyword : keyword; // ""도 값으로 인정!
      const typeStr =
        pageParam.searchType !== undefined ? pageParam.searchType : searchType;
      const stateStr = pageParam.state !== undefined ? pageParam.state : state;
      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
        keyword: keywordStr,
        searchType: typeStr,
        state: stateStr,
      }).toString();
    } else {
      queryStr = queryDefault;
    }

    navigate({
      pathname: `../admin/bizmoney/list`,
      search: queryStr,
    });

    setRefresh(!refresh);
  };

  //********************************** Board 영역 *************************************

  const moveToBoardList = (pageParam) => {
    let queryStr = "";
    if (pageParam) {
      const pageNum = getNum(pageParam.page, page);
      const sizeNum = getNum(pageParam.size, size);
      const keywordStr = getString(pageParam.keyword, keyword);
      const typeStr = getString(pageParam.searchType, searchType);
      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
        keyword: keywordStr,
        searchType: typeStr,
      }).toString();
    } else {
      queryStr = queryDefault;
    }

    navigate({
      pathname: `../board/list`,
      search: queryStr,
    });

    setRefresh(!refresh);
  };
  // ******************************* 사용자 Notice 영역 *************************************

  // 1. 사용자용 공지사항 목록으로 이동
  const moveToNoticeList = (pageParam) => {
    let queryStr = "";

    if (pageParam) {
      // 파라미터가 있을 때 (페이징, 검색 조건 유지)
      const pageNum = getNum(pageParam.page, page);
      const sizeNum = getNum(pageParam.size, size);
      const keywordStr = getString(pageParam.keyword, keyword);
      const typeStr = getString(pageParam.searchType, searchType);

      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
        keyword: keywordStr,
        searchType: typeStr,
      }).toString();
    } else {
      // 파라미터가 없을 때 (기본값 사용)
      queryStr = queryDefault;
    }

    navigate({
      pathname: `../notice/list`, // '/admin'을 제거하고 상대 경로 혹은 절대 경로로 수정
      search: queryStr,
    });

    setRefresh(!refresh);
  };

  // 2. 사용자용 공지사항 상세 조회 이동
  const moveToNoticeRead = (noticeId) => {
    navigate({
      pathname: `../notice/read/${noticeId}`,
    });
  };

  //********************************** Admin Notice 영역 *************************************

  // 1. 관리자 목록으로 이동
  const moveToAdminNoticeList = (pageParam) => {
    let queryStr = "";

    if (pageParam) {
      // 파라미터가 있을 때 (페이징, 검색 조건 유지)
      const pageNum = getNum(pageParam.page, page);
      const sizeNum = getNum(pageParam.size, size);
      const keywordStr = getString(pageParam.keyword, keyword);
      const typeStr = getString(pageParam.searchType, searchType);

      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
        keyword: keywordStr,
        searchType: typeStr,
      }).toString();
    } else {
      // 파라미터가 없을 때 (기본값 사용)
      queryStr = queryDefault;
    }

    navigate({
      pathname: `/admin/notice/list`,
      search: queryStr,
    });

    setRefresh(!refresh);
  };

  // 2. 관리자용 상세 조회 이동
  const moveToAdminNoticeRead = (noticeId) => {
    navigate({
      pathname: `/admin/notice/read/${noticeId}`,
      search: queryDefault,
    });
  };

  // 3. 관리자용 수정 화면 이동
  const moveToAdminNoticeModify = (noticeId) => {
    navigate({
      pathname: `/admin/notice/modify/${noticeId}`,
      search: queryDefault,
    });
  };

  // 4. 관리자용 등록 화면 이동
  const moveToAdminNoticeRegister = () => {
    navigate({
      pathname: `/admin/notice/register`,
    });
  };

  //********************************** Admin CodeGrouo 영역 *************************************

  const moveToCodeGroupList = (pageParam) => {
    let queryStr = "";
    if (pageParam) {
      const pageNum = getNum(pageParam.page, page);
      const sizeNum = getNum(pageParam.size, size);
      const keywordStr = getString(pageParam.keyword, keyword);
      const typeStr = getString(pageParam.searchType, searchType);
      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
        keyword: keywordStr,
        searchType: typeStr,
      }).toString();
    } else {
      queryStr = queryDefault;
    }

    navigate({
      pathname: `../admin/codegroup/list`,
      search: queryStr,
    });

    setRefresh(!refresh);
  };

  const moveToDetailCodeList = (groupCode, pageParam) => {
    let queryStr = "";
    if (pageParam) {
      const pageNum = getNum(pageParam.page, page);
      const sizeNum = getNum(pageParam.size, size);
      const keywordStr = getString(pageParam.keyword, keyword);
      const typeStr = getString(pageParam.searchType, searchType);
      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
        keyword: keywordStr,
        searchType: typeStr,
      }).toString();
    } else {
      queryStr = queryDefault;
    }

    navigate({
      pathname: `../admin/codegroup/read/${groupCode}`,
      search: queryStr,
    });

    setRefresh(!refresh);
  };

  // ******************************* ProcessedReport 영역 *************************************
  const moveToRead = (reportId) => {
    navigate({
      pathname: `../read/${reportId}`,
      search: queryDefault, // 페이지 번호 유지용
    });
  };

  return {
    moveToCodeGroupList,
    moveToDetailCodeList,
    moveToAdminNoticeList,
    moveToAdminNoticeRead,
    moveToAdminNoticeModify,
    moveToAdminNoticeRegister,
    moveToNoticeRead,
    moveToNoticeList,
    moveToBusinessList,
    moveToBusinessBoardL,
    moveToBusinessBoardDL,
    moveToBusinessBoardR,
    moveToBusinessBoardList,
    moveToBusinessBoardRead,
    moveToBusinessBoardModify,
    moveToBizMoneyList,
    moveToAdminBizMoneyList,
    moveToMemberList,
    moveToBusinessMemberList,
    moveToMyPageModify,
    moveToBoardList,
    moveToBlackListList,
    moveToBannerList,
    moveToAdd,
    movePage,
    moveToRead,
    page,
    size,
    keyword,
    searchType,
    enabled,
    businessVerified,
    category,
    sign,
    state,
    refresh,
  };
};

export default useCustomMove;
