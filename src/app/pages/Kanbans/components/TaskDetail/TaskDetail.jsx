import { useDispatch, useSelector } from "react-redux";
import Description from "../../Forms/Description";
import Comments from "../../Forms/Comments";
import TaskName from "../../Forms/TaskName";
import ChecklistValue from "../../Forms/Checklist/components/ChecklistValue";
import SidebarMenu from "../SidebarMenu";
import PopoverAddTask from "../PopoverAddTask";
import { setTask } from "_redux/slice/taskSlice";
import { useEffect, useMemo } from "react";
import { User, Tooltip, Button } from "@nextui-org/react";
import { FaPlus } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { URL_IMAGE } from "_constants";
import moment from "moment";
import ProjectValue from "../../Forms/Project/components/ProjectValue";
import { SlUser } from "react-icons/sl";
import { TiTag } from "react-icons/ti";
import { MdAccessTime } from "react-icons/md";

function TaskDetail({ task }) {
	const dispatch = useDispatch();
	const { task: udTask } = useSelector((state) => state.tasks);
	const { items } = useSelector((state) => state.sidebarTask);

	useEffect(() => {
		if (task) {
			dispatch(setTask(task));
		}
	}, []);

	const perfomersForm = useMemo(
		() => items?.find((item) => item.key === "performers"),
		[items]
	);

	const labelsForm = useMemo(
		() => items?.find((item) => item.key === "labels"),
		[items]
	);

	const datesForm = useMemo(
		() => items?.find((item) => item.key === "dates"),
		[items]
	);

	const isExitsChecked = useMemo(
		() => udTask?.labels?.find((lab) => lab.isChecked),
		[udTask]
	);

	const renderDate = useMemo(() => {
		const startDate = moment(udTask?.dateStart);
		const endDate = moment(udTask?.dateEnd);

		if (
			startDate.isSame(endDate, "month") &&
			startDate.isSame(endDate, "year")
		) {
			return `${startDate.format("DD")} - ${endDate.format(
				"DD MMMM YYYY"
			)}`;
		} else if (startDate.isSame(endDate, "year")) {
			return `${startDate.format("DD/MM")} - ${endDate.format(
				"DD/MM/YYYY"
			)}`;
		} else {
			return `${startDate.format("DD MMMM YYYY")} - ${endDate.format(
				"DD MMMM YYYY"
			)}`;
		}
	}, [udTask]);

	return (
		<div className="mt-2">
			{/* Name */}
			<TaskName />

			{/* Detail */}
			<div className="grid grid-cols-12 gap-4">
				{/* Body Left */}
				<div className="col-span-9 max-md:col-span-12">
					{/* Project */}
					<ProjectValue />

					{/* Perfomers */}
					{!!udTask?.performers?.length && (
						<div className="relative mb-6 mt-2">
							<div className="mb-3">
								<div className="absolute left-0 top-0 p-1">
									<SlUser className="text-xl text-task-icon" />
								</div>

								<p className="ml-12 mt-1 text-base text-task-title leading-7 font-semibold select-none">
									Người thực hiện
								</p>
							</div>
							<div className={`ml-12 mb-3 flex flex-row flex-wrap justify-start`}>
								{udTask?.performers?.map((item) => (
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
											name={`${
												item.name || item.username
											}`}
											description={
												!item.name ? item?.username : ""
											}
											avatarProps={{
												src: item?.avatar
													? `${URL_IMAGE}/${item?.avatar}`
													: "",
											}}
											classNames={{
												base:
													"hover:opacity-50 cursor-pointer",
												description: "hidden",
												name: "hidden",
											}}
										/>
									</Tooltip>
								))}

								{/* Add Perfomers */}
								<PopoverAddTask
									itemKey="performers2"
									item={perfomersForm}
									trigger={
										<span className="hover:opacity-50 cursor-pointer flex relative justify-center items-center box-border overflow-hidden align-middle z-0 outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 w-10 h-10 text-tiny bg-btn-detail-hover text-default-foreground rounded-full">
											<span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-normal text-center text-inherit">
												<FaPlus
													size={"16px"}
													color="rgb(90 105 131)"
												/>
											</span>
										</span>
									}
								/>
							</div>
						</div>
					)}

					{/* Labels */}
					{!!isExitsChecked && (
						<div className="relative mb-6 mt-2">
							<div className="mb-3">
								<div className="absolute left-0 top-0 p-1">
									<TiTag className="text-xl text-task-icon -rotate-90" />
								</div>

								<p className="ml-12 mt-1 text-base text-task-title leading-7 font-semibold select-none">
									Nhãn
								</p>
							</div>

							<PopoverAddTask
								itemKey="labels2"
								item={labelsForm}
								trigger={
									<div
										className={`ml-12 mb-3 flex flex-row w-max gap-2 flex-wrap items-center justify-start`}
									>
										{udTask?.labels?.map(
											(item, index) =>
												item.isChecked && (
													<Tooltip
														key={index}
														placemen="top"
														motionProps={{
															variants: {},
														}}
														classNames={{
															content:
																"p-0 rounded-md",
														}}
														content={
															<span
																className={`rounded-md py-1 px-2 text-wrap text-left text-xs max-w-72 bg-slate-600 text-white font-normal overflow-hidden align-middle`}
															>
																Tiêu đề: "{item?.title}"
															</span>
														}
													>
														<span
															className={`${
																item?.colorCode
																	? `${item?.colorCode} `
																	: ""
															}inline-block cursor-pointer rounded h-8 min-w-12 text-ellipsis text-nowrap overflow-hidden text-left text-xs text-task-label px-2 hover:opacity-50`}
														>
															<span className="block leading-8 max-w-full">
																{item?.title}
															</span>
														</span>
													</Tooltip>
												)
										)}

										{/* Add Labels */}
										<span className="hover:opacity-50 cursor-pointer flex relative justify-center items-center box-border overflow-hidden align-middle z-0 outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 w-8 h-8 text-tiny bg-btn-detail-hover text-default-foreground rounded-md">
											<span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-normal text-center text-inherit">
												<FaPlus
													size={"16px"}
													color="rgb(90 105 131)"
												/>
											</span>
										</span>
									</div>
								}
							/>
						</div>
					)}

					{/* Dates */}
					{!!(udTask?.dateStart && udTask?.dateEnd) && (
						<div className="relative mb-6 mt-2">
							<div className="mb-3">
								<div className="absolute left-0 top-0 p-1">
									<MdAccessTime className="text-xl text-task-icon -rotate-90" />
								</div>

								<p className="ml-12 mt-1 text-base text-task-title leading-7 font-semibold select-none">
									Thời gian thực hiện
								</p>
							</div>
							<PopoverAddTask
								itemKey="dates2"
								item={datesForm}
								trigger={
									<Button
										variant="solid"
										color="primary"
										className={`ml-12 mb-3 bg-btn-detail hover:data-[hover=true]:bg-btn-detail-hover items-center rounded-md py-1 px-2`}
										endContent={
											<IoIosArrowDown className="text-[#505f79] text-base" />
										}
									>
										<span className="font-semibold text-task-title">
											{renderDate}
										</span>
									</Button>
								}
							/>
						</div>
					)}

					{/* Checklist */}
					<ChecklistValue />

					{/* Attachments */}
					{/* <AttachmentsValue /> */}

					{/* Description */}
					<Description />

					{/* Comments */}
					<Comments />
				</div>

				{/* Body Right */}
				<SidebarMenu />
			</div>
		</div>
	);
}

export default TaskDetail;
