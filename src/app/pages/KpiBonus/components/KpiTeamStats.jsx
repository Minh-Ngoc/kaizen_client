import ColumnChart from "app/components/Charts/ColumnChart";
import { useEffect, useState } from "react";
import { getKpiTeamStats } from "services/api.service";

const KpiTeamStats = () => {
	const [data, setData] = useState([]);

	const fetchNewsOfUser = async () => {
		const data = await getKpiTeamStats();

		const result = data?.data?.result.map((item) => {
			return {
				name: item.name || `${item.firstName} ${item.lastName}`,
				y: item.totalRankScore,
			};
		});
		setData(result);
	};
	useEffect(() => {
		fetchNewsOfUser();
	}, []);

	return <ColumnChart data={data} title="BẢNG XẾP HẠNG KPI CỦA TEAM" />;
};

export default KpiTeamStats;
