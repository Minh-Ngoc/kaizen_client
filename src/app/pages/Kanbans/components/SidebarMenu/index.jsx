import PopoverAddTask from "../PopoverAddTask";
import {useDispatch, useSelector} from "react-redux";
import {FaMinus, FaRegRectangleList} from "react-icons/fa6";
import {Button} from "@nextui-org/react";
import {DeleteTask} from "_redux/slice/taskSlice";
import {onClose} from "_redux/slice/modalSlice";
import {useMemo} from "react";

import {deleteTask} from "_redux/slice/taskSlice";

function SidebarMenu() {
	const dispatch = useDispatch();
	const {task, api, currentTab} = useSelector((state) => state.tasks);
	const {items} = useSelector((state) => state.sidebarTask);

	const handleDeleteTask = async () => {
		dispatch(DeleteTask(task?._id));
		currentTab === "list" &&
			dispatch(deleteTask({statusId: task?.statusId, taskId: task?._id}));
		// dispatch(onClose());
	};

	/* Popup Confirm Delete Task
		const deletePopover = {
			key: "delete-task",
			label: "Xóa Task",
			icon: <FaMinus className="text-base text-white" />,
			content: (
				<div className="mb-3 px-1 flex flex-col gap-2 w-full">
					<p className="text-xs text-task-title font-semibold">
						Mọi hành động sẽ bị xóa khỏi nguồn cấp dữ liệu hoạt động và bạn sẽ
						không thể mở lại Task. Không có hoàn tác.
					</p>
					<Button
						fullWidth
						variant="light"
						className={`bg-red-500 relative data-[hover=true]:bg-red-400 items-center rounded-sm py-1 px-2`}
						onClick={handleDeleteTask}
					>
						<span className="font-semibold text-white">Xóa Task</span>
					</Button>
				</div>
			),
			error: "",
		};
	*/

	const customItems = useMemo(() => {
		if (api === "tasks") {
			return items?.filter((it) => it.key !== "project");
		}

		return items;
	}, [api, items]);

	return (
		<div className="col-span-3 max-md:col-span-12 relative">
			<div className="pb-2 mb-10 sticky top-10">
				<p className="text-task-title text-sm font-medium mb-1">
					Thêm vào công việc
				</p>
				<div className="flex flex-col gap-y-2 mb-5">
					{/* {popoverProject} */}

					{customItems?.map((item) => (
						<PopoverAddTask itemKey={item?.key} key={item?.key} item={item} />
					))}
				</div>

				<p className="text-task-title text-sm font-medium mb-1">Thao tác</p>

				<div className="flex flex-col gap-y-2 mb-5">
					{/* <PopoverAddTask
						item={deletePopover}
						trigger={
						}
					/> */}
					<Button
						fullWidth
						variant="light"
						className={`bg-red-500 relative data-[hover=true]:bg-red-400 items-center rounded-sm justify-start py-1 px-2`}
						startContent={<FaMinus className="text-lg text-white" />}
						onClick={handleDeleteTask}
					>
						<span className="font-semibold text-white">Xóa Task</span>
					</Button>
				</div>
			</div>
		</div>
	);
}

export default SidebarMenu;
