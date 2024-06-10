import Dates from "app/pages/Kanbans/Forms/Dates";
import moment from "moment";
import { MdAccessTime } from "react-icons/md";
import PopoverAddTask from "../../PopoverAddTask";
import { Button } from "@nextui-org/react";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { setTask } from "_redux/slice/taskSlice";

function ChecklistsOfTask({ task, activeIndex }) {
	const dispatch = useDispatch();

	const columns = {
		title: {
			title: "Công việc",
			className: "col-span-6",
		},
		time: {
			title: "Thời gian thực hiện",
			className: "col-span-3",
		},
		items: {
			title: "Số lượng việc cần làm",
			className: "col-span-3",
		},
	};

	const renderDate = (checklist) => {
		if (!checklist?.dateStart || !checklist?.dateEnd) return "(Trống)";
		const startDate = moment(checklist?.dateStart);
		const endDate = moment(checklist?.dateEnd);

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
	};

	const handleSetTask = useCallback(
		(task) => {
			dispatch(setTask(task));
		},
		[task]
	);

	if (!!task?.checklist?.length) {
		return task?.checklist?.map((checklist, index) => (
			<div
				key={index}
				id={`panel-${task?._id}`}
				className={`col-span-12 overflow-hidden transition-all max-h-0 w-full ${
					activeIndex === task?._id ? "mb-3" : "my-0"
				}`}
			>
				<div className="ml-24 w-full grid grid-cols-1 text-white">
					{/* Header */}
					<div className="row-span-1 grid grid-cols-12 items-center border-y-1">
						{Object.keys(columns)?.map((key) => (
							<div
								key={key}
								className={`${columns[key]?.className} px-2 py-3 border-white border-r-1 last:border-r-0`}
							>
								{columns[key]?.title}
							</div>
						))}
					</div>

					<div
						key={checklist?._id}
						className={`row-span-1 grid grid-cols-12 hover:bg-slate-500/50 ${
							index < task?.checklist?.length - 1
								? " border-b-1 border-slate-500/50"
								: ""
						}`}
					>
						{/* <Button
                            fullWidth
                            variant="solid"
                            color="primary"
                            className={`bg-transparent gap-5 h-14 hover:data-[hover=true]:bg-slate-500/50 justify-start items-center rounded-sm py-3 px-2`}
                            onClick={() => toggleAccordion(checklist?._id)}
                        >
                            <BiSolidRightArrow className={`text-slate-300 text-base transition-transform duration-100 ease-linear ${activeIndex === checklist?._id ? 'rotate-90' : 'rotate-0'}`} />
                        </Button> */}
						{/* <div
                            id={`panel-${checklist?._id}`}
                            className={`overflow-hidden transition-all max-h-0 w-full ${
                                visible ? 'bg-slate-500/50' : 'bg-transparent'} grid grid-cols-12 ${
                                activeIndex === checklist?._id ? 'mb-3' : 'my-0'
                            }`}
                        >
                            
                        </div> */}
						{/* Title */}
						<div
							className={`ml-24 pr-2 col-span-6 h-full py-5 flex items-center border-r-1 border-b-1 border-slate-500/50 ${
								index === 0 ? "border-t-1" : "border-t-0"
							}`}
						>
							{checklist?.title}
						</div>

						{/* Date */}
						<div
							className={`px-2 col-span-3 h-full py-5 flex items-center border-r-1 border-b-1 border-slate-500/50 ${
								index === 0 ? "border-t-1" : "border-t-0"
							}`}
						>
							{/* {renderDate(checklist)} */}
							<PopoverAddTask
								itemKey={`dates-checklist-item-${task?._id}`}
								item={{
									key: `dates-checklist-item-${task?._id}`,
									label: "Thời gian thực hiện",
									icon: <MdAccessTime size={"16px"} />,
									content: <Dates />,
									error: false,
								}}
								trigger={
									<Button
										variant="solid"
										color="primary"
										className="!bg-transparent"
										onClick={handleSetTask}
									>
										<span className="font-semibold">
											{renderDate(checklist)}
										</span>
									</Button>
								}
							/>
						</div>

						{/* Items */}
						<div
							className={`px-2 col-span-3 h-full py-5 flex items-center border-r-1 border-b-1 border-slate-500/50 ${
								index === 0 ? "border-t-1" : "border-t-0"
							}`}
						>
							{checklist?.items?.length || 0}
						</div>
					</div>
				</div>
			</div>
		));
	}
}

export default ChecklistsOfTask;
