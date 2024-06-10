import { Button } from "@nextui-org/react";
import { commentAction } from "_redux/slice/commentSlice";
import NotifyMessage from "_utils/notify";
import PopoverAddTask from "app/pages/Kanbans/components/PopoverAddTask";
import { memo, useMemo } from "react";
import { FaMinus } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";

function ReplyDelete({ reply, cmtId }) {
  const dispatch = useDispatch();
  const handleDeleteComment = async () => {
    dispatch(commentAction.deleteReplyAc({ replyid: reply?._id, cmtId }));
  };

  const deletePopover = useMemo(
    () => ({
      key: `delete-comment-${reply?._id}`,
      label: "Xóa bình luận",
      icon: <FaMinus className="text-base text-white" />,
      content: (
        <div className="mb-3 px-1 flex flex-col gap-2 w-full">
          <p className="text-xs text-task-title font-semibold">
            Mọi hành động sẽ bị xóa khỏi nguồn cấp dữ liệu hoạt động và bạn sẽ
            không thể mở lại bình luận. Không có hoàn tác.
          </p>
          <Button
            fullWidth
            variant="light"
            className={`bg-red-500 h-8 relative data-[hover=true]:bg-red-400 items-center rounded-sm py-1 px-2`}
            onClick={handleDeleteComment}
          >
            <span className="font-semibold text-white">Xóa bình luận</span>
          </Button>
        </div>
      ),
      error: "",
    }),
    [reply]
  );

  return (
    <PopoverAddTask
      placement={"right-start"}
      itemKey={`delete-comment-${reply?._id}`}
      item={deletePopover}
      trigger={
        <span className="text-xs text-task-title font-medium cursor-pointer underline-offset-2 decoration-primary hover:underline hover:text-primary select-none">
          Xóa
        </span>
      }
    />
  );
}

export default memo(ReplyDelete);
