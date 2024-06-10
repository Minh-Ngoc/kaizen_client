import { Button, Divider, Progress } from "@nextui-org/react";
import { Fragment, useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import ChecklistTile from "./ChecklistTile";
import AddItemChecklist from "./AddItemChecklist";
import ItemChecklist from "./ItemChecklist";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import PopoverAddTask from "app/pages/Kanbans/components/PopoverAddTask";
import Checklist from "../index";
import { FiCheckSquare } from "react-icons/fi";

function ChecklistValue() {
	const { task } = useSelector((state) => state.tasks);

	const [activeIndex, setActiveIndex] = useState(null);
	const [oddPanel, setOddPanel] = useState(null);

	const progressChecklist = useCallback((items) => {
		if (items.length) {
			const count = items.filter((it) => it.isChecked);
			const percent = (count.length / items.length) * 100;

			return percent.toFixed(0);
		}

		return 0;
	}, []);

	const toggleAccordion = (index) => {
		const panel = document.getElementById(`panel-${index}`);
		if (oddPanel && oddPanel !== panel) {
			oddPanel.style.maxHeight = null;
		}

		setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
		setOddPanel(panel);

		if (panel.style.maxHeight) {
			panel.style.maxHeight = null;
		} else {
			panel.style.maxHeight = panel.scrollHeight + 100 + "px";
		}
	};

	return (
		<div className="col-span-12">
			<div className="text-sm font-medium">Checklists</div>

			{!!task?.checklist?.length && (
				<div className="mt-3 py-3 border-y-1 border-default-200 relative flex flex-col gap-4 transition-all">
					{task?.checklist?.map((chk, index) => (
						<Fragment key={index}>
							<div className="flex items-start gap-2">
								<Button
									radius="full"
									variant="bordered"
									className={`min-w-0 min-h-0 w-8 h-8 bg-transparent text-left text-lg font-semibold transition-colors`}
									onClick={() => toggleAccordion(index)}
								>
									<span className="float-right">
										{activeIndex === index ? (
											<FaMinus
												className="text-sm"
												color="rgb(90 105 131)"
											/>
										) : (
											<FaPlus
												className="text-sm"
												color="rgb(90 105 131)"
											/>
										)}
									</span>
								</Button>
								<ChecklistTile checklist={chk} />
							</div>

							{/* Accordion */}
							<div
								id={`panel-${index}`}
								className={`overflow-hidden transition-all max-h-0`}
							>
								<div className="flex flex-col gap-2">
									{/* Checklist Progress */}
									<div className="relative overflow-hidden">
										<span className="absolute left-2 top-0 text-task-title text-xs font-medium">
											{progressChecklist(chk.items)}%
										</span>

										<Progress
											aria-label="Progress..."
											size="md"
											value={progressChecklist(chk.items)}
											color={
												progressChecklist(chk.items) !==
												"100"
													? "primary"
													: "success"
											}
											showValueLabel={true}
											classNames={{
												base:
													"max-w-progress ml-12 h-5 float-right",
												labelWrapper: "hidden",
												label: "hidden",
												value: "hidden",
												track: "my-auto !h-2",
											}}
										/>
									</div>

									{/* Item Checklist */}
									<div className="flex flex-col gap-2">
										{chk?.items?.map(
											(item, index) =>
												!!Object.keys(item)?.length && (
													<ItemChecklist
														key={index}
														checklist={chk}
														item={item}
													/>
												)
										)}
									</div>

									{/* Add Item Checklist */}
									<AddItemChecklist checklist={chk} />
								</div>
							</div>

							{index < task?.checklist?.length - 1 && <Divider />}
						</Fragment>
					))}
				</div>
			)}

			<PopoverAddTask 
				placement="top" 
				itemKey={"checklist"} 
				item={{
					key: "checklist",
					label: "Checklists",
					icon: <FiCheckSquare className="text-base" />,
					content: <Checklist />,
					error: false,
				}}
				trigger={
					<Button
						variant="bordered"
						radius="sm"
						className="my-3 min-w-0 min-h-0 w-max h-max bg-transparent text-left px-2 py-1 hover:bg-default-200/50"
						startContent={<FaPlus color="rgb(90 105 131)" />}
					>
						Thêm Checklist
					</Button>
				}
			/>
		</div>
	);
}

export default ChecklistValue;
