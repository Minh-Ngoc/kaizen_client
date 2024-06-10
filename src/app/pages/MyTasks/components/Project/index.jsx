import {
	Input,
	Popover,
	PopoverContent,
	PopoverTrigger,
	User,
} from "@nextui-org/react";
import React, {memo, useEffect, useState} from "react";

import {MdOutlineClose} from "react-icons/md";
import {useDispatch, useSelector} from "react-redux";
import {FaCheck} from "react-icons/fa6";
import {debounce} from "lodash";
import {UpdateTask} from "_redux/slice/taskSlice";
import {updateTaskUI} from "_redux/slice/taskSlice";
import moment from "moment";
import {parseDate} from "@internationalized/date";
import NotifyMessage from "_utils/notify";

const Project = ({project, taskId, statusId, dateStart, dateEnd}) => {
	const dispatch = useDispatch();
	const {projects} = useSelector((state) => state?.projects);
	const [selectedProject, setSelectedProject] = useState(project);

	const [isOpen, setIsOpen] = useState(false);

	const [data, setData] = useState([]);

	const handleSearch = (value) => {
		const result = projects.filter((item) =>
			item.name.toLowerCase().includes(value.toLowerCase())
		);
		setData(result);
	};
	const handleSelectProject = (pro) => {
		if (
			dateStart &&
			dateEnd &&
			(moment(dateStart).isBefore(pro.dateStart) ||
				moment(dateEnd).isAfter(pro.dateEnd))
		) {
			return NotifyMessage(
				`Thời gian thực hiện công việc không thể nằm ngoài thời gian dự án (${moment(
					pro.dateStart
				).format("DD/MM/YYYY")} - ${moment(pro.dateEnd).format("DD/MM/YYYY")})`,
				"warning"
			);
		}
		setSelectedProject(pro);
		dispatch(
			UpdateTask({
				id: taskId,
				body: {
					projectId: pro?._id,
				},
			})
		);
		dispatch(
			updateTaskUI({
				statusId,
				taskId,
				project: pro,
			})
		);

		setIsOpen(false);
	};
	const debouncedFilter = debounce(handleSearch, 500);

	useEffect(() => {
		setData(projects);
	}, [projects]);

	return (
		<Popover
			placement="start"
			backdrop="transparent"
			disableAnimation
			isOpen={isOpen}
			// onOpenChange={onOpenChange}
		>
			<PopoverTrigger onClick={() => setIsOpen(true)}>
				<div className="w-full h-10 cursor-pointer flex items-center">
					{selectedProject?.name || ""}
				</div>
			</PopoverTrigger>
			<PopoverContent className="min-w-80 max-w-80 px-2 py-0 rounded-md overflow-hidden">
				<header className="py-1 relative w-full">
					<h3 className="py-0 px-8 h-10 align-middle text-sm leading-10 text-center tracking-wide font-semibold text-task-title text-ellipsis text-nowrap overflow-hidden">
						Dự án
					</h3>

					<span
						className="p-2 absolute right-1 top-2 cursor-pointer hover:bg-btn-detail rounded-md"
						onClick={() => setIsOpen(false)}
					>
						<MdOutlineClose className="text-base text-task-title" />
					</span>
				</header>
				<section
					id="scrollableDiv"
					className="w-full mb-3 overflow-y-auto max-h-[500px] scrollbar-kanban overscroll-contain"
				>
					<div className="mt-2 px-1 flex flex-col gap-2 w-full relative">
						<Input
							size="sm"
							variant="bordered"
							placeholder={`Tìm dự án...`}
							classNames={{
								inputWrapper:
									"rounded-sm py-2 !h-auto data-[hover=true]:border-primary-400 group-data-[focus=true]:border-primary-400 group-data-[focus=true]:border-2 group-data-[focus=true]:border-primary-400",
								label: "hidden",
								input: "text-sm text-task-title",
							}}
							onChange={(e) => debouncedFilter(e.target.value)}
						/>

						{/* Select Performers */}
						<div className="mt-3">
							<p className="text-xs text-task-title font-semibold">
								Chọn dự án:
							</p>

							<div className="flex flex-col gap-y-1 mt-3">
								{data?.map((item) => (
									<div
										className={`cursor-pointer p-2 rounded-lg hover:bg-gray-100 flex items-center justify-between ${
											selectedProject?._id === item?._id ? "bg-gray-100" : ""
										}`}
										onClick={() => handleSelectProject(item)}
									>
										<span>{item?.name}</span>
										{selectedProject?._id === item?._id && <FaCheck />}
									</div>
								))}
							</div>
						</div>
					</div>
				</section>
			</PopoverContent>
		</Popover>
	);
};

export default memo(Project);
