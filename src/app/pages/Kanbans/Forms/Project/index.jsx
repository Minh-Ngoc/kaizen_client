import { Button, Select, SelectItem } from "@nextui-org/react";
import { GetPagingProject } from "_redux/slice/projectSlice";
import { setSidebarTask } from "_redux/slice/sidebarTaskSlice";
import { UpdateTask } from "_redux/slice/taskSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function Project() {
	const dispatch = useDispatch();
	const { task, isLoading } = useSelector((state) => state.tasks);
	const { projects } = useSelector((state) => state.projects);
	const [selected, setSelected] = useState(
		new Set(
			task?.project && Object.keys(task?.project)?.length
				? [task?.project?._id]
				: []
		)
	);

	useEffect(() => {
		dispatch(GetPagingProject({ pageSize: "all" }));
	}, []);

	const onSubmit = async () => {
		const [newProject] = [...selected];

		if (newProject === task?.project?._id) {
			return dispatch(setSidebarTask({ isOpen: false }))
		}

		dispatch(
			UpdateTask({
				id: task?._id,
				body: {
					projectId: newProject,
				},
			})
		);

		dispatch(setSidebarTask({ isOpen: false }))
	};

	return (
		<div className="my-2 px-1 flex flex-col gap-2 w-full">
			<Select
				fullWidth
				variant={"bordered"}
				placeholder={"Chọn dự án"}
				radius="sm"
				classNames={{
					value: "text-task-title",
					trigger:
						"text-task-title data-[open=true]:border-primary data-[hover=true]:border-primary data-[focus=true]:border-primary",
				}}
				selectionMode={"single"}
				popoverProps={{
					classNames: {
						content: "rounded-md",
					},
					// disableAnimation: true,
					motionProps: {
						variants: {
							enter: {
								y: 0,
								opacity: 1,
								duration: 0.1,
								transition: {
									opacity: {
										duration: 0.15,
									},
								},
							},
							exit: {
								y: "10%",
								opacity: 0,
								duration: 0,
								transition: {
									opacity: {
										duration: 0.1,
									},
								},
							},
						},
					},
				}}
				disableAnimation
				selectedKeys={selected}
				onSelectionChange={setSelected}
			>
				{projects?.map((project) => (
					<SelectItem key={project._id} value={project._id}>
						{project.name}
					</SelectItem>
				))}
			</Select>

			<Button
				fullWidth
				variant="light"
				className={`z-10 mt-3 sticky bottom-0 bg-primary hover:data-[hover=true]:bg-primary-400 items-center rounded-sm py-1 px-2`}
				isLoading={isLoading}
				onClick={onSubmit}
			>
				<span className="font-semibold text-white">Lưu</span>
			</Button>
		</div>
	);
}

export default Project;
