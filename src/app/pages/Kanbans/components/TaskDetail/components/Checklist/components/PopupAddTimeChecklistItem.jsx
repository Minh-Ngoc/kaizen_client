import { useMemo, useState } from "react";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
	Button,
	DateRangePicker,
} from "@nextui-org/react";
import { MdOutlineClose } from "react-icons/md";
import { CiCalendar } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import NotifyMessage from "_utils/notify";
import { setTask } from "_redux/slice/taskSlice";
import moment from "moment";
import { parseDate } from "@internationalized/date";
import { setCheckListTitle } from "_redux/slice/taskSlice";
import { updateItemChecklist } from "services/api.service";
import { setModal } from "_redux/slice/modalSlice";

function PopupAddTimeChecklistItem({ checklist, item }) {
	const dispatch = useDispatch();
	const { task } = useSelector((state) => state.tasks);
	const { isFocused } = useSelector(state => state.modal);

	const [isOpen, setIsOpen] = useState(false);
	const [time, setTime] = useState({
		start: item?.dateStart ? parseDate(
			moment(item?.dateStart)?.format("YYYY-MM-DD")
		) : null,
		end: item?.dateEnd ? parseDate(
			moment(item?.dateEnd)?.format("YYYY-MM-DD")
		) : null,
	});

	const [isLoading, setIsLoading] = useState(false);

	const handleClosePopover = () => {
		setIsOpen(false);
	};

	const onOpenChange = (open) => {
		if(open) {
			setIsOpen(open);
		}

		if (!isFocused && !open) {
			setIsOpen(open);
		}
	};

	const renderDate = useMemo(() => {
		if(!item?.dateStart || !item?.dateEnd) {
			return <CiCalendar className="text-base" />;
		}

		const startDate = moment(item?.dateStart);
		const endDate = moment(item?.dateEnd);
		
		if (startDate.isSame(endDate, 'month') && startDate.isSame(endDate, 'year')) {
			return `${startDate.format('DD')} - ${endDate.format('DD MMMM YYYY')}`;
		} else if (startDate.isSame(endDate, 'year')) {
			return `${startDate.format('DD/MM')} - ${endDate.format('DD/MM/YYYY')}`;
		} else {
			return `${startDate.format('DD MMMM YYYY')} - ${endDate.format('DD MMMM YYYY')}`;
		}
	}, [item]);

	const handleUpdateTimeChecklistItem = async () => {
		if(!time || !time?.start || !time?.end) {
			return handleClosePopover();
		}

		const dateStartChecklist = moment(checklist?.dateStart).format("YYYY-MM-DD");
		const dateEndChecklist = moment(checklist?.dateEnd).format("YYYY-MM-DD");

		const start = moment(time?.start?.toDate())?.startOf("day").format("YYYY-MM-DD");
		const end = moment(time?.end?.toDate())?.endOf("day").format("YYYY-MM-DD");

		if (start < dateStartChecklist) {
			return NotifyMessage(
				`Thời gian bắt đầu công việc con không thể sớm hơn thời gian bắt đầu công việc cha (${moment(dateStartChecklist).format("DD/MM/YYYY")}). Vui lòng thử lại!`,
				"warning"
			);
		}

		if (end > dateEndChecklist) {
			return NotifyMessage(`Thời gian hoàn thành công việc con không thể trễ hơn thời gian hoàn thành công việc cha (${moment(dateEndChecklist).format("DD/MM/YYYY")}). Vui lòng thử lại!`,
				"warning"
			);
		}

		try {
			setIsLoading(true);

			const dateStart = moment(time?.start?.toDate()).startOf("day")?.toISOString();
			const dateEnd = moment(time?.end?.toDate()).endOf("day")?.toISOString();

			const { data } = await updateItemChecklist(checklist?._id, item?._id, {
				taskId: task?._id,
				dateStart,
				dateEnd,
			});

			if (data.status === 1) {
				const newChecklist = task?.checklist?.map((chst) => {
					if (chst._id === checklist?._id) {
						const items = chst?.items?.map((it) => {
							if (it?._id === item?._id) {
								return { ...it, dateStart, dateEnd };
							}
							return it;
						});
						return { ...chst, items };
					}
		
					return chst;
				});
		
				dispatch(
					setCheckListTitle({ taskId: task?._id, checklist: newChecklist })
				);
		
				dispatch(setTask({ ...task, checklist: newChecklist }));

				handleClosePopover();
			}
		} catch (error) {
			console.log("error: ", error);
			NotifyMessage(
				"Cập nhật thời gian thực hiện công việc thất bại. Vui lòng thử lại!",
				"error"
			);
		} finally {
			setIsLoading(false);
		}
	};

	const onFocusChange = (value) => {
		dispatch(setModal({ isFocused: value }))
	}

	return (
		<Popover
			placement="right-start"
			backdrop="transparent"
			motionProps={{
				variants: {
					enter: {
						y: 0,
						opacity: 1,
						duration: 0.1,
						transition: {
							opacity: {
								duration: 0.15,
							},
						},
					},
					exit: {
						y: "10%",
						opacity: 0,
						duration: 0,
						transition: {
							opacity: {
								duration: 0.1,
							},
						},
					},
				},
			}}
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			disableAnimation
		>
			<PopoverTrigger>
				<Button
					radius="full"
					variant="bordered"
					className={`min-h-max h-max min-w-max w-max bg-white border-default-400 items-center hover:bg-default-300 p-1 ${
						(!item?.dateStart || !item?.dateEnd) ? 'p-1' : 'px-2 py-1'
					}`}
				>
					{renderDate}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="min-w-80 max-w-80 px-2 py-0 rounded-md overflow-hidden">
				{/* Header */}
				<header className="py-1 relative w-full">
					<h3 className="py-0 px-8 h-10 align-middle text-sm leading-10 text-center tracking-wide font-semibold text-task-title text-ellipsis text-nowrap overflow-hidden">
						{ item?.title }
					</h3>

					<p
						className="p-2 absolute right-1 top-2 cursor-pointer hover:bg-btn-detail rounded-md"
						onClick={handleClosePopover}
					>
						<MdOutlineClose className="text-base text-task-title" />
					</p>
				</header>

				{/* Content */}
				<section className="w-full mb-3 overflow-y-auto max-h-[500px] scrollbar-kanban">
					<DateRangePicker
						popoverProps={{
							className: "min-w-[300px] w-[300px]"
						}}
						calendarProps={{
							className: '!w-full !max-w-full',
							content: '!w-full !max-w-full',
						}}
                        label={<p className="text-xs text-task-title font-semibold">Thời gian thực hiện:</p>}
                        labelPlacement="outside"
						variant="bordered"
						radius="sm"
						className="max-w-xs"
						value={time}
						onChange={setTime}
						onFocusChange={onFocusChange}
					/>

					<Button
						radius="sm"
						variant="solid"
						color="primary"
						className={`mt-3 h-8 float-right items-center`}
						onPress={handleUpdateTimeChecklistItem}
						isLoading={isLoading}
					>
						<span className="font-semibold text-center">Lưu</span>
					</Button>
				</section>
			</PopoverContent>
		</Popover>
	);
}

export default PopupAddTimeChecklistItem;
