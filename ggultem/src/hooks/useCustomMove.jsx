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
  //********************************** MyPage 영역 *************************************

  const moveToMyPageModify = () => {
    console.log(queryDefault);
    navigate({
      pathname: `../mypage/modify`,
      search: queryDefault, //수정시에 기존의 쿼리 스트링 유지를 위해
    });
  };

  //********************************** BusinessBoard 영역 *************************************

  const moveToBusinessBoardList = (pageParam) => {
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
      pathname: `../business/board/list`,
      search: queryStr,
    });

    setRefresh(!refresh);
  };

  const moveToBusinessBoardRead = (no) => {
    navigate({
      pathname: `../business/board/read/${no}`,
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

  return {
    moveToCodeGroupList,
    moveToDetailCodeList,
    moveToAdminNoticeList,
    moveToAdminNoticeRead,
    moveToAdminNoticeModify,
    moveToAdminNoticeRegister,
    moveToNoticeRead,
    moveToNoticeList,
    moveToBusinessBoardList,
    moveToBusinessBoardRead,
    moveToBusinessBoardModify,
    moveToMemberList,
    moveToBusinessMemberList,
    moveToMyPageModify,
    moveToBoardList,
    page,
    size,
    keyword,
    searchType,
    enabled,
    businessVerified,
    refresh,
  };
};

export default useCustomMove;
