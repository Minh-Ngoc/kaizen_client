import { Avatar, Button } from "@nextui-org/react";
import PopoverAddTask from "../../../PopoverAddTask";
import { useDispatch, useSelector } from "react-redux";
import { FaRegRectangleList } from "react-icons/fa6";
import ProjectForm from "./components/ProjectForm";
import { setModal } from "_redux/slice/modalSlice";

function Project() {
    const dispatch = useDispatch();
	const { task } = useSelector((state) => state.tasks);

    return (  
        <>
            <div className="col-span-3 text-sm font-medium">
                Dự án
            </div>
            <div className="col-span-9 relative">
                <PopoverAddTask
                    placement="bottom"
                    itemKey={"project-1"}
                    key={"project-1"}
                    item={{
                        key: "project",
                        label: "Dự án",
                        icon: <FaRegRectangleList size={"16px"} />,
                        content: <ProjectForm />,
                        error: false,
                    }}
                    trigger={
                        task?.project?.name ? (
                            <Button
                                variant="light"
                                className={`w-max bg-primary-200 relative data-[hover=true]:bg-primary-100 items-center rounded-md justify-start py-1 px-2`}
                            >
                                <span className="font-semibold text-[#505f79]">
                                    {task?.project?.name}
                                </span>
                            </Button>
                        ) : (
                            <div className="flex items-center gap-1">
                                <Avatar
                                    icon={<FaRegRectangleList className="text-lg text-task-icon" />}
                                    classNames={{
                                        base: "cursor-pointer bg-btn-detail-hover hover:opacity-50",
                                        icon: "text-black/80",
                                    }}
                                />
                                <span className="text-sm text-task-title">Chưa chọn dự án</span>
                            </div>
                        )
                    }
                />
            </div>
        </>
    );
}

export default Project;