import { Chip, User } from "@nextui-org/react";
import { URL_IMAGE } from "_constants";
import { formatFacebookDate } from "_utils";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormConfirm from "app/components/FormConfirm";
import TinyMCE from "app/components/TinyMCE";
import { commentAction } from "_redux/slice/commentSlice";
import ReplyLike from "./ReplyLike";
import ReplyDelete from "./ReplyDelete";

function Reply({ cmtId, reply }) {
  const { userData } = useSelector((state) => state.auth);
  const [visible, setVisible] = useState(false);
  const [editComment, setEditComment] = useState(reply?.content);
  const isLoading = false;
  const dispatch = useDispatch();
  const handleSetVisible = () => {
    setVisible(!visible);
  };

  const onSubmit = async () => {
    if (!editComment) {
      return handleSetVisible();
    }
    if (editComment === reply?.content) {
      return handleSetVisible();
    }
    dispatch(
      commentAction.updateReplyAc({
        id: reply?._id,
        cmtId,
        content: editComment,
        handleSetVisible,
      })
    );
  };

  const renderContent = useMemo(() => {
    const isExitLike = reply?.likes?.find(
      (like) => like?._id === userData?._id
    );

    return (
      <div className="flex flex-col w-full">
        {!visible ? (
          <div
            className="shadow-comment bg-white p-2 rounded-md w-max"
            dangerouslySetInnerHTML={{
              __html: reply?.content,
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
                placeholder={"Nhập nội dung chỉnh sửa câu trả lời..."}
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
          <ReplyLike reply={reply} cmtId={cmtId} />
          {userData?._id === reply?.createdBy?._id && (
            <>
              <span
                className="text-xs text-task-title font-medium cursor-pointer underline-offset-2 decoration-primary hover:underline hover:text-primary select-none"
                onClick={handleSetVisible}
              >
                Chỉnh sửa
              </span>
              <ReplyDelete reply={reply} cmtId={cmtId} />
            </>
          )}
        </div>
      </div>
    );
  }, [userData, reply, cmtId, visible, editComment]);

  const name = reply?.createdBy?.name || reply?.createdBy?.username;
  const avatar = reply?.createdBy?.avatar
    ? `${URL_IMAGE}/${reply?.createdBy?.avatar}`
    : "";

  const createdAt = formatFacebookDate(reply?.createdAt);

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
        base: "justify-start items-start gap-3",
        name: "font-bold",
        description: "text-sm text-black w-full",
        wrapper: "flex-1"
      }}
    />
  );
}

export default Reply;
