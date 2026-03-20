const ReplyItem = ({ reply }) => {
  return (
    <div className="reply-item" style={{ marginBottom: "10px" }}>
      <div>
        <strong>{reply.writer}</strong>
      </div>

      <div>{reply.content}</div>

      <div style={{ fontSize: "12px", color: "gray" }}>
        {reply.regDate}
      </div>
    </div>
  );
};

export default ReplyItem;