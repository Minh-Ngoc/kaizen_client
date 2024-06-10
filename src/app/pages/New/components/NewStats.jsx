import ColumnChart from "app/components/Charts/ColumnChart";
import { useEffect, useState } from "react";
import { getNewsOfUser } from "services/api.service";

const NewStats = () => {
	const [data, setData] = useState([]);
	const fetchNewsOfUser = async () => {
		const data = await getNewsOfUser();

		const result = data?.data?.result.map((item) => {
			return {
				name: item?.user.name,
				y: item?.length,
			};
		});
		setData(result);
	};
	useEffect(() => {
		fetchNewsOfUser();
	}, []);

	return <ColumnChart data={data} title="BẢNG XẾP HẠNG BÀI VIẾT" />;
};

export default NewStats;
