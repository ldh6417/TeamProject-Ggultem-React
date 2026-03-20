import { useEffect, useState } from "react";
import {
  getReplyList,
  addReply,
  modifyReply,
  removeReply
} from "../../api/BoardReplyApi";
import { useSelector } from "react-redux";

const BoardReplyComponent = ({ boardNo }) => {

  const [replyList, setReplyList] = useState([]);
  const [content, setContent] = useState("");

  const [openReplyNo, setOpenReplyNo] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  const [modifyReplyNo, setModifyReplyNo] = useState(null);
  const [modifyContent, setModifyContent] = useState("");

  //  로그인 유저 정보 가져오기
  const loginState = useSelector(state => state.loginSlice);
  console.log("🔥 loginState:", loginState);
  const email = loginState?.email;

  // 댓글 리스트
  const loadReplies = () => {
    getReplyList(boardNo).then((data) => {
      console.log("🔥 댓글 데이터:", data);
      setReplyList(data);
    });
  };

  useEffect(() => {
    loadReplies();
  }, [boardNo]);

  // 일반 댓글 등록
  const handleAddReply = () => {
    if (!email) {
      alert("로그인이 필요한 서비스 입니다.");
      return;
    }

    if (!content.trim()) {
      alert("내용을 입력하시기 바랍니다.");
      return;
    }

    const replyObj = {
      boardNo,
      content,
      email,
      parentReplyNo: null
    };

    addReply(replyObj).then(() => {
      setContent("");
      loadReplies();
    });
  };

  // 대댓글 등록
  const handleAddChildReply = (parentNo) => {
    if (!email) {
      alert("로그인이 필요한 서비스 입니다.");
      return;
    }

    if (!replyContent.trim()) {
      alert("내용을 입력하시기 바랍니다.");
      return;
    }

    const replyObj = {
      boardNo,
      content: replyContent,
      email,
      parentReplyNo: parentNo
    };

    addReply(replyObj).then(() => {
      setReplyContent("");
      setOpenReplyNo(null);
      loadReplies();
    });
  };

  // 수정 시작
  const handleModify = (reply) => {
    setModifyReplyNo(reply.replyNo);
    setModifyContent(reply.content);
  };

  // 수정 완료
  const handleModifySubmit = (replyNo) => {
    if (!modifyContent.trim()) {
      alert("내용을 입력하시기 바랍니다.");
      return;
    }

    modifyReply(replyNo, modifyContent).then(() => {
      setModifyReplyNo(null);
      setModifyContent("");
      loadReplies();
    });
  };

  // 삭제
  const handleDelete = (replyNo) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    removeReply(replyNo).then(() => {
      loadReplies();
    });
  };

  return (
    <div className="reply-wrapper">
      <h3>댓글</h3>

      {/*  일반 댓글 입력 */}
      <div style={{ marginBottom: "20px" }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글을 입력하세요"
          style={{ width: "100%", height: "80px" }}
        />
        <button onClick={handleAddReply}>등록</button>
      </div>

      {/* 댓글 리스트 */}
      {replyList.length === 0 ? (
        <div>댓글 없음</div>
      ) : (
        replyList.map((reply) => (
          <div key={reply.replyNo} style={{ marginBottom: "20px" }}>

            {/* 부모 댓글 */}
            <div style={{ borderBottom: "1px solid #ddd", paddingBottom: "8px" }}>
              <strong>{reply.email}</strong>

              {/* 수정 모드 */}
              {modifyReplyNo === reply.replyNo ? (
                <div>
                  <textarea
                    value={modifyContent}
                    onChange={(e) => setModifyContent(e.target.value)}
                  />
                  <button onClick={() => handleModifySubmit(reply.replyNo)}>완료</button>
                  <button onClick={() => setModifyReplyNo(null)}>취소</button>
                </div>
              ) : (
                <div style={{ marginTop: "5px" }}>
                  {reply.enabled === 0 ? "삭제된 댓글입니다" : reply.content}
                </div>
              )}

              {/*  본인만 버튼 보이게 */}
              {reply.enabled !== 0 && reply.email === email && (
                <div style={{ marginTop: "5px" }}>
                  <button onClick={() => setOpenReplyNo(reply.replyNo)}>답글쓰기</button>
                  <button onClick={() => handleModify(reply)}>수정</button>
                  <button onClick={() => handleDelete(reply.replyNo)}>삭제</button>
                </div>
              )}
            </div>

            {/* 대댓글 입력창 */}
            {openReplyNo === reply.replyNo && (
              <div style={{ marginTop: "10px", marginLeft: "20px" }}>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="답글 입력"
                  style={{ width: "100%", height: "60px" }}
                />

                <div style={{ marginTop: "5px" }}>
                  <button onClick={() => handleAddChildReply(reply.replyNo)}>등록</button>
                  <button onClick={() => setOpenReplyNo(null)}>취소</button>
                </div>
              </div>
            )}

            {/* 대댓글 리스트 */}
            <div style={{ marginLeft: "20px", marginTop: "10px" }}>
              {reply.childList?.map((child) => (
                <div key={child.replyNo} style={{ marginBottom: "10px" }}>
                  ↳ <strong>{child.email}</strong>

                  {/* 수정 모드 */}
                  {modifyReplyNo === child.replyNo ? (
                    <div>
                      <textarea
                        value={modifyContent}
                        onChange={(e) => setModifyContent(e.target.value)}
                      />
                      <button onClick={() => handleModifySubmit(child.replyNo)}>완료</button>
                      <button onClick={() => setModifyReplyNo(null)}>취소</button>
                    </div>
                  ) : (
                    <div>
                      {child.enabled === 0
                        ? "삭제된 댓글입니다"
                        : child.content}
                    </div>
                  )}

                  {/*  본인만 */}
                  {child.enabled !== 0 && child.email === email && (
                    <div>
                      <button onClick={() => handleModify(child)}>수정</button>
                      <button onClick={() => handleDelete(child.replyNo)}>삭제</button>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        ))
      )}
    </div>
  );
};

export default BoardReplyComponent;