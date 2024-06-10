import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import FormConfirm from "app/components/FormConfirm";
import TinyMCE from "app/components/TinyMCE";
import { Avatar, Button } from "@nextui-org/react";
import { URL_IMAGE } from "_constants";
import PropTypes from "prop-types";
import { commentAction } from "_redux/slice/commentSlice";
function NewReply({ cmtId = "", onClose }) {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  const isLoading = useSelector((state) => state.comment.isLoadingCreateReply);
  const [comment, setComment] = useState("");
  const onSubmit = () => {
    dispatch(
      commentAction.createNewReplyAc({
        cmtId,
        content: comment,
        onClose,
      })
    );
  };

  return (
    <div className="flex flex-row">
      <Avatar
        name={userData?.name || userData?.username}
        src={userData?.avatar ? `${URL_IMAGE}/${userData.avatar}` : ""}
      />
      <div className="ml-3 flex-1">
        <FormConfirm
          isDismissable={true}
          textConfirm={"Trả lời"}
          textCancel={<p className="text-task-title font-semibold px-2">Hủy</p>}
          onClose={onClose}
          isLoading={isLoading}
          form={
            <TinyMCE
              type={"comment"}
              height={144}
              placeholder={"Nhập câu trả lời của bạn tại đây..."}
              value={comment}
              onEditorChange={setComment}
            />
          }
          onConfirm={onSubmit}
        />
      </div>
    </div>
  );
}
NewReply.propTypes = {
  cmtId: PropTypes.string,
  onClose: PropTypes.func,
};
export default NewReply;
