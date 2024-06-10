import {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import {Spinner} from "@nextui-org/react";
import {
	GanttComponent,
	ColumnsDirective,
	ColumnDirective,
	Inject,
	Edit,
	Selection,
	Toolbar,
} from "@syncfusion/ej2-react-gantt";
import moment from "moment";
import {useDispatch} from "react-redux";
import {UpdateTask} from "_redux/slice/taskSlice";
import NotifyMessage from "_utils/notify";
import {
	updateChecklist,
	updateItemChecklist,
	getTasksForGantt,
} from "services/api.service";

function Gantt() {
	const {id: projectId} = useParams();
	const dispatch = useDispatch();

	const ganttInstance = useRef(null);
	const [tasks, setTasks] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [taskWithOutDate, setTaskWithOutDate] = useState([]);

	// Begin: Hide Modal License
	useEffect(() => {
		const syncfusionA = document.querySelectorAll("a");
		const syncfusion = document.querySelector(
			'[href="https://www.syncfusion.com/account/claim-license-key?pl=SmF2YVNjcmlwdA==&vs=MjU="]'
		);
		const syncfusionPopUp = document.querySelectorAll(
			'[href="https://www.syncfusion.com/account/claim-license-key?pl=SmF2YVNjcmlwdA==&vs=MjU="]'
		)?.[1];
		syncfusionA?.forEach((item) => {
			if (
				item.innerText.toLowerCase() === "Claim your free account".toLowerCase()
			) {
				item.parentElement.style.display = "none";
				console.log(item.style);
			}

			if (item.innerText === "Claim your FREE account") {
				item.parentElement.parentElement.style.display = "none";
			}
		});

		if (syncfusion) {
			syncfusion.parentElement.style.display = "none";
		}

		if (syncfusionPopUp) {
			const parentElement = syncfusionPopUp.parentElement.parentElement;
			if (parentElement) {
				parentElement.style.display = "none";
			}

			syncfusionPopUp.parentElement.style.display = "none";
		}
	}, [tasks, taskWithOutDate]);
	// End: Hide Modal License

	const fetchData = async (id) => {
		try {
			setIsLoading(true);
			let listTaskWithoutDate = [];
			const {data} = await getTasksForGantt(id);

			const returnDate = (date) =>
				date ? moment(date).format("YYYY-MM-DD") : null;

			const addTaskWithoutDate = (it) => {
				if (!it?.dateStart || !it?.dateEnd) {
					listTaskWithoutDate = [...listTaskWithoutDate, it?._id];
				}
			};

			if (data?.status === 1) {
				// Ensure date fields are formatted as strings
				const formattedTasks = data.tasks.map((status) => ({
					...status,
					dateStart: null,
					dateEnd: null,
					child: status?.child?.map((task) => {
						addTaskWithoutDate(task);

						return {
							...task,
							dateStart: returnDate(task?.dateStart),
							dateEnd: returnDate(task?.dateEnd),
							parentDateStart: task?.project?.dateStart
								? task?.project?.dateStart
								: null,
							parentDateEnd: task?.project?.dateEnd
								? task?.project?.dateEnd
								: null,
							child: task?.child?.map((chst) => {
								addTaskWithoutDate(chst);

								return {
									...chst,
									dateStart: returnDate(chst?.dateStart),
									dateEnd: returnDate(chst?.dateEnd),
									parentDateStart: returnDate(task?.dateStart),
									parentDateEnd: returnDate(task?.dateEnd),
									child: chst?.items?.map((item) => {
										addTaskWithoutDate(item);

										return {
											...item,
											name: item?.title,
											checklistId: chst?._id,
											taskId: task?._id,
											dateStart: returnDate(item?.dateStart),
											dateEnd: returnDate(item?.dateEnd),
											duration:
												!item?.dateStart || !item?.dateEnd
													? 0
													: moment(item?.dateEnd, "YYYY-MM-DD").diff(
															moment(item?.dateStart, "YYYY-MM-DD"),
															"days"
													  ) + 1,
											field: "item",
											parentDateStart: returnDate(chst?.dateStart),
											parentDateEnd: returnDate(chst?.dateEnd),
										};
									}),
								};
							}),
						};
					}),
				}));
				setTaskWithOutDate(listTaskWithoutDate);
				setTasks(formattedTasks);
			}
		} catch (error) {
			console.log("error: ", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchData(projectId);
	}, [projectId]);

	const colsDirective = [
		{
			field: "_id",
			headerText: "ID",
			width: "40",
			visible: false,
		},
		{
			field: "name",
			headerText: "CÔNG VIỆC",
			width: "150",
			visible: true,
			template: (args) => (
				<h3 className="text-base font-medium">{args?.taskData?.name}</h3>
			),
		},
		{
			field: "dateStart",
			headerText: "NGÀY BẮT ĐẦU DỰ KIẾN",
			width: "50",
			visible: true,
			template: (args) => {
				return (
					<p>
						{args?.taskData?.dateStart
							? moment(args?.taskData?.dateStart).format("DD-MM-YYYY")
							: ""}
					</p>
				);
			},
		},
		{
			field: "dateEnd",
			headerText: "NGÀY HOÀN THÀNH DỰ KIẾN",
			width: "50",
			visible: true,
			template: (args) => {
				return (
					<p>
						{args?.taskData?.dateEnd
							? moment(args?.taskData?.dateEnd).format("DD-MM-YYYY")
							: ""}
					</p>
				);
			},
		},
		{
			field: "duration",
			headerText: "THỜI GIAN",
			width: "50",
			visible: true,
			template: (args) => {
				return (
					<p>
						{args?.taskData?.duration ? `${args?.taskData?.duration} ngày` : ""}
					</p>
				);
			},
		},
	];

	const taskFields = {
		id: "_id",
		name: "name",
		startDate: "dateStart",
		endDate: "dateEnd",
		duration: "duration",
		child: "child",
	};

	const editSettings = {
		allowTaskbarEditing: true,
		mode: "Dialog",
	};

	const taskbarTooltip = (props) => (
		<table>
			<tbody>
				<tr>
					<td className="p-2 font-medium text-base">{props?.name}</td>
				</tr>
				{!!props.taskData.duration && (
					<>
						<tr>
							<td className="p-2 text-sm">Ngày bắt đầu:</td>
							<td className="p-2 text-sm">
								{moment(props.taskData.dateStart).format("DD-MM-YYYY")}
							</td>
						</tr>
						<tr>
							<td className="p-2 text-sm">Ngày hoàn thành:</td>
							<td className="p-2 text-sm">
								{moment(props.taskData.dateEnd).format("DD-MM-YYYY")}
							</td>
						</tr>
						<tr>
							<td className="p-2 text-sm">Số ngày thực hiện:</td>
							<td className="p-2 text-sm">{`${props.taskData.duration} ngày`}</td>
						</tr>
					</>
				)}
			</tbody>
		</table>
	);

	const tooltipSettings = {
		showTooltip: true,
		taskbar: taskbarTooltip.bind(this),
	};

	const settings = {
		mode: "Cell",
	};

	const cellSelecting = (args) => {
		console.log("args: ", args);
		if (args.cellIndex.cellIndex === 1) {
			console.log("cellIndex: ", args.cellIndex);
		}
	};

	const handleChangeDate = async (event) => {
		const field = event?.data?.taskData?.field;

		if (field === "status") return;

		const start = moment(new Date(event?.editingFields?.startDate));
		const end = moment(new Date(event?.editingFields?.endDate));

		const parentDateStart = moment(event?.data?.taskData?.parentDateStart);
		const parentDateEnd = moment(event?.data?.taskData?.parentDateEnd);

		const dateStart = moment(event?.editingFields?.startDate)
			.startOf("day")
			.toISOString();
		const dateEnd = moment(event?.editingFields?.endDate)
			.endOf("day")
			.toISOString();

		if (start.isSame(parentDateStart) || end.isSame(parentDateEnd, "day"))
			return;

		switch (field) {
			case "task":
				const result = await dispatch(
					UpdateTask({
						id: event?.data?._id,
						body: {dateStart, dateEnd},
					})
				).unwrap();

				break;

			case "checklist":
				try {
					const {data} = await updateChecklist(event?.data?._id, {
						taskId: event?.data?.taskData?.taskId,
						dateStart,
						dateEnd,
					});

					if (data.status === 1) {
						NotifyMessage(
							"Cập nhật thời gian thực hiện công việc thành công!",
							"success"
						);
					}
				} catch (error) {
					console.log("error: ", error);
					NotifyMessage(
						"Cập nhật thời gian thực hiện công việc thất bại. Vui lòng thử lại!",
						"error"
					);
				} finally {
					break;
				}

			case "item":
				try {
					const {data} = await updateItemChecklist(
						event?.data?.taskData?.checklistId,
						event?.data?._id,
						{
							taskId: event?.data?.taskData?.taskId,
							dateStart,
							dateEnd,
						}
					);

					if (data.status === 1) {
						NotifyMessage(
							"Cập nhật thời gian thực hiện công việc thành công!",
							"success"
						);
					}
				} catch (error) {
					console.log("error: ", error);
					NotifyMessage(
						"Cập nhật thời gian thực hiện công việc thất bại. Vui lòng thử lại!",
						"error"
					);
				} finally {
					break;
				}
		}

		if (taskWithOutDate?.includes(event?.data?._id)) {
			fetchData(projectId);

			setTaskWithOutDate(
				taskWithOutDate.filter((item) => item != event?.data?._id)
			);
		}
	};

	const taskbarEditing = async (args) => {
		const field = args?.data?.taskData?.field;

		const start = moment(new Date(args?.editingFields?.startDate));
		const end = moment(new Date(args?.editingFields?.endDate));

		const parentDateStart = moment(args?.data?.taskData?.parentDateStart);
		const parentDateEnd = moment(args?.data?.taskData?.parentDateEnd);

		switch (field) {
			case "status":
				args.cancel = true;

				break;

			case "task":
			case "checklist":
			case "item":
				if (start.isBefore(parentDateStart)) {
					return (args.cancel = true);
				}

				if (end.isAfter(parentDateEnd, "day")) {
					return (args.cancel = true);
				}

				args.cancel = false;
				break;
		}
	};

	return (
		<div className="scrollbar-kanban shadow-card-project flex p-4 w-full overflow-y-auto max-h-[80vh] bg-table rounded-lg my-5">
			{!isLoading ? (
				<GanttComponent
					id="TooltipTemplate"
					locale="vi-VI"
					width={"100%"}
					height="max-content"
					taskMode="Manual"
					enablePredecessorValidation={false}
					toolbar={["PrevTimeSpan", "NextTimeSpan"]}
					includeWeekend={true}
					treeColumnIndex={1}
					ref={ganttInstance}
					dataSource={tasks || []}
					taskFields={taskFields}
					editSettings={editSettings}
					tooltipSettings={tooltipSettings}
					taskbarEditing={taskbarEditing}
					taskbarEdited={handleChangeDate}
				>
					<ColumnsDirective>
						{colsDirective?.map((col, index) => (
							<ColumnDirective
								key={index}
								field={col.field}
								headerText={col.headerText}
								width={col.width}
								visible={col.visible}
								template={col?.template || null}
							/>
						))}
					</ColumnsDirective>
					<Inject services={[Edit, Selection, Toolbar]} />
				</GanttComponent>
			) : (
				<div className="w-full min-h-80 flex items-center justify-center">
					<Spinner color="default" size="lg" />
				</div>
			)}
		</div>
	);
}

export default Gantt;
