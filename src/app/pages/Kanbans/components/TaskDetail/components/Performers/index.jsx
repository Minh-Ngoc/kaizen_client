import { Avatar, Tooltip, User } from "@nextui-org/react";
import { URL_IMAGE } from "_constants";
import PopoverAddTask from "../../../PopoverAddTask";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa6";

function Performers() {
	const { task: udTask } = useSelector((state) => state.tasks);
	const { items } = useSelector((state) => state.sidebarTask);

    const perfomersForm = useMemo(
		() => items?.find((item) => item.key === "performers"),
		[items]
	);

	return (
        <>
            <div className="col-span-3 text-sm font-medium">
                Người thực hiện
            </div>
            <div className="col-span-9">
                <div className={`flex flex-row flex-wrap justify-start`}>
                    {udTask?.performers?.map((item) => (
                        <Tooltip
                            key={item?._id}
                            placemen="top"
                            motionProps={{ variants: {} }}
                            classNames={{
                                content: "p-0 rounded-md",
                            }}
                            content={
                                <span
                                    className={`rounded-md py-1 px-2 text-wrap text-left text-xs max-w-56 bg-slate-600 text-white font-normal overflow-hidden align-middle`}
                                >
                                    {item.name || item.username}
                                </span>
                            }
                        >
                            <User
                                name={`${item.name || item.username}`}
                                description={!item.name ? item?.username : ""}
                                avatarProps={{
                                    src: item?.avatar
                                        ? `${URL_IMAGE}/${item?.avatar}`
                                        : "",
                                }}
                                classNames={{
                                    base: "hover:opacity-50 cursor-pointer",
                                    description: "hidden",
                                    name: "hidden",
                                }}
                            />
                        </Tooltip>
                    ))}

                    {/* Add Perfomers */}
                    <PopoverAddTask
                        placement="bottom"
                        itemKey="performers2"
                        item={perfomersForm}
                        trigger={
                            <div className="flex items-center gap-1">
                                <Avatar
                                    icon={<FaPlus className="text-lg text-task-icon" />}
                                    classNames={{
                                        base: "cursor-pointer bg-btn-detail-hover hover:opacity-50",
                                        icon: "text-black/80",
                                    }}
                                />
                                {!udTask?.performers?.length && (
                                    <span className="text-sm text-task-title">Chưa có người thực hiện</span>
                                )}
                            </div>
                        }
                    />
                </div>
            </div>
        </>
	);
}

export default Performers;
