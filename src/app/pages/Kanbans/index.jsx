import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Tab, Tabs } from "@nextui-org/react";
import { TfiLayoutListThumb } from "react-icons/tfi";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { BsListNested } from "react-icons/bs";
import { PiChartLineUp } from "react-icons/pi";
import { CiCalendar } from "react-icons/ci";
import List from "./components/List";
import DashBoard from "./DashBoard";
import Calendar from "./components/Calendar";
import Gantt from "./components/Gantt";
import Board from "./components/Board";
import { FaRegRectangleList } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { setApi } from "_redux/slice/taskSlice";
import { setCurrentTab } from "_redux/slice/taskSlice";

import { GetByProjectId } from "_redux/slice/projectSlice";
import Error403 from "app/components/Error";

function Kanbans() {
	const dispatch = useDispatch();
	const { id: projectId } = useParams();
	const { error, isLoading } = useSelector((state) => state.tasks);
	const { project } = useSelector((state) => state.projects);
	const [tab, setTab] = useState("list");

	const navBarMenu = useMemo(() => {
		return {
			board: {
				icon: (
					<MdOutlineSpaceDashboard className="text-white text-lg" />
				),
				title: "Board",
				element: <Board />,
			},
			list: {
				icon: <TfiLayoutListThumb className="text-white text-lg" />,
				title: "List",
				element: <List />,
			},
			gantt: {
				icon: <BsListNested className="text-white text-lg" />,
				title: "Gantt",
				element: <Gantt />,
			},
			dashboard: {
				icon: <PiChartLineUp className="text-white text-lg" />,
				title: "Dashboard",
				element: <DashBoard />,
			},
			calendar: {
				icon: <CiCalendar className="text-white text-lg" />,
				title: "Calendar",
				element: <Calendar />,
			},
		};
	}, []);

	useEffect(() => {
		dispatch(setApi("tasks"));
		dispatch(GetByProjectId(projectId));
	}, []);

	// If params isInvalid then return error
	if (!isLoading && error === "Rejected") {
		return (
			<div className="flex items-center justify-center sm:mt-36 md:mt-24">
				<Error403 />
			</div>
		);
	}

	return (
		<>
			{/* Project Name */}
			<div className="ml-3 mt-[13px] flex items-center relative gap-3 after:absolute after:-top-3 after:-bottom-14 after:-left-3 after:right-1/2 after:bg-table after:rounded-lg after:shadow-wrapper">
				<FaRegRectangleList className="text-white text-2xl z-10" />

				<h3 className="text-white text-lg uppercase font-bold z-10">
					{project?.name}
				</h3>
			</div>

			{/* Tabs */}
			<Tabs
				variant={"underlined"}
				aria-label="Tabs variants"
				classNames={{
					base: "mt-2 z-50",
					tab: "z-50 text-white",
					cursor: "bg-white",
					tabContent: "z-50",
				}}
				selectedKey={tab}
				onSelectionChange={(key) => {
					setTab(key);
					dispatch(setCurrentTab(key));
				}}
			>
				{Object.keys(navBarMenu)?.map((key) => (
					<Tab
						key={key}
						title={
							<div className="flex items-center gap-1">
								{navBarMenu[key]?.icon}
								<p className="text-white font-medium">
									{navBarMenu[key]?.title}
								</p>
							</div>
						}
					>
						{navBarMenu[key]?.element}
					</Tab>
				))}
			</Tabs>
		</>
	);
}
export default Kanbans;
