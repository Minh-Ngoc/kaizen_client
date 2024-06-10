import { parseDate } from "@internationalized/date";
import {
	Autocomplete,
	AutocompleteItem,
	DateRangePicker,
	Spinner,
} from "@nextui-org/react";
import { getAllTeams } from "_redux/slice/teamSlice";
import { dateToUtcTimestamp, formatDate } from "_utils";
import SelectUsers from "app/components/SelectUsers";
import LineChart from "app/components/Charts/LineChart";
import moment from "moment";
import { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChecklistReportedOfUsersByWeek } from "services/api.service";

function TasksOfUsersLineChart() {
	const dispatch = useDispatch();
	const { listTeam } = useSelector((state) => state.team);
	const [user, setUser] = useState({});
	const [team, setTeam] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [checklistData, setChecklistData] = useState({
		series: [],
		options: {},
	});

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

	const [time, setTime] = useState({
		start: parseDate(pastSevenDays[pastSevenDays.length - 1]),
		end: parseDate(pastSevenDays[0]),
	});

	const fetchData = async (query) => {
		try {
			setIsLoading(true);
			
			const { data } = await getChecklistReportedOfUsersByWeek(query);

			if (data?.status === 1) {
				const series = data?.data.data?.map((item) => ({
					name: item?.user,
					data: item.checklists,
				}));
				const categories = data?.data.dates?.map((date) =>
					formatDate(date)
				);
				const options = {
					title: {
						text: "SỐ CÔNG VIỆC ĐÃ BÁO CÁO TRONG TUẦN CỦA CÁC NHÂN VIÊN",
						style: {
							fontSize: "14px",
							fontWeight: "bold",
							color: "#ffffff",
						},
					},
					chart: {
						toolbar: {
							show: false,
						},
					},
					tooltip: {
						theme: "light",
						enabled: true,
					},
					dataLabels: {
						enabled: false,
					},
					stroke: {
						curve: "smooth",
					},
					xaxis: {
						categories: categories,
						labels: {
							style: {
								colors: "#c8cfca",
								fontSize: "12px",
							},
						},
						axisBorder: {
							show: false,
						},
						axisTicks: {
							show: false,
						},
					},
					yaxis: {
						labels: {
							style: {
								colors: "#c8cfca",
								fontSize: "12px",
							},
							colors: ["#2CD9FF", "#582CFF"],
							formatter: (val) => `${val} Công việc`,
						},
					},
					legend: {
						show: false,
						onItemHover: {
							highlightDataSeries: true,
						},
						inverseOrder: true,
					},
					grid: {
						strokeDashArray: 5,
						borderColor: "#56577A",
					},
					fill: {
						type: "gradient",
						gradient: {
							shade: "dark",
							type: "vertical",
							shadeIntensity: 0,
							gradientToColors: undefined,
							inverseColors: true,
							opacityFrom: 0.8,
							opacityTo: 0,
							stops: [],
						},
					},
					colors: ["#2CD9FF", "#582CFF"],
				};
				setChecklistData({ series, options });
			}
		} catch (error) {
			console.log("error: ", error);
			// NotifyMessage(
			//  "Không thể tải thông tin của biểu đồ. Vui lòng thử lại!",
			//  "error"
			// );
		} finally {
			setIsLoading(false);
		}
	};
	useEffect(() => {
		const start = dateToUtcTimestamp(time?.start?.toDate());
		const end = dateToUtcTimestamp(time?.end?.toDate());
		fetchData({
			startDate: start,
			endDate: end,
		});
	}, []);
	useEffect(() => {
		dispatch(getAllTeams());
	}, []);
	const handleFilterByDate = (value) => {
		setTime(value);
		const start = dateToUtcTimestamp(value?.start?.toDate());
		const end = dateToUtcTimestamp(value?.end?.toDate());
		fetchData({
			startDate: start,
			endDate: end,
		});
	};
	const handleFilterByManager = (value) => {
		setUser(value);
		const filter = {};
		if (time) {
			const start = dateToUtcTimestamp(time?.start?.toDate());
			const end = dateToUtcTimestamp(time?.end?.toDate());
			filter.startDate = start;
			filter.endDate = end;
		}
		if (value) {
			filter.user = value?._id;
			setTeam(null);
		}
		fetchData(filter);
	};
	const handleFilterByTeam = (key) => {
		setTeam(key);
		// Filter Project
		const filter = {};
		if (key) {
			filter.team = key;
			setUser({});
		}
		if (time) {
			const start = dateToUtcTimestamp(time?.start?.toDate());
			const end = dateToUtcTimestamp(time?.end?.toDate());
			filter.startDate = start;
			filter.endDate = end;
		}
		fetchData(filter);
	};
	return (
		<Suspense
            fallback={
                <div className="flex justify-center items-center min-h-[500px]">
                    <Spinner color="default" size="lg" />
                </div>
            }
        >
			<div className="mb-5 ml-2 flex flex-wrap gap-2 justify-end">
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
					value={time}
					onChange={handleFilterByDate}
				/>
				<SelectUsers
					selectionMode="single"
					variant="bordered"
					light
					title="Người thực hiện"
					usersSelected={user}
					setUsersSelected={handleFilterByManager}
				/>
				<Autocomplete
					defaultItems={listTeam}
					placeholder="Team"
					radius="sm"
					variant="bordered"
					selectedKey={team}
					inputProps={{
						classNames: {
							input: "!text-white placeholder:text-white",
							label: "!text-white",
							clearButton: "!text-white",
							inputWrapper:
								"group-data-[open=true]:border-primary group-data-[hover=true]:border-primary group-data-[focus=true]:border-primary",
						},
					}}
					classNames={{
						base: "ml-3 max-w-52",
						endContentWrapper: "text-white",
						clearButton: "!text-white",
						selectorButton: "!text-white",
					}}
					onSelectionChange={handleFilterByTeam}
				>
					{(item) => (
						<AutocompleteItem key={item._id}>
							{item.name}
						</AutocompleteItem>
					)}
				</Autocomplete>
			</div>
			{isLoading ? (
				<div className="flex items-center justify-center grow min-h-[500px]">
					<Spinner color="default" size="lg" />
				</div>
			) : (
				<div className="min-h-[500px]">
					<LineChart
						chartData={checklistData?.series}
						chartOptions={checklistData?.options}
					/>
				</div>
			)}
		</Suspense>
	);
}
export default TasksOfUsersLineChart;
