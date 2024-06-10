import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { commentAction } from "_redux/slice/commentSlice";
import { Spinner } from "@nextui-org/react";

function CommentsList({ taskId }) {
	const dispatch = useDispatch();
	const isLoading = useSelector((state) => state.comment.isLoading);
	const totalComment = useSelector((state) => state.comment.totalComment);
	const comments = useSelector((state) => state.comment.listComment);
	useEffect(() => {
		if(taskId) {
			dispatch(commentAction.getPagingComments(taskId));
		}
	}, [taskId]);
	//   const { task } = useSelector((state) => state.tasks);

	//   const comments = useMemo(
	//     () =>
	//       !task?.comments?.length
	//         ? []
	//         : [...task?.comments]?.sort(
	//             (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
	//           ),
	//     [task]
	//   );
	return isLoading ? (
		<div className="flex flex-col justify-center items-center min-h-40 shadow-lg rounded-lg gap-2">
			<Spinner size="md" />
			<p className="text-sm text-black">Đang tải bình luận...</p>
		</div>
	) : totalComment === 0 ? (
		<div className="mt-4 flex flex-col justify-center items-center min-h-24 rounded-lg gap-2">
			<p className="text-sm text-black">
				Không có bình luận nào gần đây!
			</p>
		</div>
	) : (
		<div className="flex flex-col gap-4 mt-4">
			{comments?.map((comment, index) => (
				<Comment key={index} comment={comment} />
			))}
		</div>
	);
}

CommentsList.propTypes = {
	taskId: PropTypes.string,
};
export default CommentsList;
