import {Tooltip} from "@nextui-org/react";
import React, {useMemo} from "react";

const Labels = ({labels}) => {
	const renderLables = useMemo(() => {
		const isChecked = labels?.find((label) => label.isChecked);

		return (
			<div
				className={`${
					isChecked ? "grid" : "hidden"
				} grid-cols-3 gap-1 max-w-task-label mb-2 mr`}
			>
				{labels?.map(
					(label, index) =>
						label.isChecked && (
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
										className={`rounded-md py-1 px-2 text-wrap text-left text-xs max-w-56 bg-slate-600 text-white font-normal overflow-hidden align-middle`}
									>
										Color: {label.colorLabel}, title: "{label?.title}"
									</span>
								}
							>
								<span
									key={index}
									className={`${
										label?.colorCode ? `${label?.colorCode} ` : ""
									}inline-block rounded min-w-full max-w-full h-4 text-ellipsis text-nowrap overflow-hidden text-left text-xs text-task-label px-2 hover:opacity-50`}
								>
									{label?.title}
								</span>
							</Tooltip>
						)
				)}
			</div>
		);
	}, [labels]);
	return <div>{renderLables}</div>;
};

export default Labels;
