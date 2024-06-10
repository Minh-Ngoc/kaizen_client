import PopoverAddTask from "app/pages/Kanbans/components/PopoverAddTask";
import { FaRegRectangleList } from "react-icons/fa6";
import Project from "../index";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { Button } from "@nextui-org/react";

function ProjectValue() {
	const { task, api } = useSelector((state) => state.tasks);

	const popoverProject = useMemo(() => {
		const item = {
			key: "project-1",
			label: "Dự án",
			icon: <FaRegRectangleList size={"16px"} />,
			content: <Project />,
			error: false,
		};

		return (
			<div className="ml-12">
				<PopoverAddTask
					itemKey={"project-1"}
					key={"project-1"}
					item={item}
					trigger={
						<Button
							variant="light"
							className={`w-max bg-primary-200 relative data-[hover=true]:bg-primary-100 items-center rounded-md justify-start py-1 px-2`}
						>
							<span className="font-semibold text-[#505f79]">
								{task?.project?.name}
							</span>
						</Button>
					}
				/>
			</div>
		);
	}, [task, api]);

	if (
		api === "my-tasks" &&
		task?.project &&
		Object.keys(task?.project)?.length
	)
		return (
			<div className="relative mb-6 mt-2">
				<div className="mb-3">
					<div className="absolute left-0 top-0 p-1">
						<FaRegRectangleList className="text-xl text-task-icon" />
					</div>

					<p className="ml-12 mt-1 text-base text-task-title leading-7 font-semibold select-none">
						Dự án
					</p>
				</div>

				{popoverProject}
			</div>
		);
}

export default ProjectValue;
