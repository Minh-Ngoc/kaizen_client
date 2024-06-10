import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import FormConfirm from "app/components/FormConfirm";
import TinyMCE from "app/components/TinyMCE";
import { Avatar, Button, Tab, Tabs } from "@nextui-org/react";
import CommentsList from "./components/CommentsList";
import { URL_IMAGE } from "_constants";
import { commentAction } from "_redux/slice/commentSlice";
import { setComments } from "_redux/slice/taskSlice";

function Comments() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  const { task } = useSelector((state) => state.tasks);
  const [visible, setVisible] = useState(false);
  const [tab, setTab] = useState('comments');
  const isLoading = useSelector(
    (state) => state.comment.isLoadingCreateComment
  );
  const [comment, setComment] = useState("");

  const handleSetVisible = () => {
    setComment("");
    setVisible(!visible);
  };

  const onSubmit = async () => {
    if (!comment) {
      return handleSetVisible();
    }
    
    const { data } = await dispatch(
      commentAction.createComment({
        task: task?._id,
        content: comment,
        handleSetVisible,
      })
    ).unwrap();

    dispatch(
      setComments({
        taskId: task?._id,
        comments: [...task?.comments, data?.comment]
      })
    )
  };

  return (
    <div className="grow relative flex flex-col justify-between">
      <div className="bg-[#f9f8f8] px-6 py-4 flex-1 mb-[121px]">
        <Tabs 
          variant={"underlined"} 
          aria-label="Tabs variants" 
          selectedKey={tab}
          classNames={{
            base: "w-full",
            tabList: "w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full",
            tab: "max-w-fit px-0 text-sm font-medium pb-5",
            tabContent: "group-data-[selected=true]:text-task-title"
          }}
        >
          <Tab key="comments" title="Bình luận"/>
        </Tabs>

        <CommentsList taskId={task._id} />
      </div>

      <div className="bg-[#f9f8f8] fixed left-[60%] right-0 bottom-0 flex flex-row px-6 border-t-1 border-default-200 py-3 z-20">
          <Avatar
            name={userData?.name || userData?.username}
            src={userData?.avatar ? `${URL_IMAGE}/${userData.avatar}` : ""}
          />
          <div className="ml-3 flex-1">
            {!visible ? (
            // New Comment
              <Button
                fullWidth
                variant="light"
                className={`z-20 bg-white h-24 data-[hover=true]:bg-white rounded-md shadow-comment justify-start items-start p-2 cursor-text`}
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
    </div>
  );
}

export default Comments;
