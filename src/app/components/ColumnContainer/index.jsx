import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
} from "@nextui-org/react";
import { FaPlus } from "react-icons/fa6";
import { memo, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import BtnAddCard from "app/pages/Kanbans/components/BtnAddCard";
import Task from "app/pages/Kanbans/components/Task";
import FormConfirm from "../FormConfirm";
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { addNewTask } from "services/api.service";
import { useDispatch, useSelector } from "react-redux";
import { setTasks } from "_redux/slice/taskSlice";
import NotifyMessage from "_utils/notify";

function ColumnContainer({ column, tasks }) {
	const { id: projectId } = useParams();

	const { tasks: tasksList } = useSelector((state) => state.tasks);

	const { setNodeRef } = useSortable({
		id: column._id,
		data: {
			type: "Column",
			...column,
		},
	});

	const dispatch = useDispatch();

	const tasksIds = useMemo(() => tasks?.map((task) => task._id), [tasks]);

	const [visible, setVisible] = useState(false);
	const [taskName, setTaskName] = useState("");

	const handleChangeTaskName = (value) => {
		setTaskName(value);
	};

	const handleClickBtnAddCard = () => {
		setVisible(!visible);
	};

	const onKeyDown = (event) => {
		if (event.key === "Enter") {
			// Ngăn không cho giá trị xuống dòng
			event.preventDefault();
			handleCreateNewTask();
		}
	};

	const handleCreateNewTask = async () => {
		if (!taskName) {
			return setVisible(false);
		}

		try {
			const { data } = await addNewTask({
				projectId,
				statusId: column._id,
				name: taskName,
			});

			if (data?.status === 1) {
				dispatch(setTasks([...tasksList, data?.task]));

				setVisible(false);
				setTaskName("");
			}
		} catch (error) {
			console.log("error: ", error);
			NotifyMessage('Tạo công việc thất bại. Vui lòng thử lại!', 'error');
		}
	};

	return (
		<div className="max-w-[25%] w-full min-w-72 px-2">
			<Card
				ref={setNodeRef}
				classNames={{
					base: "w-full px-2 rounded-xl bg-card-kanban",
					header: "py-2",
					body: "pb-2 pt-1 px-1 gap-y-2",
					footer: "py-2 px-0 flex-col justify-start",
				}}
			>
				<CardHeader className="justify-center">
					<h4 className="text-lg font-semibold uppercase">
						{column?.name}
					</h4>
				</CardHeader>

				{/* Sortable Content Wrapper */}
				{(!!tasks?.length || visible) && (
					<CardBody className="max-h-[700px]">
						<SortableContext
							items={tasksIds}
							strategy={verticalListSortingStrategy}
						>
							{tasks?.map((task) => (
								<Task key={task._id} task={task} />
							))}
						</SortableContext>

						{/* Khi Click vào Button Tạo công việc thì ẩn button tạo công sauu đó hiện Component FormConfirm */}
						{visible && (
							<FormConfirm
								visible={visible}
								value={taskName}
								onChange={handleChangeTaskName}
								onConfirm={handleCreateNewTask}
								onClose={handleClickBtnAddCard}
								onKeyDown={onKeyDown}
							/>
						)}
					</CardBody>
				)}

				{!visible && (
					<CardFooter>
						<BtnAddCard
							label="Tạo công việc mới"
							icon={<FaPlus color="rgb(90 105 131)" />}
							onClick={handleClickBtnAddCard}
						/>
					</CardFooter>
				)}
			</Card>
		</div>
	);
}

export default memo(ColumnContainer);
