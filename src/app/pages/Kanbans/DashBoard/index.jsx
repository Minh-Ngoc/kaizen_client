import { useEffect, useMemo, useState } from "react";
import ProjectStatsColumn from "../components/Stats/ProjectStatsColumn";
import ProjectStatsPieChart from "../components/Stats/ProjectStatsPieChart";
import { useParams } from "react-router-dom";
import { getTasksStatsOverview } from "services/api.service";
import CardDashBoard from "../components/CardDashBoard";
import { VscChecklist } from "react-icons/vsc";
import { ImRadioUnchecked } from "react-icons/im";
import { LuClipboardList } from "react-icons/lu";
import { FaRegCalendarTimes } from "react-icons/fa";
import { Avatar } from "@nextui-org/react";

const DashBoard = () => {
	let statusTasks = useMemo(
		() => [
			{
				name: "tasks hoàn thành",
				data: 0,
				icon: (
					<Avatar
						isBordered
						className="ring-1 ring-offset-1 bg-success"
						icon={<VscChecklist size={24} className="text-white" />}
					/>
				),
			},
			{
				name: "tasks chưa hoàn thành",
				data: 0,
				icon: (
					<Avatar
						isBordered
						className="ring-1 ring-offset-1 bg-warning"
						icon={
							<ImRadioUnchecked
								size={24}
								className="text-white"
							/>
						}
					/>
				),
			},
			{
				name: "tasks tồn đọng",
				data: 0,
				icon: (
					<Avatar
						isBordered
						className="ring-1 ring-offset-1 bg-danger"
						icon={
							<FaRegCalendarTimes
								size={24}
								className="text-white"
							/>
						}
					/>
				),
			},
			{
				name: "tổng số tasks",
				data: 0,
				icon: (
					<Avatar
						isBordered
						className="ring-1 ring-offset-1 bg-primary"
						icon={
							<LuClipboardList size={24} className="text-white" />
						}
					/>
				),
			},
		],
		[]
	);
	const param = useParams();
	const [data, setData] = useState([]);

	const fetchData = async (projectId) => {
		const data = await getTasksStatsOverview(projectId);

		data?.data?.result?.forEach((item) => {
			if (item?.status?.code === "completed") {
				statusTasks[0].data = item?.data;
				statusTasks[3].data = statusTasks[3].data + item?.data;
			} else if (
				item?.status?.code === "todo" ||
				item?.status?.code === "doing"
			) {
				statusTasks[1].data = item?.data + statusTasks[1].data;
				statusTasks[3].data = statusTasks[3].data + item?.data;
			} else if (item?.status?.code === "overtime") {
				statusTasks[2].data = item?.data;
				statusTasks[3].data = statusTasks[3].data + item?.data;
			}
		});

		setData(data?.data?.result || []);
	};
	useEffect(() => {
		fetchData(param?.id);
	}, [param?.id]);
	return (
		<div className="items-center px-4 py-8 m-auto shadow-card-project rounded-lg bg-table mt-5">
			<div className="grid grid-cols-12 gap-5 mb-6">
				{statusTasks.map((item, index) => (
					<CardDashBoard
						key={index}
						name={item?.name}
						data={item?.data}
						icon={item?.icon}
					/>
				))}
			</div>
			<div className="grid grid-cols-2 gap-6">
				<ProjectStatsColumn result={data} />
				<ProjectStatsPieChart result={data} />
			</div>
		</div>
	);
};

export default DashBoard;
