import  { useEffect, useMemo, useState } from "react";
import PieChartComp from "app/components/Charts/PieChart";

const ProjectStatsPieChart = ({ result }) => {
	let statusTasks = useMemo(
		() => [
			{
				name: "chưa hoàn thành",
				data: 0,
			},
			{
				name: "hoàn thành",
				data: 0,
			},
		],
		[]
	);

	const [data, setData] = useState([]);

	useEffect(() => {
		result?.forEach((item) => {
			if (item.status?.name.toLowerCase() === "hoàn thành") {
				statusTasks[1].data = item.data;
			} else if (
				item.status?.name.toLowerCase() === "chuẩn bị" ||
				item.status?.name.toLowerCase() === "đang làm"
			) {
				statusTasks[0].data = item.data + statusTasks[0].data;
			}
		});

		const resultData = statusTasks?.map((item) => {
			return {
				name: item?.name,
				y: item?.data,
			};
		});
		setData(resultData);
	}, [result]);

	return (
		<div className="p-4 shadow-wrapper bg-table rounded-lg">
			<div className="overflow-hidden">
				<div className="w-full h-full">
					<PieChartComp
						data={data}
						title="BIỂU ĐỒ TRẠNG THÁI CÔNG VIỆC"
					/>
				</div>
			</div>
		</div>
	);
};

export default ProjectStatsPieChart;
