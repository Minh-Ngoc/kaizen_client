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
import moment from "moment";
import { Suspense, useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import { getChecklistOfUsersByMonth } from "services/api.service";

function TasksOfUsersColumnsChart() {
	const dispatch = useDispatch();
	const { listTeam } = useSelector((state) => state.team);
	const [user, setUser] = useState({});
	const [team, setTeam] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [checklistDates, setChecklistDates] = useState([]);

	// Array to store the dates
	let pastSevenDays = [];
	// Get the current date
	let currentDate = moment();

	for (let i = 0; i < 10; i++) {
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

			const { data } = await getChecklistOfUsersByMonth(query);

			if (data?.status === 1) {
				setChecklistDates(data?.data);
			}
		} catch (error) {
			console.log("error: ", error);
			// NotifyMessage(
			// 	"Không thể tải thông tin của biểu đồ. Vui lòng thử lại!",
			// 	"error"
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

	const series = useMemo(() => {
		const completed = checklistDates?.map(
			(item) => item?.completed?.length || 0
		);

		const unfinished = checklistDates?.map(
			(item) => item?.unfinished?.length || 0
		);

		return [
			{
				name: "Đã báo cáo",
				data: completed,
			},
			{
				name: "Chưa báo cáo",
				data: unfinished,
			},
		];
	}, [checklistDates]);

	const options = useMemo(() => {
		const categories = checklistDates?.map((item) => formatDate(item.date));

		const colors = ["#26E7A6", "#ff6178"];

		return {
			title: {
				text: "CÁC NHÂN VIÊN ĐÃ BÁO CÁO CÔNG VIỆC TRONG TUẦN",
				style: {
					fontSize: "14px",
					fontWeight: "bold",
					color: "#ffffff",
				},
			},
			chart: {
				type: "bar",
				height: 350,
				events: {
					click: function (chart, w, e) {
						console.log(chart, w, e);
					},
				},
			},
			colors,
			plotOptions: {
				bar: {
					horizontal: false,
					columnWidth: "55%",
					endingShape: "rounded",
				},
			},
			dataLabels: {
				enabled: false,
			},
			stroke: {
				show: true,
				width: 2,
				colors: ["transparent"],
			},
			xaxis: {
				categories: categories,
				labels: {
					style: {
						colors: "#ffffff",
						fontSize: "12px",
					},
				},
			},
			yaxis: {
				title: {
					text: "",
				},
				labels: {
					style: {
						colors: "#ffffff",
						fontSize: "12px",
					},
					formatter: (val) => `${val} Nhân viên`,
				},
			},
			fill: {
				opacity: 1,
			},
			grid: {
				yaxis: {
					lines: {
						show: false,
					},
				},
				xaxis: {
					lines: {
						show: false,
					},
				},
			},
			legend: {
				show: false,
			},
			// tooltip: {
			//     y: {
			//         formatter: function (val) {
			//             return "$ " + val + " thousands";
			//         },
			//     },
			// },
		};
	}, [checklistDates]);

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
				<>
					<div id="chart">
						<ReactApexChart
							options={options}
							series={series}
							type="bar"
							height={500}
						/>
					</div>
					<div id="html-dist"></div>
				</>
			)}
		</Suspense>
	);
}

export default TasksOfUsersColumnsChart;
