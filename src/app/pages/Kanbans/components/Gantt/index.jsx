import { useEffect, useState } from "react";
import SimpleBar from "simplebar-react";
import HkGantt from "./components/@hk-gantt/@hk-gantt";
import Split from "react-split";
import "./styles/style.css";
import "./styles/gantt.css";
import { Spinner, Tab, Tabs } from "@nextui-org/react";
import GanttTable from "./components/GanttTable";
import { getTasksForGanttFlatData } from "services/api.service";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import moment from "moment";
import NotifyMessage from "_utils/notify";
import { updateGantt } from "services/api.service";

const gutterFn = (_index, direction) => {
	const gutter = document.createElement("div");
	gutter.className = `gutter gutter-${direction} flex items-center justify-center cursor-col-resize`;
	gutter.style.height = "100%";
	return gutter;
};

function GanttChart() {
	const { id: projectId } = useParams();

	const [tasks, setTasks] = useState([]);
	const [changeDate, setChangeDate] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [pendingCalls, setPendingCalls] = useState(0);
	const [viewMode, setViewMode] = useState("Week");

	// 👇️ scroll to viewPort every time messages change
	useEffect(() => {
		const element = document.querySelector(
			"#split_2 .simplebar-content-wrapper"
		);
		element.scrollTo({ left: 500, behavior: "smooth" });
	});

	const fetchData = async () => {
		try {
			setIsLoading(true);

			const { data } = await getTasksForGanttFlatData(projectId);

			if (data?.status === 1) {
				setTasks(data?.tasks);
			}
		} catch (error) {
			console.log("error: ", error);
		} finally {
			setIsLoading(false);
		}
	};

	// Fetch Data
	useEffect(() => {
		fetchData();
	}, []);

	const onDateChange = async (data, start, end) => {
		// Giả lập việc gọi dữ liệu
		setPendingCalls((prev) => prev + 1);

		// Giả lập một API call hoặc một sự kiện không đồng bộ
		setTimeout(() => {
			setChangeDate((prev) => [
				...prev,
				{ ...data, startEditted: start, endEditted: end },
			]);

			// Khi sự kiện hoàn tất, giảm số lượng pending calls
			setPendingCalls((prev) => prev - 1);
		}, 500); // Giả lập thời gian xử lý 1 giây
	};

	useEffect(() => {
		if (pendingCalls === 0) {
			// Khi tất cả các sự kiện đã hoàn tất

			if (changeDate?.length) {
				processData();
			}
		}
	}, [pendingCalls]);

	const processData = async () => {
		// Thực hiện function khác với dữ liệu đã lưu
		// Filter and indexOf to get unique objects
		const newChangeDates = changeDate?.filter((obj, index, arr) => {
			return (
				arr.findIndex((o) => {
					return JSON.stringify(o) === JSON.stringify(obj);
				}) === index
			);
		});

		const dataSubmit = newChangeDates?.map((item) => {
			const dateStartData = moment(item?.startEditted).startOf("day").toISOString();
			const dateEndData = moment(item?.endEditted).endOf("day").toISOString();

			return {
				...item,
				dateStart: dateStartData,
				dateEnd: dateEndData,
			};
		});

		const validateData = newChangeDates?.map((data) => {
			const dateStart = moment(data?.startEditted);
			const dateEnd = moment(data?.endEditted);

			switch (data.field) {
				case "status":
					return data;

				case "task":
					if (!data?.parentDateStart || !data?.parentDateEnd) {
						NotifyMessage(
							"Vui lòng chọn thời gian thực hiện dự án!",
							"warning"
						);
						return false;
					}

					const project = newChangeDates?.find(
						(el) => (el.field === "status" && el._id === data.statusId)
					);

					if (!project) {
						const projectDateStart = moment(data?.parentDateStart);
						const projectDateEnd = moment(data?.parentDateEnd);

						if (dateStart.isBefore(projectDateStart, "day")) {
							NotifyMessage(
								`Thời gian bắt đầu công việc không thể sớm hơn thời gian bắt đầu dự án (${moment(
									projectDateStart
								).format("DD/MM/YYYY")}). Vui lòng thử lại!`,
								"warning"
							);

							return false;
						}

						if (dateEnd.isAfter(projectDateEnd, "day")) {
							NotifyMessage(
								`Thời gian hoàn thành công việc không thể trễ hơn thời gian hoàn thành dự án (${moment(
									projectDateEnd
								).format("DD/MM/YYYY")}). Vui lòng thử lại!`,
								"warning"
							);

							return false;
						}
					}

					return data;

				case "checklist":
					if (!data?.parentDateStart || !data?.parentDateEnd) {
						NotifyMessage(
							"Vui lòng chọn thời gian thực hiện công việc cha!",
							"warning"
						);

						return false;
					}

					const task = newChangeDates?.find(
						(el) => (el?.field === "task" && el._id === data.taskId)
					);

					if (!task) {
						const taskDateStart = moment(data?.parentDateStart);
						const taskDateEnd = moment(data?.parentDateEnd);

						if (dateStart.isBefore(taskDateStart, "day")) {
							NotifyMessage(
								`Thời gian bắt đầu Checklist không thể sớm hơn thời gian bắt đầu công việc cha (${moment(
									taskDateStart
								).format("DD/MM/YYYY")}). Vui lòng thử lại!`,
								"warning"
							);
							return false;
						}

						if (dateEnd.isAfter(taskDateEnd, "day")) {
							NotifyMessage(
								`Thời gian hoàn thành Checklist không thể trễ hơn thời gian hoàn thành công việc cha (${moment(
									taskDateEnd
								).format("DD/MM/YYYY")}). Vui lòng thử lại!`,
								"warning"
							);
							return false;
						}
					}

					return data;

				case "item":
					if (!data?.parentDateStart || !data?.parentDateEnd) {
						NotifyMessage(
							"Vui lòng chọn thời gian thực hiện Checklist!",
							"warning"
						);
						return false;
					}

					const checklist = newChangeDates?.find(
						(el) => (el.field === "checklist" && el._id === data.checklistId)
					);

					console.log('checklist: ', checklist, ' - data: ', data);

					if (!checklist) {
						const checklistDateStart = moment(
							data?.parentDateStart
						);
						const checklistDateEnd = moment(data?.parentDateEnd);

						if (dateStart.isBefore(checklistDateStart, "day")) {
							NotifyMessage(
								`Thời gian bắt đầu công việc con không thể sớm hơn thời gian bắt đầu Checklist (${moment(
									checklistDateStart
								).format("DD/MM/YYYY")}). Vui lòng thử lại!`,
								"warning"
							);
							return false;
						}

						if (dateEnd.isAfter(checklistDateEnd, "day")) {
							NotifyMessage(
								`Thời gian hoàn thành công việc con không thể trễ hơn thời gian hoàn thành Checklist (${moment(
									checklistDateEnd
								).format("DD/MM/YYYY")}). Vui lòng thử lại!`,
								"warning"
							);
							return false;
						}
					}

					return data;
			}
		});

		const isFail = validateData?.some((item) => !item);

		if (isFail) {
			setChangeDate([]);

			return fetchData();
		}

		try {
			const { data } = await updateGantt(dataSubmit);

			if (data?.status === 1) {
				NotifyMessage(
					"Cập nhật thời gian thực hiện thành công!",
					"success"
				);

				fetchData();
			}
		} catch (error) {
			console.log("error: ", error);
			NotifyMessage("Cập nhật thời gian thực hiện thất bại!", "error");
		} finally {
			setChangeDate([]);
		}
	};

	const onProgressChange = (task, progress) => {
		console.log(task, progress);
	};

	return (
		<div className="p-4 bg-table shadow-wrapper rounded-lg mt-4">
			<Tabs
				aria-label="Tabs variants"
				variant={"bordered"}
				classNames={{
					base: "mb-5",
					tabList: "shadow-input rounded-md",
					tabContent: "font-medium text-white",
				}}
				color="primary"
				selectedKey={viewMode}
				onSelectionChange={setViewMode}
			>
				<Tab key="Day" title="Day" />
				<Tab key="Week" title="Week" />
				<Tab key="Month" title="Month" />
			</Tabs>

			<div className="hk-pg-body py-0">
				<div className="todoapp-wrap ganttapp-wrap full-screenapp">
					<div className="todoapp-content bg-white rounded-lg">
						<div className="todoapp-detail-wrap">
							{/* 
								Add Header At Here....
							*/}
							<div className="todo-body">
								<div className="nicescroll-bar">
									<Split
										className="split-wrap"
										gutter={gutterFn}
										gutterSize={7}
									>
										<SimpleBar
											autoHide={false}
											style={{ maxHeight: "70vh" }}
											className="split"
										>
											<GanttTable />
										</SimpleBar>

										<SimpleBar
											autoHide={false}
											style={{ maxHeight: "70vh" }}
											className="split"
											id="split_2"
										>
											{isLoading || !tasks?.length ? (
												<div className="h-[50vh] flex items-center justify-center">
													<Spinner
														size="lg"
														color={"primary"}
													/>
												</div>
											) : (
												<div className="gantt-wrap">
													<span className="gantt-container">
														<span className="gantt">
															<HkGantt
																tasks={tasks}
																viewMode={viewMode}
																onProgressChange={
																	onProgressChange
																}
																onDateChange={
																	onDateChange
																}
															/>
														</span>
													</span>
												</div>
											)}
										</SimpleBar>
									</Split>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default GanttChart;
