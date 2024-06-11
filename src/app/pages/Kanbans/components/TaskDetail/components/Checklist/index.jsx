import { useState } from "react";
import { Input, Button, DateRangePicker } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { cloneDeep } from "lodash";
import { addChecklist, setTask } from "_redux/slice/taskSlice";
import NotifyMessage from "_utils/notify";
import { addNewChecklist } from "services/api.service";
import { setSidebarTask } from "_redux/slice/sidebarTaskSlice";
import { setErrorDates } from "_redux/slice/sidebarTaskSlice";
import moment from "moment";
import { setModal } from "_redux/slice/modalSlice";

function Checklist() {
	const dispatch = useDispatch();
	const { task } = useSelector((state) => state.tasks);

	const [title, setTitle] = useState("");
	const [time, setTime] = useState(null);

	const [error, setError] = useState({
		title: "",
		time: "",
	});
	const [isLoading, setIsLoading] = useState(false);

	const onKeyDown = (event) => {
		if (event.key === "Enter") {
			// Ngăn không cho giá trị xuống dòng
			event.preventDefault();
			handleCreateNewChecklist();
		}
	};

	const handleCreateNewChecklist = async () => {
		if (!task?.dateStart || !task?.dateEnd) {
			NotifyMessage("Vui lòng chọn thời gian thực hiện!", "warning");

			dispatch(setSidebarTask({ isOpen: false, key: "checklist" }));

			return dispatch(
				setErrorDates({
					key: "dates",
					error: true,
				})
			);
		}
		if (
			moment(time?.start?.toDate()).isBefore(moment(task?.dateStart)) ||
			moment(time?.end?.toDate()).isAfter(moment(task?.dateEnd))
		) {
			return NotifyMessage(
				`Thời gian thực hiện công việc không thể nằm ngoài thời gian dự án (${moment(
					task?.dateStart
				).format("DD/MM/YYYY")} - ${moment(task?.dateEnd).format(
					"DD/MM/YYYY"
				)}). Vui lòng thử lại!`,
				"warning"
			);
		}
		const newChecklist = task?.checklist?.length
			? cloneDeep(task?.checklist)
			: [];

		if (!title && !time) {
			return dispatch(setSidebarTask({ isOpen: false, key: "dates" }));
		}

		if (!title && time) {
			return setError((prev) => ({
				...prev,
				title: "Vui lòng nhập tên việc cần làm!",
			}));
		}

		if (title && !time) {
			return setError((prev) => ({
				...prev,
				time: "Vui lòng chọn thời gian thực hiện!",
			}));
		}

		try {
			setIsLoading(true);

			const { data } = await addNewChecklist({
				title,
				dateStart: moment(time?.start?.toDate())
					.startOf("day")
					.toISOString(),
				dateEnd: moment(time?.end?.toDate()).endOf("day").toISOString(),
				taskId: task?._id,
			});

			if (data?.status === 1) {
				newChecklist.push(data?.data);

				dispatch(
					addChecklist({ taskId: task?._id, checklist: newChecklist })
				);
				dispatch(setTask({ ...task, checklist: newChecklist }));
				dispatch(setSidebarTask({ isOpen: false, key: "checklist" }));
			}
		} catch (error) {
			console.log("error: ", error);
			NotifyMessage("Tạo việc làm thất bại. Vui lòng thử lại!", "error");
		} finally {
			setIsLoading(false);
		}
	};

	const onFocusChange = (value) => {
		dispatch(setModal({ isFocused: value }));
	};

	return (
		<div className="mt-2 px-1 flex flex-col gap-2 w-full">
			<p className="text-xs text-task-title font-semibold">Tiêu đề:</p>

			<Input
				size="sm"
				variant="bordered"
				placeholder={`Nhập tên việc cần làm...`}
				classNames={{
					inputWrapper:
						"rounded-sm py-2 !h-auto data-[hover=true]:border-primary-400 group-data-[focus=true]:border-primary-400 group-data-[focus=true]:border-2 group-data-[focus=true]:border-primary-400",
					label: "hidden",
					input: "text-sm text-task-title",
				}}
				onValueChange={setTitle}
				onKeyDown={onKeyDown}
				isInvalid={Boolean(error.title)}
				errorMessage={error.title}
			/>

			<p className="mt-3 text-xs text-task-title font-semibold">
				Thời gian thực hiện:
			</p>
			<DateRangePicker
				popoverProps={{
					className: "min-w-[300px] w-[300px]",
				}}
				calendarProps={{
					className: "!w-full !max-w-full",
					content: "!w-full !max-w-full",
				}}
				variant="bordered"
				radius="sm"
				className="max-w-xs date-range-picker"
				value={time}
				onChange={setTime}
				isInvalid={Boolean(error.time)}
				errorMessage={error.time}
				onOpenChange={onFocusChange}
			/>

			<div className="flex justify-end mt-2">
				<Button
					variant="solid"
					color="primary"
					className={`min-h-max h-max min-w-max w-max items-center rounded-sm py-1 px-4`}
					isLoading={isLoading}
					onPress={handleCreateNewChecklist}
				>
					<span className="font-semibold text-white">
						Thêm việc cần làm
					</span>
				</Button>
			</div>
		</div>
	);
}

export default Checklist;
