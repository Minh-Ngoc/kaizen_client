import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	DndContext,
	PointerSensor,
	useSensor,
	useSensors,
	DragOverlay,
	defaultDropAnimationSideEffects,
	closestCorners,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { cloneDeep } from "lodash";
import Task from "../Task";
import {
	GetTasksByUser,
	GetAllTaskByProjectId,
	UpdatePositionTasks,
	setTasks,
} from "_redux/slice/taskSlice";
import { getAllStatus } from "services/api.service";
import ColumnContainer from "app/components/ColumnContainer";

function Board() {
	const { id: projectId } = useParams();
	const dispatch = useDispatch();
	const { tasks, api } = useSelector((state) => state.tasks);
	const [columns, setColumns] = useState([]);
	const [activeTask, setActiveTask] = useState(null);
	const [oddDraggingTask, setDraggingTask] = useState(null);
	const [updateOddTasksInStatus, setUpdateOddTasksInStatus] = useState(null);

	const fetchDataColumns = async () => {
		try {
			const { data } = await getAllStatus();

			if (data.status === 1) {
				const sortedData = data.statuses.sort(
					(a, b) => a.position - b.position
				);

				setColumns(sortedData);
			}
		} catch (error) {
			console.log("error: ", error);
			// NotifyMessage("Không thể tải thông tin cột. Vui lòng tải lại trang!");
		}
	};

	useEffect(() => {
		fetchDataColumns();

		if (api === "tasks") {
			dispatch(GetAllTaskByProjectId(projectId));
		}

		if (api === "my-tasks") {
			dispatch(GetTasksByUser());
		}
	}, []);

	const columnsId = useMemo(() => columns.map((col) => col._id), [columns]);

	const tasksMove = (array, from, to) => {
		const newArray = array;
		const [item] = newArray.splice(from, 1);

		newArray?.splice(to < 0 ? newArray.length + to : to, 0, item);

		const updateTasks = newArray?.map((task, index) => {
			if (task?.position) {
				return { ...task, position: ++index };
			}

			return task;
		});

		return updateTasks;
	};

	const handleDragStart = (event) => {
		setActiveTask(event.active.data.current);

		if (event.active.data.current.statusId) {
			setDraggingTask(event);
		}
	};

	const handleDragOver = (event) => {
		const { active, over } = event;

		if (!over) return;

		const {
			id: activeId,
			data: { current: activeTaskData },
		} = active;

		const {
			id: overId,
			data: { current: overTaskData },
		} = over;

		setDraggingTask(active);

		if (activeId === overId || !activeId || !overId) return;

		const isActiveATask = active.data.current?.type === "Task";
		const isOverATask = over.data.current?.type === "Task";
		const isOverAColumn = over.data.current?.type === "Column";

		if (!isActiveATask) return;

		// Im dropping a Task over another Task
		if (isActiveATask && isOverATask) {
			const cloneTasks = cloneDeep(tasks);
			// Find Task by Task ID
			const activeTasksFromActiveId = cloneTasks.filter(
				(task) => task.statusId === activeTaskData.statusId
			);

			const overTasksFromActiveId = cloneTasks.filter(
				(task) => task.statusId === overTaskData.statusId
			);

			// Find index
			const activeIndex = activeTasksFromActiveId.findIndex(
				(task) => task._id === activeId
			);
			const overIndex = overTasksFromActiveId.findIndex(
				(task) => task._id === overId
			);

			// Update position task with status active !== status over
			if (
				activeTasksFromActiveId[activeIndex]?.statusId !==
					overTasksFromActiveId[overIndex]?.statusId &&
				activeTasksFromActiveId[activeIndex] &&
				overTasksFromActiveId[overIndex]
			) {
				// Fix introduced after video recording
				activeTasksFromActiveId[activeIndex].statusId =
					overTasksFromActiveId[overIndex]?.statusId;

				const updateActiveTasksFromActiveId =
					activeTasksFromActiveId.filter(
						(task) =>
							task._id !==
							activeTasksFromActiveId[activeIndex]._id
					);

				setUpdateOddTasksInStatus(updateActiveTasksFromActiveId);

				// Begin: Find index in tasksColumn
				let newIndex;
				const isBelowOverItem =
					active.rect.current.translated &&
					active.rect.current.translated.top >
						over.rect.top + over.rect.height;

				const modifier = isBelowOverItem ? 1 : 0;

				newIndex =
					overIndex >= 0
						? overIndex + modifier
						: overTasksFromActiveId.length + 1;

				// End: Find index in tasksColumn

				// update activeTasksFromActiveId
				overTasksFromActiveId.splice(
					newIndex,
					0,
					activeTasksFromActiveId[activeIndex]
				);

				// Lọc ra các task từ cloneTasks mà không có trong overTasksIdObj
				const cloneTasks2 = cloneDeep(tasks);
				const overTasksIdSet = new Set(
					overTasksFromActiveId.map((task) => task._id)
				);

				// Lọc ra các task từ cloneTasks mà không có trong overTasksIdSet
				const spreadTasks = cloneTasks2.filter(
					(task) => !overTasksIdSet.has(task._id)
				);

				const newTasks = [
					...spreadTasks,
					...tasksMove(overTasksFromActiveId, activeIndex, newIndex),
				];

				return dispatch(setTasks(newTasks));
			}

			const overTasksIdSet = new Set(
				overTasksFromActiveId.map((task) => task._id)
			);

			// Lọc ra các task từ cloneTasks mà không có trong overTasksIdSet
			const spreadTasks = cloneTasks.filter(
				(task) => !overTasksIdSet.has(task._id)
			);

			// Update position task with status active === status over
			return dispatch(
				setTasks([
					...spreadTasks,
					...tasksMove(overTasksFromActiveId, activeIndex, overIndex),
				])
			);
		}

		// Im dropping a Task over a column

		if (isActiveATask && isOverAColumn) {
			const cloneTasks = cloneDeep(tasks);

			// Find Task by Task ID
			const activeTasksFromActiveId = cloneTasks.filter(
				(task) => task.statusId === activeTaskData?.statusId
			);
			// Find index
			const activeIndex = activeTasksFromActiveId.findIndex(
				(task) => task._id === activeId
			);

			if (
				typeof activeIndex !== "undefined" &&
				overId &&
				activeTasksFromActiveId[activeIndex]
			) {
				activeTasksFromActiveId[activeIndex].statusId = overId;

				const updateActiveTasksFromActiveId =
					activeTasksFromActiveId.filter(
						(task) =>
							task._id !==
							activeTasksFromActiveId[activeIndex]._id
					);

				setUpdateOddTasksInStatus(updateActiveTasksFromActiveId);
			}

			const overTasksIdSet = new Set(
				activeTasksFromActiveId.map((task) => task._id)
			);

			// Lọc ra các task từ cloneTasks mà không có trong overTasksIdSet
			const spreadTasks = cloneTasks.filter(
				(task) => !overTasksIdSet.has(task._id)
			);

			return dispatch(
				setTasks([
					...spreadTasks,
					...tasksMove(
						activeTasksFromActiveId,
						activeIndex,
						activeIndex
					),
				])
			);
		}
	};

	const handleDragEnd = (event) => {
		const { over } = event;
		const active = oddDraggingTask;

		if (!active || !over) return;

		const {
			data: { current: activeTaskData },
		} = active;

		const activeId = activeTaskData?._id;

		const {
			id: overId,
			data: { current: overTaskData },
		} = over;

		// Im dropping a Task over another Task
		const cloneTasks = cloneDeep(tasks);

		// Find Task by Task ID
		const activeTasksFromActiveId = cloneTasks.filter(
			(task) => task.statusId === activeTaskData.statusId
		);

		const overTasksFromActiveId = cloneTasks.filter(
			(task) => task.statusId === overTaskData.statusId
		);

		if (!overTasksFromActiveId?.length) return;

		// Find index
		const activeIndex = activeTasksFromActiveId.findIndex(
			(task) => task._id === activeId
		);
		const overIndex = overTasksFromActiveId.findIndex(
			(task) => task._id === overId
		);

		// Call API Update Active Tasks From ActiveId: updateOddTasksInStatus
		// Call Update position task: tasksMove(overTasksFromActiveId, activeIndex, overIndex)

		try {
			dispatch(
				UpdatePositionTasks({
					projectId: projectId || "",
					activeTasks: updateOddTasksInStatus,
					overTasks: tasksMove(
						overTasksFromActiveId,
						activeIndex,
						overIndex
					),
				})
			);
		} catch (error) {
			console.log("error: ", error);
		} finally {
			setDraggingTask(null);
			setActiveTask(null);
			setUpdateOddTasksInStatus(null);
		}
	};

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 10,
			},
		})
	);

	const customDropAnimation = {
		sideEffects: defaultDropAnimationSideEffects({
			styles: { active: { opacity: "0.5" } },
		}),
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCorners}
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onDragEnd={handleDragEnd}
		>
			<div className="scrollbar-kanban overflow-hidden max-w-board shadow-wrapper bg-table rounded-lg absolute flex py-4 pl-2 pr-0 w-full top-0 left-4 bottom-0 mt-28">
				<SortableContext items={columnsId}>
					{columns?.map((col) => (
						<ColumnContainer
							key={col?._id}
							column={col}
							tasks={tasks?.filter(
								(task) => task?.statusId === col?._id
							)}
						/>
					))}
				</SortableContext>

				{/* createPortal lets you render some children into a different part of the DOM.*/}
				{createPortal(
					<DragOverlay dropAnimation={customDropAnimation}>
						{activeTask ? <Task task={activeTask} /> : null}
					</DragOverlay>,
					document.body
				)}
			</div>
		</DndContext>
	);
}
export default Board;
