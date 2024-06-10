import ColumnChart from "app/components/Charts/ColumnChart";
import { useEffect, useState } from "react";
import { getRankScore } from "services/api.service";

const KpiStats = () => {
	const [data, setData] = useState([]);

	const fetchRank = async () => {
		const data = await getRankScore(10);

		const result = data?.data?.data.map((item) => {
			return {
				name: item.name || `${item.firstName} ${item.lastName}`,
				y: item.rankScore,
			};
		});
		setData(result);
	};
	useEffect(() => {
		fetchRank();
	}, []);

	return <ColumnChart data={data} title="BẢNG XẾP HẠNG KPI" />;
};

export default KpiStats;
