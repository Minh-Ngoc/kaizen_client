import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import "../Calendar/calendar.css";
import { Modal, ModalBody, ModalContent } from "@nextui-org/react";
import TaskDetail from "../TaskDetail";
import { updateTaskDates } from "_redux/slice/taskSlice";
import { parseDate } from "@internationalized/date";
import moment from "moment";
import NotifyMessage from "_utils/notify";
import { UpdateTask } from "_redux/slice/taskSlice";
import { GetTasksByUser } from "_redux/slice/taskSlice";

function MyCalendar() {
	const [isOpen, setIsOpen] = useState(false);
	const [task, setTask] = useState({});
	const dispatch = useDispatch();
	const { tasks } = useSelector((state) => state.tasks);

	// const handleDateClick = ({event}) => {
	// 	setIsOpen(true);
	// 	setTask(event?.extendedProps);
	// };

	const handleClickTask = ({ event }) => {
		setIsOpen(true);
		setTask(event?.extendedProps);
	};

	const handleCloseModal = (value) => {
		setIsOpen(value);
		// dispatch(
		// 	setErrorDates({
		// 		key: "dates",
		// 		error: false,
		// 	})
		// );
	};
	const tasksValidate = useMemo(() => {
		const result = tasks?.map((task) => {
			const { dateStart, dateEnd, ...otherEventProps } = task;
			return {
				start: dateStart,
				end: dateEnd,
				...otherEventProps,
			};
		});
		return result;
	}, [tasks]);

	const renderEventContent = ({ event }) => {
		return <p className="!bg-transparent">{event?.extendedProps?.name}</p>;
	};

	useEffect(() => {
		dispatch(GetTasksByUser());
	}, []);

	return (
		<>
			<div className="w-full min-h-[80vh] overflow-auto grid grid-cols-1 text-white p-3 bg-table mb-4 mt-5 shadow-card-project rounded-lg">
				<FullCalendar
					plugins={[dayGridPlugin, interactionPlugin]}
					initialView="dayGridMonth"
					events={tasksValidate}
					headerToolbar={{
						left: "prev,today,next",
						center: "title",
						right: "dayGridMonth,dayGridWeek,dayGridDay",
					}}
					lazyFetching={true}
					editable={true}
					slotWidth={10}
					customIcons={false}
					eventClick={(e) => handleClickTask(e)}
					eventContent={renderEventContent}
					locale="vi"
					eventChange={({ event }) => {
						const taskId = event?._def?.extendedProps?._id;
						const { dateEnd, dateStart, project } = tasks.find(
							(t) => t?._id === taskId
						);
						console.log(tasks.find((t) => t?._id === taskId));
						const { start: startCalendar, end: endCalendar } =
							event?._instance?.range;
						// console.log("startCalendar: ", startCalendar);
						// console.log("endCalendar: ", endCalendar);
						const dateStartProject = project?.dateStart;
						const dateEndProject = project?.dateEnd;
						setTimeout(() => {
							const startDateCalendar = new Date(startCalendar);
							startDateCalendar.setHours(
								startDateCalendar.getHours() - 7
							);
							const endDateCalenar = new Date(endCalendar);
							endDateCalenar.setHours(
								endDateCalenar.getHours() - 7
							);
							// console.log("startDateCalendar: ", startDateCalendar);
							// console.log("endDateCalenar: ", endDateCalenar);
							dispatch(
								updateTaskDates({
									taskId,
									dateStart: startDateCalendar,
									dateEnd: endDateCalenar,
								})
							);
							const start = moment(
								parseDate(
									moment(startDateCalendar).format(
										"YYYY-MM-DD"
									)
								)?.toDate()
							)?.startOf("day");
							const end = moment(
								parseDate(
									moment(endDateCalenar).format("YYYY-MM-DD")
								)?.toDate()
							)?.endOf("day");
							if (start.isBefore(moment(dateStartProject))) {
								dispatch(
									updateTaskDates({
										taskId,
										dateStart: dateStart,
										dateEnd: dateEnd,
									})
								);
								return NotifyMessage(
									`Thời gian bắt đầu công việc không thể sớm hơn thời gian bắt đầu dự án (${moment(
										dateStartProject
									).format(
										"DD/MM/YYYY"
									)}). Vui lòng thử lại!`,
									"warning"
								);
							}
							if (end.isAfter(moment(dateEndProject))) {
								dispatch(
									updateTaskDates({
										taskId,
										dateStart: dateStart,
										dateEnd: dateEnd,
									})
								);
								return NotifyMessage(
									`Thời gian hoàn thành công việc không thể trễ hơn thời gian hoàn thành dự án (${moment(
										dateEndProject
									).format(
										"DD/MM/YYYY"
									)}). Vui lòng thử lại!`,
									"warning"
								);
							}
							// console.log("start?.toISOString(): ", start?.toISOString());
							// console.log("end?.toISOString(): ", end?.toISOString());
							dispatch(
								UpdateTask({
									id: taskId,
									body: {
										dateStart: start?.toISOString(),
										dateEnd: end?.toISOString(),
									},
								})
							);
						}, 100);
					}}
				/>
			</div>
			<Modal
				backdrop="opaque"
				isOpen={isOpen}
				onClose={handleCloseModal}
				isDismissable={false}
				classNames={{
					wrapper: "w-full overflow-hidden",
					base: `max-h-[90vh] !shadow-card-project min-w-[50%]`,
					body: "overflow-y-auto",
					closeButton: "right-5 z-10 text-lg",
				}}
			>
				<ModalContent>
					<ModalBody>
						<TaskDetail task={task} />
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
}

export default MyCalendar;
