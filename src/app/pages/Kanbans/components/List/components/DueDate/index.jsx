import React, {memo, useState} from "react";
import moment from "moment";
import {Button, DateRangePicker} from "@nextui-org/react";
import {MdOutlineClose} from "react-icons/md";
import {parseDate} from "@internationalized/date";
import {useDispatch} from "react-redux";
import {UpdateTask} from "_redux/slice/taskSlice";
import NotifyMessage from "_utils/notify";
import {updateTaskUI} from "_redux/slice/taskSlice";
import PopoverCustom from "app/components/PopoverCustom/PopoverCustom";
const DueDate = ({dateStart, dateEnd, taskId, project, statusId}) => {
	const dispatch = useDispatch();
	const [value, setValue] = useState({
		start: dateStart ? parseDate(moment(dateStart).format("YYYY-MM-DD")) : null,
		end: dateEnd ? parseDate(moment(dateEnd).format("YYYY-MM-DD")) : null,
	});
	const [isOpen, setIsOpen] = useState(false);
	const handleOpenChange = () => {
		setIsOpen(false);
	};
	const startProject = parseDate(
		moment(project?.dateStart).format("YYYY-MM-DD")
	)?.toDate();
	const endProject = parseDate(
		moment(project?.dateEnd).format("YYYY-MM-DD")
	)?.toDate();
	const handleSaveDate = () => {
		if (
			value?.start?.toDate().getTime() < startProject.getTime() ||
			value?.end?.toDate().getTime() > endProject.getTime()
		) {
			return NotifyMessage(
				`Thời gian thực hiện công việc không thể nằm ngoài thời gian dự án (${moment(
					startProject
				).format("DD/MM/YYYY")} - ${moment(endProject).format(
					"DD/MM/YYYY"
				)}). Vui lòng thử lại!`,
				"warning"
			);
		} else {
			try {
				const dateStart = moment(value?.start?.toDate())
					.startOf("day")
					?.toISOString();
				const dateEnd = moment(value?.end?.toDate())
					.endOf("day")
					?.toISOString();

				dispatch(
					UpdateTask({
						id: taskId,
						body: {
							dateStart,
							dateEnd,
						},
					})
				);
				dispatch(
					updateTaskUI({
						taskId,
						dateStart,
						dateEnd,
					})
				);
				setIsOpen(false);
			} catch (error) {
				NotifyMessage(
					"Có lỗi xảy ra trong quá trình cập nhật thời gian thực hiện công việc!",
					"error"
				);
			}
		}
	};

	return (
		<div className="text-base font-medium">
			<PopoverCustom
				isOpen={isOpen}
				onOpenChange={handleOpenChange}
				trigger={
					<Button
						variant="solid"
						color="primary"
						className="!bg-transparent"
						onClick={() => setIsOpen(true)}
					>
						<div className="w-full text-xs ">
							{dateStart && dateEnd
								? `${moment(dateStart).format("DD/MM/YYYY")} - ${moment(
										dateEnd
								  ).format("DD/MM/YYYY")}`
								: "Chưa có"}
						</div>
					</Button>
				}
			>
				<header className="py-1 relative w-full">
					<h3 className="py-0 px-8 h-10 align-middle text-sm leading-10 text-center tracking-wide font-semibold text-task-title text-ellipsis text-nowrap overflow-hidden">
						Thời gian thực hiện
					</h3>

					<span
						className="p-2 absolute right-1 top-2 cursor-pointer hover:bg-btn-detail rounded-md"
						onClick={() => setIsOpen(false)}
					>
						<MdOutlineClose className="text-base text-task-title" />
					</span>
				</header>
				<div className="my-2 px-1 flex flex-col gap-2 w-full">
					<DateRangePicker
						radius="sm"
						variant="bordered"
						className="max-w-xs"
						value={value}
						onChange={setValue}
						popoverProps={{
							className: "min-w-[300px] w-[300px]",
						}}
						calendarProps={{
							className: "!w-full !max-w-full",
							content: "!w-full !max-w-full",
						}}
					/>
					<Button
						fullWidth
						variant="light"
						className={`z-10 mt-3 sticky bottom-0 bg-primary hover:data-[hover=true]:bg-primary-400 items-center rounded-sm py-1 px-2`}
						onClick={handleSaveDate}
					>
						<span className="font-semibold text-white ">Lưu</span>
					</Button>
				</div>
			</PopoverCustom>
		</div>
	);
};

export default memo(DueDate);
