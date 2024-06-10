import { useCallback, useEffect, useState } from "react";

import { FaTrash } from "react-icons/fa6";

import {
	ColumnDirective,
	ColumnsDirective,
	Inject,
	TreeGridComponent,
	RowDD,
	Selection,
} from "@syncfusion/ej2-react-treegrid";

import { Button, Tooltip } from "@nextui-org/react";

import { useMemo } from "react";
import { getTaskById } from "services/api.service";
import { LiaEditSolid } from "react-icons/lia";

import { setTask, addTask, addTopTask } from "_redux/slice/taskSlice";

import { FaPlus, FaProjectDiagram } from "react-icons/fa";
import { LuClock2 } from "react-icons/lu";

import { useRef } from "react";

import { useDispatch } from "react-redux";

import { updatePositionTasks } from "services/api.service";
import TaskName from "../TaskName";
import Project from "../Project";
import DueDate from "../DueDate";
import InputComp from "../Input";
import { IoIosListBox } from "react-icons/io";
import { RiToolsFill } from "react-icons/ri";
import { setModal } from "_redux/slice/modalSlice";
import Header from "app/pages/Kanbans/components/TaskDetail/components/Header";
import TaskDetail from "app/pages/Kanbans/components/TaskDetail";
import { isValidObjectId } from "_utils";

