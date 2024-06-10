import { useDispatch, useSelector } from "react-redux";
import { setTask, setComments } from "_redux/slice/taskSlice";
import { useState } from "react";
import { TfiCommentAlt } from "react-icons/tfi";
import FormConfirm from "app/components/FormConfirm";
import TinyMCE from "app/components/TinyMCE";
import { Avatar, Button } from "@nextui-org/react";
import CommentsList from "./components/CommentsList";
import NotifyMessage from "_utils/notify";
import { createNewComment } from "services/api.service";
import { URL_IMAGE } from "_constants";
import { cloneDeep } from "lodash";
import { commentAction } from "_redux/slice/commentSlice";

function Comments() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  const { task } = useSelector((state) => state.tasks);
  const [visible, setVisible] = useState(false);
  const isLoading = useSelector(
    (state) => state.comment.isLoadingCreateComment
  );
  const [comment, setComment] = useState("");

  const handleSetVisible = () => {
    setComment("");
    setVisible(!visible);
  };

  const onSubmit = () => {
    if (!comment) {
      return handleSetVisible();
    }
    dispatch(
      commentAction.createComment({
        task: task?._id,
        content: comment,
        handleSetVisible,
      })
    );
  };

  return (
    <div className="relative mb-6 mt-2">
      <div className="mb-6">
        <div className="absolute left-0 top-0 p-1">
          <TfiCommentAlt className="text-xl text-task-icon" />
        </div>

        <p className="ml-12 mt-1 text-base text-task-title leading-7 font-semibold select-none">
          Bình luận
        </p>
      </div>

      <div className="flex flex-row">
        <Avatar
          name={userData?.name || userData?.username}
          src={userData?.avatar ? `${URL_IMAGE}/${userData.avatar}` : ""}
        />
        <div className="ml-3 flex-1">
          {!visible ? (
            <Button
              fullWidth
              variant="light"
              className={`bg-white h-14 data-[hover=true]:bg-white rounded-md shadow-comment justify-start items-start p-2 cursor-text`}
              onClick={handleSetVisible}
            >
              <span className="font-medium text-[#505f79]">
                Viết bình luận…
              </span>
            </Button>
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
                  placeholder={"Nhập bình luận của bạn tại đây..."}
                  value={comment}
                  onEditorChange={setComment}
                />
              }
              onConfirm={onSubmit}
            />
          )}
        </div>
      </div>

      <CommentsList taskId={task._id} />
    </div>
  );
}

export default Comments;
