import {Popover, PopoverContent, PopoverTrigger} from "@nextui-org/react";
import React from "react";
import {twMerge} from "tailwind-merge";

const PopoverCustom = ({
	isOpen,
	children,
	trigger,
	className = "",
	onOpenChange,
}) => {
	return (
		<div>
			<Popover
				placement="start"
				backdrop="transparent"
				disableAnimation
				isOpen={isOpen}
				onOpenChange={onOpenChange}
			>
				<PopoverTrigger>{trigger}</PopoverTrigger>
				<PopoverContent
					className={twMerge(
						"min-w-80 max-w-80 px-2 py-0 rounded-md overflow-hidden",
						className
					)}
				>
					{children}
				</PopoverContent>
			</Popover>
		</div>
	);
};

export default PopoverCustom;