const TreeList = ({ data, onOpenEdit, onOpenDelete, setSelectedTask }) => {
	const [newData, setNewData] = useState([]);
	const [newData2, setNewData2] = useState([]);
	const [statusId, setStatusId] = useState("");

	const handleUpdateTasks = async (item) => {
		const tasks = data?.filter((it) => isValidObjectId(it?.taskId));
		const newTasks = [
			{ ...item, taskName: item?.name, taskId: item?._id },
			...tasks,
		];
		const newPosition = newTasks?.map((it, index) => {
			return {
				_id: it.taskId,
				statusId: it?.statusId,
				project: it.project,
				name: it.taskName,
				position: index + 1,
			};
		});
		console.log("Tasks", newPosition);

		await updatePositionTasks({
			projectId: "",
			overTasks: newPosition,
		});
	};
	const dispatch = useDispatch();
	const handleAddTask = (args) => {
		dispatch(addTask(args));
	};
	const handleAddTopTask = (args) => {
		dispatch(addTopTask(args));
	};
	const handleEditTask = async (taskId) => {
		const task = await getTaskById(taskId);
		const result = task?.data?.result[0];
		dispatch(setTask(result));
		handleOpenModal(result);
		// onOpenEdit();
	};
	const handleOpenModal = (task) => {
		dispatch(
			setModal({
				isOpen: true,
				title: <p className="text-black">Tạo dự án mới</p>,
				isDismissable: true,
				openConfirm: false,
				openCancel: false,
				bg: "bg-white",
				hideCloseButton: true,
				backdrop: "transparent",
				classNames: {
					// backdrop: "z-[51]",
					wrapper: "w-full overflow-hidden !justify-end",
					base: `max-h-[100vh] !shadow-card-project min-w-[40%] h-full !my-0 !mr-0 rounded-none shadow-[rgba(0,_0,_0,_0.05)_0px_6px_24px_0px,_rgba(0,_0,_0,_0.08)_0px_0px_0px_1px]`,
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

	const colsDirective = useMemo(
		() => [
			{
				field: "taskName",
				headerText: "Task Name",

				width: "180",
				headerTemplate: () => {
					return (
						<div className="flex items-center gap-2 ">
							<FaProjectDiagram size={20} />
							<b className="e-header uppercase">Công việc</b>
						</div>
					);
				},
				template: (args) => {
					return (
						<div
							className={`w-[300px]  cursor-pointer ${
								args?.type === "add" && "add-task"
							}`}
						>
							{args?.type === "add" || args.level === 0 ? (
								<div
									className={`${
										args?.type === "add" && "cursor-pointer"
									}  flex items-center h-10`}
									onClick={() =>
										args?.type === "add" &&
										handleAddTask(args)
									}
								>
									{args?.taskName}
								</div>
							) : !args?.taskId ? (
								<div className="w-full h-full flex items-center">
									<InputComp
										content={args?.taskName}
										level={args?.level}
										checklists={args?.checklists}
										status={args?.status}
										taskId={args?.taskId}
										statusId={args?.statusId}
										onUpdateTasks={handleUpdateTasks}
									/>
								</div>
							) : (
								<TaskName
									content={args?.taskName}
									level={args?.level}
									checklists={args?.checklists}
									status={args?.status}
									taskId={args?.taskId}
									statusId={args?.statusId}
								/>
							)}
						</div>
					);
				},
			},
			{
				field: "project",
				headerText: "Dự án",
				textAlign: "Left",
				width: "180",
				headerTemplate: () => {
					return (
						<div className="flex items-center gap-2 ">
							<IoIosListBox size={20} />
							<b className="e-header uppercase">Dự án</b>
						</div>
					);
				},
				template: (args) => {
					return (
						args?.level === 1 &&
						args?.type !== "add" &&
						args?.taskId && (
							<Project
								project={args?.project}
								taskId={args?.taskId}
								statusId={args?.statusId}
								dateStart={args.dateStart}
								dateEnd={args.dateEnd}
							/>
						)
					);
				},
			},
			{
				field: "dueDate",
				headerText: "Thời gian thực hiện",
				width: "130",
				textAlign: "Left",
				editType: "stringedit",
				headerTemplate: () => {
					return (
						<div className="flex items-center gap-2 ">
							<LuClock2 size={20} />

							<b className="e-header uppercase">
								Thời gian thực hiện
							</b>
						</div>
					);
				},
				template: (args) => {
					return (
						<>
							{args?.level === 1 &&
								args?.type !== "add" &&
								args?.taskId && (
									<DueDate
										dateStart={args.dateStart}
										dateEnd={args.dateEnd}
										index={args?.index}
										taskId={args?.taskId}
										project={args?.project}
										statusId={args?.statusId}
									/>
								)}
						</>
					);
				},
			},
			// {
			// 	field: "performers",
			// 	headerText: "Người thực hiện",
			// 	width: "150",
			// 	textAlign: "Left",
			// 	headerTemplate: () => {
			// 		return (
			// 			<div className="flex items-center gap-2 uppercase">
			// 				<FaUserFriends size={20} />
			// 				<b className="e-header uppercase">Người thực hiện</b>
			// 			</div>
			// 		);
			// 	},
			// 	template: (args) => {
			// 		return (
			// 			args?.level === 1 &&
			// 			args?.type !== "add" &&
			// 			args?.taskId && (
			// 				<Performer
			// 					taskId={args?.taskId}
			// 					index={args?.index}
			// 					performers={args.performers}
			// 					projectId={args?.project?._id}
			// 				/>
			// 			)
			// 		);
			// 	},
			// },
			{
				field: "action",
				headerText: "THAO TÁC",
				width: "80",
				textAlign: "Left",
				headerTemplate: () => {
					return (
						<div className="flex items-center gap-2 justify-center">
							<RiToolsFill size={20} className="text-xl  " />
							<b className="e-header  uppercase">THAO TÁC</b>
						</div>
					);
				},
				template: (args) => {
					return (
						args?.level === 1 &&
						args?.type !== "add" &&
						args?.taskId && (
							<div className="flex items-center justify-center gap-2">
								<Tooltip
									color={"primary"}
									content={"Chỉnh sửa"}
									className="capitalize"
									disableAnimation={true}
								>
									<div
										className="w-[30px] h-[30px] rounded-full text-white bg-[#0389e9] flex items-center justify-center cursor-pointer"
										onClick={() =>
											handleEditTask(args?.taskId)
										}
									>
										<LiaEditSolid size={16} />
									</div>
								</Tooltip>
								<Tooltip
									color={"danger"}
									content={"Xóa"}
									className="capitalize"
									disableAnimation={true}
								>
									<div
										className="w-[30px] h-[30px] rounded-full text-white bg-red-500 flex items-center justify-center cursor-pointer"
										onClick={() => {
											onOpenDelete();
											setSelectedTask({
												taskId: args?.taskId,
												statusId: args?.statusId,
											});
										}}
									>
										<FaTrash size={16} />
									</div>
								</Tooltip>
							</div>
						)
					);
				},
			},
		],
		[]
	);
	const treegridInstance = useRef(null);

	const rowDrop = useCallback(
		(args) => {
			if (args.dropPosition === "middleSegment") {
				args.cancel = true;

				treegridInstance.current.reorderRows(
					[args.fromIndex],
					args.dropIndex,
					"above"
				);
			}

			const posData =
				treegridInstance?.current?.infiniteScrollData[args.fromIndex];

			const posData2 =
				treegridInstance?.current?.infiniteScrollData[args.dropIndex];

			if (posData?.statusId === posData2?.statusId) {
				const itemData = treegridInstance?.current?.parentData?.find(
					(it) => it?.statusId === posData?.statusId
				);

				setNewData(itemData?.childRecords);
			} else {
				const itemData = treegridInstance?.current?.parentData?.find(
					(it) => it.statusId === posData?.statusId
				);
				const itemData2 = treegridInstance?.current?.parentData?.find(
					(it) => it.statusId === posData2?.statusId
				);
				setNewData(itemData?.childRecords);
				setNewData2(itemData2?.childRecords);
				setStatusId(posData2?.statusId);
			}
		},
		[treegridInstance.current, data]
	);
	const updateData = async () => {
		if (newData?.length > 0 || newData2?.length > 0) {
			if (newData?.length > 0 && newData2?.length > 0) {
				const newPosition = newData
					?.filter((it) => isValidObjectId(it?.taskId))
					?.map((item, index) => {
						return {
							_id: item?.taskId,
							statusId: item?.parentItem?.statusId,
							project: item?.project,
							name: item?.taskName,
							position: item?.position,
						};
					});
				const newPosition2 = newData2
					?.filter((it) => isValidObjectId(it?.taskId))
					?.map((item, index) => {
						return {
							_id: item?.taskId,
							statusId: statusId,
							project: item?.project,
							name: item?.taskName,
							position: index + 1,
						};
					});
				await updatePositionTasks({
					projectId: "",
					activeTasks: newPosition,
					overTasks: newPosition2,
				});
				setNewData([]);
				setNewData2([]);
			} else {
				const newPosition = newData
					?.filter((it) => isValidObjectId(it?.taskId))
					?.map((item, index) => {
						return {
							_id: item.taskId,
							statusId: item?.parentItem?.statusId,
							project: item.project,
							name: item.taskName,
							position: index + 1,
						};
					});

				await updatePositionTasks({
					projectId: "",
					overTasks: newPosition,
				});

				setNewData([]);
			}
		}
	};
	useEffect(() => {
		updateData();
	}, [newData, newData2]);
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
				item.innerText.toLowerCase() ===
				"Claim your free account".toLowerCase()
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
	}, []);
	const rowDragStartHelper = (args) => {
		const element = args?.data[0];
		if (element?.level === 0) {
			args.cancel = true;

			return;
		}
	};
	return (
		<div className="mt-5">
			<Button
				color="success"
				className="text-white bg-[#4573d2]"
				size="sm"
				startContent={<FaPlus />}
				onClick={() =>
					handleAddTopTask({ statusId: data[0]?.statusId })
				}
			>
				Add Task
			</Button>
			<div className="mt-5 bg-table p-4 shadow-wrapper rounded-lg">
				<TreeGridComponent
					id="treegridcontrol"
					allowRowDragAndDrop={true}
					ref={treegridInstance}
					dataSource={data || []}
					treeColumnIndex={0}
					childMapping="subtasks"
					height="auto"
					rowHeight="35"
					columns={colsDirective}
					gridLines="Both"
					selectionSettings={{ type: "Multiple" }}
					rowDrop={rowDrop}
					rowDragStartHelper={rowDragStartHelper}
					idMapping="taskId"
					parentIdMapping="parentID"
					loadChildOnDemand={true}
				>
					<ColumnsDirective>
						{colsDirective?.map((item, index) => (
							<ColumnDirective
								key={index}
								field={item.field}
								headerText={item.headerText}
								headerTemplate={item?.headerTemplate}
								width={item.width}
								edit={item.edit}
								template={item.template}
								textAlign={item.textAlign}
								className="cursor-pointer "
							/>
						))}
					</ColumnsDirective>
					<Inject services={[RowDD, Selection]} />
				</TreeGridComponent>
			</div>
		</div>
	);
};

export default TreeList;
