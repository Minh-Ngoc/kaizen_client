import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const ColumnChart = ({data, title}) => {
	const options = {
		chart: {
			type: "column",
			backgroundColor: "transparent",
			// polar: true,
			color: "white",
			height: 500,
		},
		title: {
			align: "left",
			text: title,
			style: {
				color: "white",
				fontSize: "16px",
			},
		},

		accessibility: {
			announceNewData: {
				enabled: true,
			},
		},
		xAxis: {
			type: "category",

			lineColor: "white",

			labels: {
				style: {
					color: "white",
				},
			},
		},
		yAxis: {
			title: {
				text: "",
			},
			labels: {
				style: {
					color: "white",
				},
			},
		},
		legend: {
			enabled: false,
		},
		plotOptions: {
			series: {
				cursor: "pointer",
				borderWidth: 0,
				dataLabels: {
					enabled: true,
					// format: "{point.y:.1f}%",
				},
				events: {
					click: function (e) {
						// setIsOpened(!isOpened);
					},
				},
			},
		},

		tooltip: {
			headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
			pointFormat:
				'<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>',
		},

		series: [
			{
				name: "",
				colorByPoint: true,
				data,
			},
		],
	};
	return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default ColumnChart;
