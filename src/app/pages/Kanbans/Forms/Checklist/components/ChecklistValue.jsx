import {Button, Divider, Progress} from "@nextui-org/react";
import {Fragment, useCallback, useState} from "react";
import {useSelector} from "react-redux";
import ChecklistTile from "./ChecklistTile";
import AddItemChecklist from "./AddItemChecklist";
import ItemChecklist from "./ItemChecklist";
import {FaPlus} from "react-icons/fa6";
import {FaMinus} from "react-icons/fa";
import { FiCheckSquare } from "react-icons/fi";

function ChecklistValue() {
	const {task} = useSelector((state) => state.tasks);
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

	if (!!task?.checklist?.length)
		return (
			<div className="relative mb-6 mt-2">
				<div className="mb-3">
					<div className="absolute left-0 top-0 p-1">
						<FiCheckSquare className="text-xl text-task-icon" />
					</div>

					<p className="ml-12 mt-1 text-base text-task-title leading-7 font-semibold select-none">
						Danh sách việc cần làm
					</p>
				</div>
				
				<div className="ml-12 flex flex-col gap-4 transition-all">
					{task?.checklist?.map((chk, index) => (
						<Fragment key={index}>
							<div className="flex items-start gap-2 mb-2">
								<Button
									radius="sm"
									className={`mt-[2px] min-w-0 min-h-0 h-7 w-7 bg-gray-200 text-left py-2 px-4 text-lg font-semibold transition-colors`}
									onClick={() => toggleAccordion(index)}
								>
									<span className="float-right">
										{activeIndex === index ? (
											<FaMinus className="text-sm" color="rgb(90 105 131)" />
										) : (
											<FaPlus className="text-sm" color="rgb(90 105 131)" />
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
												progressChecklist(chk.items) !== "100"
													? "primary"
													: "success"
											}
											showValueLabel={true}
											classNames={{
												base: "max-w-progress ml-12 h-5 float-right",
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
			</div>
		);
}

export default ChecklistValue;
