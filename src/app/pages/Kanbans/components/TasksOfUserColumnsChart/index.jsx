/* eslint-disable no-unused-vars */
import { getLocalTimeZone, today } from "@internationalized/date";
import { DateRangePicker, Spinner } from "@nextui-org/react";
import { dateToUtcTimestamp } from "_utils";
import { formatDate } from "_utils";
import { Suspense, useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { getChecklistOfUserByMonth } from "services/api.service";

const END_DATE_DEFAULT = today(getLocalTimeZone());
const START_DATE_DEFAULT = END_DATE_DEFAULT.cycle("day", -6);

function TasksOfUserColumnsChart() {
	const [checklistDates, setChecklistDates] = useState([]);
    const [time, setTime] = useState({
		start: START_DATE_DEFAULT,
		end: END_DATE_DEFAULT,
	});

	const fetchData = async (query) => {
		try {
			const { data } = await getChecklistOfUserByMonth(query);

			if (data?.status === 1) {
				setChecklistDates(data?.data);
			}
		} catch (error) {
			console.log("error: ", error);
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

    const series = useMemo(() => {
        const checklists = checklistDates?.map(
            item => item?.checklists?.length || 0
        );

        return [
            {
                name: "Đã báo cáo",
                data: checklists
            },
        ]
    }, [checklistDates]);

    const options = useMemo(() => {
        const categories = checklistDates?.map(
            item => formatDate(item.date)
        );

        const colors = ["#26E7A6"];

        return {
            title: {
                text: "BÁO CÁO CÔNG VIỆC TRONG TUẦN CỦA NHÂN VIÊN",
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
                      // console.log(chart, w, e)
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
                    formatter: (val) => `${val} Công việc`,
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
        }
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

	return (
		<Suspense 
            fallback={
                <div className="flex justify-center items-center min-h-[500px]">
                    <Spinner color="default" size="lg" />
                </div>
            }
        >
            <div className="mb-5 ml-2">
                <DateRangePicker
					id="nextui-date-range-picker"
                    popoverProps={{
                        className: "min-w-[300px] w-[300px]"
                    }}
                    calendarProps={{
                        className: '!w-full !max-w-full',
                        content: '!w-full !max-w-full',
                    }}
                    radius="sm"
                    variant={"bordered"}
                    placeholder="Thời gian"
                    className="max-w-xs"
                    disableAnimation
                    value={time}
                    onChange={handleFilterByDate}
                />
            </div>
			<div id="chart" className="min-h-[500px]">
				<ReactApexChart
					options={options}
					series={series}
					type="bar"
					height={500}
				/>
			</div>
			<div id="html-dist"></div>
		</Suspense>
	);
}

export default TasksOfUserColumnsChart;
