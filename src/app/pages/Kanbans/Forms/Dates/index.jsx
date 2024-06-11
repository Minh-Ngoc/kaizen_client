import { useState } from "react";
import { Button, DateRangePicker, Input } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { setTask, setTime, UpdateTask } from "_redux/slice/taskSlice";
import NotifyMessage from "_utils/notify";
import moment from "moment";
import { parseDate } from "@internationalized/date";
import { setSidebarTask } from "_redux/slice/sidebarTaskSlice";
import { updateTaskUI } from "_redux/slice/taskSlice";
import { setErrorDates } from "_redux/slice/sidebarTaskSlice";
import { setModal } from "_redux/slice/modalSlice";

function Dates() {
	const dispatch = useDispatch();
	const { task, isLoading, currentTab, api } = useSelector(
		(state) => state.tasks
	);
	const [value, setValue] = useState({
		start: parseDate(
			moment(task?.dateStart || task?.project?.dateStart).format(
				"YYYY-MM-DD"
			)
		),
		end: parseDate(
			moment(task?.dateEnd || task?.project?.dateEnd).format("YYYY-MM-DD")
		),
	});

	const onSubmit = async () => {
		if (api === "my-tasks" && (!task?.project || !Object.keys(task?.project)?.length)) {
			NotifyMessage("Vui lòng chọn dự án!", "warning")

			return dispatch(
				setErrorDates({
					key: "project",
					error: true,
				})
			);
		}

		const dateStartProject = task?.project.dateStart;
		const dateEndProject = task?.project.dateEnd;

		const start = moment(value?.start?.toDate())?.startOf("day");
		const end = moment(value?.end?.toDate())?.endOf("day");

		if (start.isBefore(moment(dateStartProject))) {
			return NotifyMessage(
				`Thời gian bắt đầu công việc không thể sớm hơn thời gian bắt đầu dự án (${moment(
					dateStartProject
				).format("DD/MM/YYYY")}). Vui lòng thử lại!`,
				"warning"
			);
		}

		if (end.isAfter(moment(dateEndProject))) {
			return NotifyMessage(
				`Thời gian hoàn thành công việc không thể trễ hơn thời gian hoàn thành dự án (${moment(
					dateEndProject
				).format("DD/MM/YYYY")}). Vui lòng thử lại!`,
				"warning"
			);
		}

		dispatch(
			UpdateTask({
				id: task?._id,
				body: {
					dateStart: start?.toISOString(),
					dateEnd: end?.toISOString(),
				},
			})
		);

		dispatch(
			setTime({
				taskId: task?._id,
				dateStart: start?.toISOString(),
				dateEnd: end?.toISOString(),
			})
		);

		dispatch(
			setTask({
				...task,
				dateStart: start?.toISOString(),
				dateEnd: end?.toISOString(),
			})
		);
		dispatch(setSidebarTask({ isOpen: false, key: "dates" }));
		
		currentTab === "list" &&
			dispatch(
				updateTaskUI({
					taskId: task?._id,
					statusId: task?.statusId,
					dateStart: start?.toISOString(),
					dateEnd: end?.toISOString(),
				})
			);
	};

	const onFocusChange = (value) => {
		dispatch(setModal({ isFocused: value }))
	}

	return (
		<div className="my-2 px-1 flex flex-col gap-2 w-full">
			<DateRangePicker
				radius="sm"
				variant="bordered"
				className="max-w-xs"
				popoverProps={{
					className: "min-w-[300px] w-[300px]"
				}}
				calendarProps={{
					className: '!w-full !max-w-full',
					content: '!w-full !max-w-full',
				}}
				value={value}
				onChange={setValue}
				onOpenChange={onFocusChange}
			/>
			<Button
				fullWidth
				variant="light"
				className={`z-10 mt-3 sticky bottom-0 bg-primary hover:data-[hover=true]:bg-primary-400 items-center rounded-sm py-1 px-2`}
				isLoading={isLoading}
				onClick={onSubmit}
			>
				<span className="font-semibold text-white">Lưu</span>
			</Button>
		</div>
	);
}

export default Dates;
