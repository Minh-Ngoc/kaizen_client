import ColumnChart from "app/components/Charts/ColumnChart";
import { useEffect, useMemo, useState } from "react";

const ProjectStatsColumn = ({ result }) => {
	let statusTasks = useMemo(
		() => [
			{
				code: "todo",
				name: "Chuẩn bị",

				data: 0,
			},
			{
				code: "doing",
				name: "Đang làm",
				data: 0,
			},
			{
				code: "completed",
				name: "Hoàn thành",
				data: 0,
			},
			{
				code: "overtime",
				name: "Tồn đọng",
				data: 0,
			},
		],
		[]
	);

	const [data, setData] = useState([]);

	useEffect(() => {
		result?.forEach((item) => {
			statusTasks.forEach((status) => {
				if (
					item?.status.code.toLowerCase() ===
					status.code.toLowerCase()
				) {
					status.data = item.data;
				}
			});
		});

		const resultData = statusTasks?.map((item) => {
			return {
				name: item?.name,
				y: item?.data,
			};
		});
		setData(resultData);
	}, [result, statusTasks]);

	return (
		<div className="p-4 shadow-wrapper bg-table rounded-lg">
			<div className="overflow-hidden">
				<ColumnChart data={data} title="BIỂU ĐỒ TRẠNG THÁI CÔNG VIỆC" />
			</div>
		</div>
	);
};

export default ProjectStatsColumn;
