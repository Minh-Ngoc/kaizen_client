/* eslint-disable react/no-unescaped-entities */
import { LuPencil } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import TaskDetail from "../TaskDetail";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";
import { AvatarGroup, Tooltip, User } from "@nextui-org/react";
import { convertObjectNewDateToObject } from "_utils";
import { MdAccessTime } from "react-icons/md";
import { FiCheckSquare } from "react-icons/fi";
import { URL_IMAGE } from "_constants";
import { FaRegComment } from "react-icons/fa";
import Header from "../TaskDetail/components/Header";
import { setModal } from "_redux/slice/modalSlice";

function Task({ task }) {
	const dispatch = useDispatch();
	const { tasks } = useSelector((state) => state.tasks);

	// Begin: @dnd-kit
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: task._id,
		data: {
			type: "Task",
			...task,
		},
	});

	const dndKitTaskStyles = {
		transform: CSS.Translate.toString(transform),
		transition,
		height: "100%",
		outline: isDragging ? "2px solid rgb(49, 141, 246)" : undefined,
		boxShadow: isDragging
			? "rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset"
			: undefined,
		opacity: isDragging ? "0.3" : undefined,
	};

	// End: @dnd-kit

	// Begin: Labels
	const labels = useMemo(() => {
		const tsk = tasks?.find((t) => t._id === task._id);

		return tsk.labels;
	}, [tasks]);

	const renderLables = useMemo(() => {
		const isChecked = labels?.find((label) => label.isChecked);

		return (
			<div
				className={`${
					isChecked ? "grid" : "hidden"
				} grid-cols-3 gap-1 max-w-task-label mb-2 mr`}
			>
				{labels?.map(
					(label, index) =>
						label.isChecked && (
							<Tooltip
								key={index}
								placemen="top"
								motionProps={{
									variants: {},
								}}
								classNames={{
									content: "p-0 rounded-md",
								}}
								content={
									<span
										className={`rounded-md py-1 px-2 text-wrap text-left text-xs max-w-56 bg-slate-600 text-white font-normal overflow-hidden align-middle`}
									>
										Color: {label.colorLabel}, title: " {label?.title}"
									</span>
								}
							>
								<span
									key={index}
									className={`${
										label?.colorCode
											? `${label?.colorCode} `
											: ""
									}inline-block rounded min-w-full max-w-full h-4 text-ellipsis text-nowrap overflow-hidden text-left text-xs text-task-label px-2 hover:opacity-50`}
								>
									{label?.title}
								</span>
							</Tooltip>
						)
				)}
			</div>
		);
	}, [task, labels]);
	// End: Labels

	// Dates
	const renderValueDate = useMemo(() => {
		const dateStart =
			convertObjectNewDateToObject(task?.dateStart) || task?.dateStart;
		const startDay =
			dateStart?.day < 10 ? `0${dateStart?.day}` : dateStart?.day;
		const startMonth =
			dateStart?.month < 10 ? `0${dateStart?.month}` : dateStart?.month;
		const startYear = dateStart?.year;

		const dateEnd =
			convertObjectNewDateToObject(task?.dateEnd) || task?.dateEnd;
		const endDay = dateEnd?.day < 10 ? `0${dateEnd?.day}` : dateEnd?.day;
		const endMonth =
			dateEnd?.month < 10 ? `0${dateEnd?.month}` : dateEnd?.month;
		const endYear = dateEnd?.year;

		if (startYear === endYear) {
			return `${startDay} Th ${startMonth} - ${endDay} tháng ${endMonth} ${endYear}`;
		}

		return `${startDay} Th ${startMonth} ${startYear} - ${endDay} tháng ${endMonth} ${endYear}`;
	}, [task]);

	// Item Checklist and Size Comments
	const renderSizeItemChecklist = useMemo(() => {
		const itemsChecklist = task?.checklist
			?.map((chst) => chst?.items?.map((item) => item))
			?.flat();
		const checkedItemsChecklist = task?.checklist
			?.map((chst) => chst.items?.filter((item) => item.isChecked))
			?.flat();

		if (!itemsChecklist?.length) return <div className="invisible"></div>;

		const comments = task?.comments?.length;

		return (
			<div className="flex flex-row items-center gap-5">
				<div className="flex items-center gap-2">
					<FiCheckSquare className="text-base text-task-title min-w-max" />
					<span className="font-normal text-xs text-black">
						{checkedItemsChecklist?.length}/{itemsChecklist?.length}
					</span>
				</div>

				{/* Size Comment */}
				{!!comments && (
					<div className="inline-flex items-center gap-1">
						<FaRegComment className="text-base text-task-title min-w-max" />
						<span className="font-normal text-xs text-black">
							{comments}
						</span>
					</div>
				)}
			</div>
		);
	}, [task]);

	const handleOpenModal = () => {
		dispatch(
			setModal({
				isOpen: true,
				title: "",
				isDismissable: true,
				openConfirm: false,
				openCancel: false,
				bg: "bg-white",
				hideCloseButton: true,
				backdrop: "transparent",
				classNames: {
					// backdrop: "z-[51]",
					wrapper: "w-full overflow-hidden !justify-end",
					base: `max-h-[100vh] !shadow-card-project min-w-[40%] h-full !my-0 !mr-0 rounded-none border-l-1 border-default-300`,
					header: "justify-end border-b-1 border-default-200",
					body: "overflow-y-auto rounded-tr-none !rounded-none p-0",
					closeButton: "right-5 z-10 text-lg",
				},
				header: <Header task={task} />,
				body: <TaskDetail task={task} />,
				motionProps: {
					initial: { x: "100%" },
					animate: { x: "0%" },
					exit: { x: "100%" },
					transition: { duration: 0.5 },
				},
			})
		);
	};

	return (
		<>
			<div
				ref={setNodeRef}
				style={dndKitTaskStyles}
				{...attributes}
				{...listeners}
				className={`select-none relative bg-white h-max flex-col items-start rounded-md py-2 px-2 shadow-input group/icon data-[hover=true]:bg-transparent data-[hover=true]:outline-2 data-[hover=true]:outline-primary-400`}
				// Khi Click vào Button thì set lại open Modal hiện task detail
				onClick={handleOpenModal}
			>
				{/* Task Labels */}
				{renderLables}

				{/* Task Name */}
				<p className="mb-0">{task?.name}</p>

				{/* Time */}
				{task?.dateStart && task?.dateEnd && (
					<div className="flex bg-transparent items-center justify-start rounded-sm gap-2 mt-1 mb-2 py-1 px-0">
						<MdAccessTime className="text-base text-task-title min-w-max" />
						<span className="font-normal text-xs text-black">
							{renderValueDate}
						</span>
					</div>
				)}

				{/* Checklist */}
				<div className="flex flex-wrap items-center justify-between">
					{renderSizeItemChecklist}
					<AvatarGroup max={4} className="gap-1">
						{task?.performers?.map((item) => (
							<Tooltip
								key={item?._id}
								placemen="top"
								motionProps={{ variants: {} }}
								classNames={{
									content: "p-0 rounded-md",
								}}
								content={
									<span
										className={`rounded-md py-1 px-2 text-wrap text-left text-xs max-w-56 bg-slate-600 text-white font-normal overflow-hidden align-middle`}
									>
										{item.name || item.username}
									</span>
								}
							>
								<User
									name={`${item.name || item.username}`}
									description={
										!item.name ? item?.username : ""
									}
									avatarProps={{
										src: item?.avatar
											? `${URL_IMAGE}/${item?.avatar}`
											: "",
									}}
									classNames={{
										base: "hover:opacity-50 cursor-pointer",
										description: "hidden",
										name: "hidden",
									}}
								/>
							</Tooltip>
						))}
					</AvatarGroup>
				</div>

				<span className="absolute right-1 top-1 text-sm invisible group-hover/icon:visible rounded-full p-[6px] bg-white">
					<LuPencil />
				</span>
			</div>
		</>
	);
}

export default Task;
