import {PiCreditCardBold} from "react-icons/pi";
import {Textarea} from "@nextui-org/react";
import {useDispatch, useSelector} from "react-redux";
import {setTask, UpdateTask, setName} from "_redux/slice/taskSlice";
import {updateTaskUI} from "_redux/slice/taskSlice";

function TaskName() {
	const dispatch = useDispatch();
	const {task, currentTab} = useSelector((state) => state.tasks);

	const handleChangeInput = (value) => {
		dispatch(setName({taskId: task?._id, name: value}));
		dispatch(setTask({...task, name: value}));
	};

	const handleUpdateTaskName = async () => {
		dispatch(
			UpdateTask({
				id: task?._id,
				body: {
					name: task.name,
				},
			})
		);
		currentTab === "list" &&
			dispatch(
				updateTaskUI({
					statusId: task?.statusId,
					taskId: task?._id,
					taskName: task?.name,
				})
			);
	};

	const onKeyDown = (event) => {
		if (event.key === "Enter") {
			// Ngăn không cho giá trị xuống dòng
			event.preventDefault();
			handleUpdateTaskName();
		}
	};

	return (
		<div className="pr-10 mt-2 sticky top-4 z-20 px-4">
			{/* <div className="relative bg-white"> */}
				{/* <div className="absolute left-0 -top-[2px] p-1">
					<PiCreditCardBold className="text-2xl text-task-icon" />
				</div> */}

				<Textarea
					minRows={1}
					labelPlacement="outside"
					classNames={{
						base: "rounded-sm",
						inputWrapper: `rounded-sm shadow-none p-0 bg-white data-[hover=true]:bg-white group-data-[focus=true]:bg-white group-data-[focus=true]:outline-2 group-data-[focus=true]:outline-primary-400`,
						input:
							"px-2 py-0 text-xl !text-task-title font-semibold resize-none overflow-hidden break-words",
					}}
					value={task?.name}
					onValueChange={handleChangeInput}
					onBlur={handleUpdateTaskName}
					onKeyDown={onKeyDown}
				/>
				{/* <p className="text-task-icon mt-1 ml-2 cursor-default">
					in list To <i className="underline cursor-pointer">Doing</i>
				</p> */}
			{/* </div> */}
		</div>
	);
}

export default TaskName;
