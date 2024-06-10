import { MdAccessTime } from "react-icons/md";
import PopoverAddTask from "../../../PopoverAddTask";
import { Avatar, Button } from "@nextui-org/react";
import { useMemo } from "react";
import moment from "moment";
import { useSelector } from "react-redux";

function Dates() {
	const { task } = useSelector((state) => state.tasks);
	const { items } = useSelector((state) => state.sidebarTask);

    const datesForm = useMemo(
		() => items?.find((item) => item.key === "dates"),
		[items]
	);

    const renderDate = useMemo(() => {
		const startDate = moment(task?.dateStart);
		const endDate = moment(task?.dateEnd);

		if (
			startDate.isSame(endDate, "month") &&
			startDate.isSame(endDate, "year")
		) {
			return `${startDate.format("DD")} - ${endDate.format(
				"DD MMMM YYYY"
			)}`;
		} else if (startDate.isSame(endDate, "year")) {
			return `${startDate.format("DD/MM")} - ${endDate.format(
				"DD/MM/YYYY"
			)}`;
		} else {
			return `${startDate.format("DD MMMM YYYY")} - ${endDate.format(
				"DD MMMM YYYY"
			)}`;
		}
	}, [task]);

    return (  
        <>
            <div className="col-span-3 text-sm font-medium">
                Thời gian thực hiện
            </div>

            <div className="col-span-9 relative">
                <PopoverAddTask
                    placement="bottom"
                    itemKey="dates2"
                    item={datesForm}
                    trigger={
                        (!task?.dateStart || !task?.dateEnd) ? (
                            <div className="flex items-center gap-1">
                                <Avatar
                                    icon={<MdAccessTime className="text-xl text-task-icon -rotate-90" />}
                                    classNames={{
                                        base: "cursor-pointer bg-btn-detail-hover hover:opacity-50",
                                        icon: "text-black/80",
                                    }}
                                />
                                <span className="text-sm text-task-title">Chưa chọn thời gian thực hiện</span>
                            </div>
                        ) : (
                            <Button
                                variant="solid"
                                color="primary"
                                className={`bg-transparent hover:data-[hover=true]:bg-btn-detail-hover items-center rounded-md py-1 px-2`}
                            >
                                <span className="font-medium text-task-title">
                                    {renderDate}
                                </span>
                            </Button>
                        )
                    }
                />
            </div>
        </>
    );
}

export default Dates;