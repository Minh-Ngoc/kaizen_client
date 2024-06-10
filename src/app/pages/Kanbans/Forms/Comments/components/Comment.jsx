import { Chip, User } from "@nextui-org/react";
import { URL_IMAGE } from "_constants";
import { formatFacebookDate } from "_utils";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommentLike from "./CommentLike";
import CommentDelete from "./CommentDelete";
import FormConfirm from "app/components/FormConfirm";
import TinyMCE from "app/components/TinyMCE";
import { commentAction } from "_redux/slice/commentSlice";
import Reply from "./Reply";
import NewReply from "./newReply";
function Comment({ comment }) {
  const { userData } = useSelector((state) => state.auth);
  const [visible, setVisible] = useState(false);
  const [editComment, setEditComment] = useState(comment?.content);
  const [isOpenReply, setIsOpenReply] = useState(false);
  const isLoading = useSelector(
    (state) => state.comment.isLoadingUpdateComment
  );
  const dispatch = useDispatch();
  const handleSetVisible = () => {
    setVisible(!visible);
  };

  const onSubmit = async () => {
    if (editComment === comment?.content) {
      return handleSetVisible();
    }
    dispatch(
      commentAction.updateCommentAc({
        commentId: comment?._id,
        content: editComment,
        handleSetVisible,
      })
    );
  };

  const renderContent = useMemo(() => {
    const isExitLike = comment?.likes?.find(
      (like) => like?._id === userData?._id
    );

    return (
      <div className="flex flex-col w-full">
        {!visible ? (
          <div
            className="shadow-comment bg-white p-2 rounded-md w-max"
            dangerouslySetInnerHTML={{
              __html: comment?.content,
            }}
          />
        ) : (
          <FormConfirm
            isDismissable={true}
            textConfirm={"Lưu"}
            textCancel={
              <p className="text-task-title font-semibold px-2">Hủy</p>
            }
            onClose={handleSetVisible}
            isLoading={isLoading}
            form={
              <TinyMCE
                type={"comment"}
                height={144}
                placeholder={"Nhập nội dung chỉnh sửa bình luận..."}
                value={editComment}
                onEditorChange={setEditComment}
              />
            }
            onConfirm={onSubmit}
          />
        )}

        {/* Action */}
        <div
          className={`flex items-center justify-start gap-4 ${
            isExitLike ? "mt-1" : "mt-2"
          }`}
        >
          {/* Like */}
          <CommentLike comment={comment} />
          <span
            className="text-xs text-task-title font-medium cursor-pointer underline-offset-2 decoration-primary hover:underline hover:text-primary select-none"
            onClick={() => {
              setIsOpenReply(true);
            }}
          >
            Trả lời
          </span>
          {/* Edit and Delete */}
          {userData?._id === comment?.createdBy?._id && (
            <>
              <span
                className="text-xs text-task-title font-medium cursor-pointer underline-offset-2 decoration-primary hover:underline hover:text-primary select-none"
                onClick={handleSetVisible}
              >
                Chỉnh sửa
              </span>
              {/* Delete */}
              <CommentDelete comment={comment} />
            </>
          )}
        </div>
        <div className="ml-2 mt-2">
          {isOpenReply && (
            <NewReply
              cmtId={comment?._id}
              onClose={() => {
                setIsOpenReply(!isOpenReply);
              }}
            />
          )}

          <div className="flex flex-col gap-1">
            {comment?.replies?.map((reply) => (
              <Reply reply={reply} cmtId={comment?._id} />
            ))}
          </div>
        </div>
      </div>
    );
  }, [userData, comment, visible, editComment, isOpenReply]);

  const name = comment?.createdBy?.name || comment?.createdBy?.username;
  const avatar = comment?.createdBy?.avatar
    ? `${URL_IMAGE}/${comment?.createdBy?.avatar}`
    : "";

  const createdAt = formatFacebookDate(comment?.createdAt);

  return (
    <User
      name={
        <div className="flex items-center gap-1">
          {name}

          <Chip
            color="default"
            variant="dot"
            classNames={{
              base: "border-0",
              content: "text-task-title",
            }}
          >
            {createdAt}
          </Chip>
        </div>
      }
      description={renderContent}
      avatarProps={{
        name,
        src: avatar,
        classNames: {
          base: "select-none",
        },
      }}
      classNames={{
        base: "justify-start items-start gap-3 w-full",
        name: "font-bold",
        description: "text-sm text-black w-full",
        wrapper: "flex-1"
      }}
    />
  );
}

export default Comment;
