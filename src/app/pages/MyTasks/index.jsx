import { useEffect } from "react";

import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useDisclosure } from "@nextui-org/react";

import ModalSingleDelete from "app/components/Modal/ModalSingleDelete";
import { DeleteTask } from "_redux/slice/taskSlice";

import ModalEditTask from "./components/modal/ModalEditTask";

import { GetPagingMyTask } from "_redux/slice/taskSlice";

import { GetPagingProject } from "_redux/slice/projectSlice";

import TreeList from "./components/TreeList";
import { cloneDeep } from "lodash";
import { deleteTask } from "_redux/slice/taskSlice";

function MyTasks() {
	const dispatch = useDispatch();

	const {
		isOpen: isOpenEdit,
		onOpen: onOpenEdit,
		onClose: onCloseEdit,
	} = useDisclosure();
	const {
		isOpen: isOpenDelete,
		onOpen: onOpenDelete,
		onClose: onCloseDelete,
	} = useDisclosure();
	const { tasks } = useSelector((state) => state?.tasks || []);

	const [selectedTask, setSelectedTask] = useState(null);

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
	}, [tasks]);

	const handleDeleteTask = async () => {
		await dispatch(DeleteTask(selectedTask?.taskId));
		dispatch(deleteTask(selectedTask));
		setSelectedTask(null);
		onCloseDelete();
	};

	useEffect(() => {
		dispatch(GetPagingProject({ pageSize: 100, pageIndex: 1 }));
	}, []);

	useEffect(() => {
		dispatch(GetPagingMyTask());
	}, []);

	return (
		<>
			{tasks?.length > 0 && (
				<TreeList
					data={cloneDeep(tasks)}
					onOpenEdit={onOpenEdit}
					onOpenDelete={onOpenDelete}
					setSelectedTask={setSelectedTask}
				/>
			)}

			{isOpenDelete && (
				<ModalSingleDelete
					isOpen={isOpenDelete}
					onClose={onCloseDelete}
					onDelete={handleDeleteTask}
				/>
			)}
			{isOpenEdit && (
				<ModalEditTask isOpen={isOpenEdit} onClose={onCloseEdit} />
			)}
		</>
	);
}
export default MyTasks;
