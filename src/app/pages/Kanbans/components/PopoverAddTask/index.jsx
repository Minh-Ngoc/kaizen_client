import {
	Popover,
	PopoverTrigger,
	PopoverContent,
	Button,
} from "@nextui-org/react";
import { setInit, setSidebarTask } from "_redux/slice/sidebarTaskSlice";
import { memo, useCallback } from "react";
import { MdOutlineClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { FiInfo } from "react-icons/fi";

function PopoverAddTask({ item, trigger = "", itemKey = "", placement = "" }) {
	const dispatch = useDispatch();

	const { isOpen, key } = useSelector((state) => state.sidebarTask);
	const { isFocused } = useSelector(state => state.modal);

	const handleClosePopover = () => {
		dispatch(setSidebarTask({ isOpen: false, key: "" }));
		dispatch(setInit());
	};

	const onOpenChange = useCallback((open) => {
		// if(!['dates', 'dates2', 'checklist'].includes(itemKey) && !open) {
		// 	dispatch(setInit());
		// }

		if (open) {
			dispatch(setSidebarTask({ isOpen: open, key: itemKey }));
		}
		
		if (!isFocused && !open) {
			dispatch(setInit());
		}
	}, [dispatch, isFocused, itemKey]);

	return (
		<Popover
			placement={placement}
			// offset={-150}
			backdrop="transparent"
			motionProps={{
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
			}}
			isOpen={isOpen && itemKey === key}
			onOpenChange={onOpenChange}
			disableAnimation
		>
			<PopoverTrigger>
				{trigger ? (
					trigger
				) : (
					<Button
						fullWidth
						variant="light"
						className={`bg-btn-detail relative data-[hover=true]:bg-btn-detail-hover items-center rounded-sm justify-start py-1 px-2${
							item?.error
								? " outline-2 outline-red-500 bg-red-200"
								: ""
						}`}
						startContent={item?.icon}
						endContent={
							item?.error ? (
								<FiInfo className="absolute text-lg right-2 top-[10px] text-red-600" />
							) : (
								<></>
							)
						}
					>
						<span className="font-semibold text-[#505f79]">
							{item?.label}
						</span>
					</Button>
				)}
			</PopoverTrigger>
			<PopoverContent className="min-w-80 max-w-80 px-2 py-0 rounded-md overflow-hidden">
				{/* Header */}
				<header className="py-1 relative w-full">
					{item?.back}

					<h3 className="py-0 px-8 h-10 align-middle text-sm leading-10 text-center tracking-wide font-semibold text-task-title text-ellipsis text-nowrap overflow-hidden">
						{item?.subTitle || item?.label}
					</h3>

					<span
						className="p-2 absolute right-1 top-2 cursor-pointer hover:bg-btn-detail rounded-md"
						onClick={handleClosePopover}
					>
						<MdOutlineClose className="text-base text-task-title" />
					</span>
				</header>

				{/* Content */}
				<section className="w-full mb-3 overflow-y-auto max-h-[500px] scrollbar-kanban">
					{item?.content}
				</section>
			</PopoverContent>
		</Popover>
	);
}

export default memo(PopoverAddTask);
