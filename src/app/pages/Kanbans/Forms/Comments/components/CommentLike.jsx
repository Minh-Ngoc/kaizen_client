import { Tooltip } from "@nextui-org/react";
import { commentAction } from "_redux/slice/commentSlice";
import { setComments, setTask } from "_redux/slice/taskSlice";
import { memo } from "react";
import { BiLike } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { updateComment } from "services/api.service";

function CommentLike({ comment }) {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  const { task } = useSelector((state) => state.tasks);

  const isExitLike = comment?.likes?.find(
    (like) => like?._id === userData?._id
  );

  const handleLikeComment = async () => {
    dispatch(commentAction.likeCommentAc(comment?._id));
  };

  const renderContentTooltip =
    !!comment?.likes?.length &&
    comment?.likes?.map((user) => (
      <div className="flex flex-col gap-2 text-white">
        <p>{user?.name || user?.username}</p>
      </div>
    ));

  if (!isExitLike) {
    if (!comment?.likes?.length)
      return (
        <span
          className="text-xs text-task-title font-medium cursor-pointer underline-offset-2 decoration-primary hover:underline hover:text-primary select-none"
          onClick={() => handleLikeComment()}
        >
          Thích
        </span>
      );

    return (
      <Tooltip
        placemen="top"
        motionProps={{
          variants: {},
        }}
        classNames={{
          content: "p-2 bg-slate-600 rounded-md",
        }}
        content={renderContentTooltip}
      >
        <span
          className="text-xs text-task-title font-medium cursor-pointer underline-offset-2 decoration-primary hover:underline hover:text-primary select-none"
          onClick={() => handleLikeComment()}
        >
          Thích {!!comment?.likes?.length && `(${comment?.likes?.length})`}
        </span>
      </Tooltip>
    );
  }

  return (
    <Tooltip
      placemen="top"
      motionProps={{
        variants: {},
      }}
      classNames={{
        content: "p-2 bg-slate-600 rounded-md",
      }}
      content={renderContentTooltip}
    >
      <span
        className="flex gap-1 items-center text-primary text-sm cursor-pointer select-none hover:bg-primary-100 rounded-md p-[2px]"
        onClick={() => handleLikeComment()}
      >
        <span className="font-medium pt-[2px]">{comment?.likes?.length}</span>
        <BiLike size={18} />
      </span>
    </Tooltip>
  );
}

export default memo(CommentLike);
