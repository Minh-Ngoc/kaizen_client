import { Avatar, Tooltip } from "@nextui-org/react";
import { FaPlus } from "react-icons/fa6";
import { useSelector } from "react-redux";
import PopoverAddTask from "../../../PopoverAddTask";
import { useMemo } from "react";
import { TiTag } from "react-icons/ti";

function Labels() {
    const { task: udTask } = useSelector((state) => state.tasks);
	const { items } = useSelector((state) => state.sidebarTask);

    const labelsForm = useMemo(
		() => items?.find((item) => item.key === "labels"),
		[items]
	);

	return (
		<>
			<div className="col-span-3 text-sm font-medium">
                Nhãn
            </div>

			<div className="col-span-9 relative">
				<PopoverAddTask
					itemKey="labels2"
					item={labelsForm}
					trigger={
						<div
							className={`flex flex-row w-max gap-2 flex-wrap items-center justify-start`}
						>
							{udTask?.labels?.map(
								(item, index) =>
									item.isChecked && (
										<Tooltip
											key={index}
											placemen="top"
											motionProps={{
												variants: {},
											}}
											classNames={{
												content: "p-0 rounded-md",
											}}
											content={
												<span
													className={`rounded-md py-1 px-2 text-wrap text-left text-xs max-w-72 bg-slate-600 text-white font-normal overflow-hidden align-middle`}
												>
													Tiêu đề: "{item?.title}"
												</span>
											}
										>
											<span
												className={`${
													item?.colorCode
														? `${item?.colorCode} `
														: ""
												}inline-block cursor-pointer rounded h-8 min-w-16 text-ellipsis text-nowrap overflow-hidden text-left text-xs text-task-label px-2 hover:opacity-50`}
											>
												<span className="block leading-8 max-w-full">
													{item?.title}
												</span>
											</span>
										</Tooltip>
									)
							)}

							{/* Add Labels */}
                            <div className="flex items-center gap-1">
                                <Avatar
                                    icon={<TiTag className="text-lg -rotate-90" />}
                                    classNames={{
                                        base: "cursor-pointer bg-btn-detail-hover hover:opacity-50",
                                        icon: "text-black/80",
                                    }}
                                />
								{!udTask?.labels?.length && (
									<span className="text-sm text-task-title">Chưa có nhãn</span>
								)}
                            </div>
						</div>
					}
				/>
			</div>
		</>
	);
}

export default Labels;
