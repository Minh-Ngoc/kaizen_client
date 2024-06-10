import { lazy, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import TeamStats from "../Team/components/TeamStats";
import NewStats from "../New/components/NewStats";
import KpiStats from "../KpiBonus/components/KpiStats";
import KpiTeamStats from "../KpiBonus/components/KpiTeamStats";
import { Tab, Tabs } from "@nextui-org/react";

const TasksOfUsersColumnsChart = lazy(() => import("../Kanbans/components/TasksOfUsersColumnsChart"));
const TasksOfUsersLineChart = lazy(() => import("../Kanbans/components/TasksOfUsersLineChart"));

function DashBoard() {
	const { permissions } = useSelector((state) => state.auth);
	const [tab, setTab] = useState("");

	const tasksReportedChart = useMemo(
		() =>
			permissions?.find((item) =>
				["tasks-reported-chart", "all"].includes(item.subject)
			),
		[permissions]
	);

    const usersReportedChart = useMemo(
		() =>
			permissions?.find((item) =>
				["users-reported-chart", "all"].includes(item.subject)
			),
		[permissions]
	);

    useEffect(() => {
        const usersReported = permissions?.find((item) =>
            ["users-reported-chart", "all"].includes(item.subject)
        );
        
        const tasksReported = permissions?.find((item) =>
            ["tasks-reported-chart", "all"].includes(item.subject)
        );

        if(usersReported?.action?.length) {
            return setTab('usersReported');
        }

        if(tasksReported?.action?.length) {
            return setTab('tasksReported');
        }
    }, []);

    const tabsList = useMemo(() => {
        const items = {
            usersReported: {
                title: "Các nhân viên đã báo cáo công việc",
                element: <TasksOfUsersColumnsChart />
            },
            tasksReported: {
                title: "Các công việc đã báo cáo",
                element: <TasksOfUsersLineChart />
            },
        };

        if(!!tasksReportedChart?.action?.length && !usersReportedChart?.action?.length) {
            delete items.usersReported;
        }

        if(!tasksReportedChart?.action?.length && !!usersReportedChart?.action?.length) {
            delete items.tasksReported;
        }

        return items;
    }, [tasksReportedChart, usersReportedChart]);

	return (
        <div className="flex flex-col mt-24">
            {/* Tasks Reported Chart All Users */}
            <div className="px-4 py-2 mb-6 bg-table shadow-wrapper rounded-lg">
                {/* Tabs */}
                <Tabs
                    variant={"underlined"}
                    aria-label="Tabs variants"
                    classNames={{
                        base: "z-50 w-full",
                        cursor: "bg-white w-full top-[34px]",
                        tabList: "w-full relative border-b border-default-300/20",
                        tabContent: "z-50",
                        tab: "z-50 text-white max-w-fit",
                    }}
                    selectedKey={tab}
                    onSelectionChange={setTab}
                >
                    {Object.keys(tabsList)?.map((key) => (
                        <Tab
                            key={key}
                            title={
                                <div className="flex items-center gap-1">
                                    {tabsList[key]?.icon}
                                    <p className="text-white font-medium">
                                        {tabsList[key]?.title}
                                    </p>
                                </div>
                            }
                        >
                            {tabsList[key]?.element}
                        </Tab>
                    ))}
                </Tabs>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6 w-full">
                {/* TeamStats */}
                <div className="p-4 overflow-hidden bg-table shadow-wrapper rounded-lg">
                    <div className="flex flex-col w-full">
                        <TeamStats />
                    </div>
                </div>

                {/* NewStats */}
                <div className="p-4 overflow-hidden bg-table shadow-wrapper rounded-lg">
                    <div className="flex flex-col w-full">
                        <NewStats />
                    </div>
                </div>

                {/* KpiStats */}
                <div className="p-4 bg-table shadow-wrapper rounded-lg grow">
                    <div className="flex flex-col w-full h-full gap-1">
                        <KpiStats />
                    </div>
                </div>

                {/* KpiTeamStats */}
                <div className="p-4 bg-table shadow-wrapper rounded-lg grow">
                    <div className="flex flex-col w-full h-full gap-1">
                        <KpiTeamStats />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashBoard;
