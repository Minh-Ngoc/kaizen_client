import { UpdateTask } from "_redux/slice/taskSlice";
import useClickOutside from "app/hooks/useOutsideClick";
import { useState } from "react";
import { FaCodeBranch } from "react-icons/fa6";
import { useDispatch } from "react-redux";

const TaskName = ({ content = "", level, checklists, taskId }) => {
	const dispatch = useDispatch();
	const [value, setValue] = useState(content);

	const [isFocus, setIsFocus] = useState(false);

	const handleClickOutside = () => {
		setIsFocus(false);
		if (value && value !== content && taskId) {
			dispatch(
				UpdateTask({
					id: taskId,
					body: {
						name: value,
					},
				})
			);
		}
	};
	const ref = useClickOutside(handleClickOutside);

	return (
		<div className="flex items-center gap-2  h-full w-full">
			<div
				ref={ref}
				className={`text-base font-medium ${!isFocus && "hidden"} ${
					!taskId && "block"
				}  flex-1`}
			>
				<input
					type="text"
					onChange={(e) => {
						setValue(e.target.value);
					}}
					value={value}
					onFocus={() => setIsFocus(true)}
					className={`bg-transparent border-none   p-1 w-full text-white  text-xs font-normal h-full `}
				/>
			</div>

			<div
				onClick={() => setIsFocus(true)}
				className={` ${
					isFocus && "hidden"
				}  hover:border hover:border-white hover:p-1`}
			>
				{value}
			</div>
			{level === 1 && checklists > 0 && (
				<div className="flex items-center gap-1">
					<span>{checklists}</span>
					<FaCodeBranch className="rotate-[180]" />
				</div>
			)}
		</div>
	);
};

export default TaskName;
