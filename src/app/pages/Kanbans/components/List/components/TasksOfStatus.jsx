import {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import NewTask from "./NewTask";
import {Button, Tooltip, User} from "@nextui-org/react";
import {FaPlus} from "react-icons/fa6";
import {BiSolidRightArrow} from "react-icons/bi";
import {URL_IMAGE} from "_constants";
import moment from "moment";
import ChecklistsOfTask from "./ChecklistsOfTask";
import PopoverAddTask from "../../PopoverAddTask";
import {SlUser} from "react-icons/sl";
import Performers from "app/pages/Kanbans/Forms/Performers";
import {MdAccessTime} from "react-icons/md";
import Dates from "app/pages/Kanbans/Forms/Dates";
import {setTask} from "_redux/slice/taskSlice";

function TasksOfStatus() {
	const dispatch = useDispatch();
	const {tasksOfStatus, newTask} = useSelector((state) => state.tasks);
	const [activeIndex, setActiveIndex] = useState(null);
	const [activeTaskIndex, setActiveTaskIndex] = useState(null);
	const [oddPanel, setOddPanel] = useState(null);
	const [oddPanelTask, setOddPanelTask] = useState(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (Object.keys(newTask)?.length) {
			const panel = document.getElementById(`panel-${newTask?.statusId}`);

			if (panel) {
				panel.style.maxHeight = panel.scrollHeight + 70 + "px";
			}
		}
	}, [newTask]);

	const toggleAccordion = (status) => {
		const panel = document.getElementById(`panel-${status}`);

		if (oddPanel && oddPanel !== panel) {
			oddPanel.style.maxHeight = null;
		}

		setActiveIndex((prevIndex) => (prevIndex === status ? null : status));
		setOddPanel(panel);

		if (panel && panel.style.maxHeight) {
			panel.style.maxHeight = null;
		} else {
			panel.style.maxHeight = panel?.scrollHeight + "px";
		}
	};

	const toggleAccordionTask = (task) => {
		const panel = document.getElementById(`panel-${task}`);
		const panelStatus = document.getElementById(`panel-${activeIndex}`);

		if (oddPanelTask && oddPanelTask !== panel) {
			oddPanelTask.style.maxHeight = null;
		}

		setActiveTaskIndex((prevIndex) => (prevIndex === task ? null : task));
		setOddPanelTask(panel);

		if (panel && panel.style.maxHeight) {
			panel.style.maxHeight = null;
		} else {
			panel.style.maxHeight = panel?.scrollHeight + "px";
			panelStatus.style.maxHeight =
				panelStatus?.scrollHeight + panel?.scrollHeight + "px";
		}
	};

	const renderDate = useCallback(
		(task) => {
			if (!task?.dateStart || !task?.dateEnd) return "(Trống)";
			const startDate = moment(task?.dateStart);
			const endDate = moment(task?.dateEnd);

			if (
				startDate.isSame(endDate, "month") &&
				startDate.isSame(endDate, "year")
			) {
				return `${startDate.format("DD")} - ${endDate.format("DD MMMM YYYY")}`;
			} else if (startDate.isSame(endDate, "year")) {
				return `${startDate.format("DD/MM")} - ${endDate.format("DD/MM/YYYY")}`;
			} else {
				return `${startDate.format("DD MMMM YYYY")} - ${endDate.format(
					"DD MMMM YYYY"
				)}`;
			}
		},
		[tasksOfStatus]
	);

	const handleSetTask = useCallback((task) => {
		dispatch(setTask(task));
	}, [tasksOfStatus]);

	return tasksOfStatus?.map((status, index) => (
		<div
			key={status?._id}
			className={`col-span-12 ${
				index < tasksOfStatus?.length - 1
					? " border-b-1 border-slate-500/50"
					: ""
			}`}
		>
			<Button
				fullWidth
				variant="solid"
				color="primary"
				className={`bg-transparent gap-5 h-14 hover:data-[hover=true]:bg-slate-500/50 justify-start items-center rounded-sm py-3 px-2`}
				startContent={
					<BiSolidRightArrow
						className={`text-slate-300 text-base transition-transform duration-100 ease-linear ${
							activeIndex === status?._id ? "rotate-90" : "rotate-0"
						}`}
					/>
				}
				onClick={() => toggleAccordion(status?._id)}
			>
				<span className="font-semibold text-lg text-white">{status?.name}</span>
			</Button>

			{/* Render Tasks Of Status */}
			<div
				id={`panel-${status?._id}`}
				className={`overflow-hidden transition-all max-h-0 w-full ${
					visible ? "bg-slate-500/50" : "bg-transparent"
				} grid grid-cols-12 ${activeIndex === status?._id ? "mb-3" : "my-0"}`}
			>
				{!!status?.tasks?.length &&
					status?.tasks?.map((task, index) => (
						<>
							<div
								key={index}
								className="col-span-12 items-center grid grid-cols-12  hover:bg-slate-500/50"
							>
								{/* Task Name */}
								<div
									className={`ml-12 pr-2 col-span-4 h-full py-5 flex items-center border-r-1 border-b-1 border-slate-500/50 ${
										index === 0 ? "border-t-1" : "border-t-0"
									}`}
								>
									<div className="flex items-center gap-5">
										{/* ------------    Detail Task    ------------ */}
										{!!task?.checklist?.length && (
											<Button
												variant="solid"
												color="primary"
												className={`bg-transparent min-w-max min-h-max w-max gap-5 hover:data-[hover=true]:bg-slate-500/50 justify-start items-center rounded-sm px-2`}
												onClick={() => toggleAccordionTask(task?._id)}
											>
												<BiSolidRightArrow
													className={`text-slate-300 text-base transition-transform duration-100 ease-linear ${
														activeTaskIndex === task?._id
															? "rotate-90"
															: "rotate-0"
													}`}
												/>
											</Button>
										)}

										<p>{task?.name}</p>
									</div>
								</div>

								{/* Date */}
								<div
									className={`px-2 col-span-2 h-full py-5 flex items-center border-r-1 border-b-1 border-slate-500/50 ${
										index === 0 ? "border-t-1" : "border-t-0"
									}`}
								>
									<PopoverAddTask
										itemKey={`dates-${task?._id}`}
										item={{
											key: `dates-${task?._id}`,
											label: "Thời gian thực hiện",
											icon: <MdAccessTime size={"16px"} />,
											content: <Dates />,
											error: false,
										}}
										trigger={
											<Button
												variant="solid"
												color="primary"
												className="!bg-transparent"
												onClick={() => handleSetTask(task)}
											>
												<span className="font-semibold">
													{renderDate(task)}
												</span>
											</Button>
										}
									/>
								</div>

								{/* Performers */}
								<div
									className={`px-2 col-span-4 h-full py-5 flex items-center border-r-1 border-b-1 border-slate-500/50 ${
										index === 0 ? "border-t-1" : "border-t-0"
									}`}
								>
									{task?.performers?.map((item) => (
										<Tooltip
											key={item?._id}
											placemen="top"
											motionProps={{variants: {}}}
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
												description={!item.name ? item?.username : ""}
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

									{/* Add Perfomers */}
									<PopoverAddTask
										itemKey={`performers-${task?._id}`}
										item={{
											key: `performers-${task?._id}`,
											label: "Người thực hiện",
											icon: <SlUser size={"16px"} />,
											content: (
												<Performers task={task} statusId={status?._id} />
											),
											error: false,
										}}
										trigger={
											<span
												className="hover:opacity-50 cursor-pointer flex relative justify-center items-center box-border overflow-hidden align-middle z-0 outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 w-10 h-10 text-tiny bg-btn-detail-hover text-default-foreground rounded-full"
												onClick={() => handleSetTask(task)}
											>
												<span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-normal text-center text-inherit">
													<FaPlus size={"16px"} color="rgb(90 105 131)" />
												</span>
											</span>
										}
									/>
								</div>

								{/* Checklist */}
								<div
									className={`px-2 col-span-2 h-full py-5 flex items-center border-r-1 border-b-1 border-slate-500/50 ${
										index === 0 ? "border-t-1" : "border-t-0"
									}`}
								>
									{task?.checklist?.length || 0}
								</div>
							</div>

							<ChecklistsOfTask task={task} activeIndex={activeTaskIndex} />
						</>
					))}

				{visible === status?._id ? (
					<div className={`pl-12 col-span-4`}>
						<NewTask
							statusId={status?._id}
							visible={visible}
							onClose={() => setVisible(false)}
						/>
					</div>
				) : (
					<Button
						fullWidth
						variant="solid"
						color="primary"
						className={`col-span-12 bg-transparent h-10 hover:data-[hover=true]:bg-slate-500/50 justify-start items-center rounded-sm py-8 pl-12`}
						startContent={<FaPlus className="text-slate-300 text-base" />}
						onClick={() => setVisible(status?._id)}
					>
						<span className="font-semibold text-base text-white">
							Tạo công việc mới
						</span>
					</Button>
				)}
			</div>
		</div>
	));
}

export default TasksOfStatus;
