import { parseDate } from "@internationalized/date";
import { DateRangePicker } from "@nextui-org/react";
import ColumnChart from "app/components/Charts/ColumnChart";

import moment from "moment";
import { useEffect, useState } from "react";
import { getTeamStats } from "services/api.service";

const TeamStats = () => {
	// Array to store the dates
	let pastSevenDays = [];
	// Get the current date
	let currentDate = moment();

	for (let i = 0; i < 7; i++) {
		// Subtract 'i' days from the current date
		let date = currentDate.clone().subtract(i, "days");
		// Push the formatted date to the array
		pastSevenDays.push(date.format("YYYY-MM-DD"));
	}

	const [value, setValue] = useState({
		start: parseDate(pastSevenDays[pastSevenDays.length - 1]),
		end: parseDate(pastSevenDays[0]),
	});

	const [data, setData] = useState([]);
	const fetchNewsOfUser = async ({ startDate, endDate }) => {
		const data = await getTeamStats({
			startDate,
			endDate,
		});

		const result = data?.data?.result.map((item) => {
			return {
				name: item.name,
				y: item.task,
			};
		});
		setData(result);
	};
	useEffect(() => {
		fetchNewsOfUser({
			startDate: moment(value.start.toDate())
				.startOf("day")
				.toISOString(),
			endDate: moment(value.end.toDate()).endOf("day").toISOString(),
		});
	}, [value]);

	return (
		<div>
			<div className="mb-5 ml-2">
				<DateRangePicker
					id="nextui-date-range-picker"
					popoverProps={{
						className: "min-w-[300px] w-[300px]",
					}}
					calendarProps={{
						className: "!w-full !max-w-full",
						content: "!w-full !max-w-full",
					}}
					radius="sm"
					variant={"bordered"}
					placeholder="Thời gian"
					className="max-w-xs"
					disableAnimation
					value={value}
					onChange={setValue}
				/>
			</div>
			<ColumnChart data={data} title="BẢNG XẾP HẠNG BÁO CÁO CỦA TEAM" />
		</div>
	);
};

export default TeamStats;
