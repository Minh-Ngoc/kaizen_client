import { MdOutlineSpaceDashboard } from "react-icons/md";
import { TfiLayoutListThumb } from "react-icons/tfi";
import { CiCalendar } from "react-icons/ci";
import { useEffect, useState } from "react";
import { Tab, Tabs } from "@nextui-org/react";
import { FaRegRectangleList } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { setApi, setCurrentTab } from "_redux/slice/taskSlice";
import List from "./index";
import Board from "../Kanbans/components/Board";
import MyCalendar from "../Kanbans/components/MyCalendar";

function MyTasks() {
	const dispatch = useDispatch();
	const [tab, setTab] = useState("list");

	const navBarMenu = {
		board: {
			icon: <MdOutlineSpaceDashboard className="text-white text-lg" />,
			title: "Board",
			element: <Board />,
		},
		list: {
			icon: <TfiLayoutListThumb className="text-white text-lg" />,
			title: "List",
			element: <List />,
		},
		calendar: {
			icon: <CiCalendar className="text-white text-lg" />,
			title: "Calendar",
			element: <MyCalendar />,
		},
	};

	const handleSetTab = (value) => {
		setTab(value);
		dispatch(setCurrentTab(value));
	};
	useEffect(() => {
		dispatch(setApi("my-tasks"));
	}, []);

	return (
		<>
			<div className="ml-3 mt-3 flex items-center relative gap-3 after:absolute after:-top-3 after:-bottom-14 after:-left-3 after:right-1/2 after:bg-table after:rounded-lg after:shadow-wrapper">
				<FaRegRectangleList className="text-white text-2xl z-10" />

				<h3 className="text-white text-lg uppercase font-bold z-10">
					My Tasks
				</h3>
			</div>
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
				onSelectionChange={handleSetTab}
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

export default MyTasks;
