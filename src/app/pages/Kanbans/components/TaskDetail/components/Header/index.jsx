import { Button, ModalHeader, Tooltip } from "@nextui-org/react";
import { onClose } from "_redux/slice/modalSlice";
import { DeleteTask, deleteTask } from "_redux/slice/taskSlice";
import { memo } from "react";
import { LuArrowRightToLine } from "react-icons/lu";
import { PiTrashLight } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";

function Header({ task }) {
	const dispatch = useDispatch();
	const { currentTab } = useSelector((state) => state.tasks);

	const handleDeleteTask = async (key) => {
        switch(key) {
            case 'delete':
                dispatch(DeleteTask(task?._id));

                currentTab === "list" &&
                    dispatch(
                        deleteTask({ statusId: task?.statusId, taskId: task?._id })
                    );

                dispatch(onClose());

                break;

            case 'close':
                dispatch(onClose());
                break;
        }
		
	};

    const navbarMenu = {
        delete: {
            tooltip: `Xóa công việc ${task?.name}`,
            icon: <PiTrashLight className="text-[#131821] text-xl hover:text-red-500" />
        },
        close: {
            tooltip: 'Đóng',
            icon: <LuArrowRightToLine className="text-task-title text-xl" />
        }
    };

	return (
		<ModalHeader>
			<div className="flex gap-2">
                {Object.keys(navbarMenu)?.map(
                    (key) => (
                        <Button
                            key={key}
                            fullWidth
                            variant="light"
                            className={`min-w-max w-max min-h-max h-8 px-2 bg-transparent hover:bg-default-200`}
                            onClick={() => handleDeleteTask(key)}
                        >
                            <Tooltip
                                    placemen="top"
                                    motionProps={{variants: {}}}
                                    classNames={{
                                        content: "p-0 rounded-md",
                                    }}
                                    content={
                                        <span className={`rounded-md py-1 px-2 text-wrap text-left text-xs max-w-max bg-slate-600 text-white font-normal overflow-hidden align-middle`}>
                                            {navbarMenu[key]?.tooltip}
                                        </span>
                                    }
                                >
                                    <p>{navbarMenu[key]?.icon}</p>
                                </Tooltip>
                        </Button>
                    )
                )}
			</div>
		</ModalHeader>
	);
}

export default memo(Header);
