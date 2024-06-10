
import React from "react";
import ReactApexChart from "react-apexcharts";

class LineChart extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			chartData: [],
			chartOptions: {},
		};
	}

	componentDidMount() {
		this.setState({
			chartData: this.props.chartData,
			chartOptions: this.props.chartOptions,
		});
	}

  render() {
    if(this.props.chartData?.length) {
      return (
        <ReactApexChart
          id="line-chart"
          options={this.props.chartOptions}
          series={this.props.chartData}
          type='area'
          width='100%'
          height='100%'
        />
      )
    }
  }
}

export default LineChart;
