import {GetPagingMyTask} from "_redux/slice/taskSlice";
import {GetPagingTaskList} from "_redux/slice/taskSlice";
import {deleteTask} from "_redux/slice/taskSlice";
import useClickOutside from "app/hooks/useOutsideClick";
import React, {memo, useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {addNewTask} from "services/api.service";

const InputComp = ({content = "", statusId, projectId, onUpdateTasks}) => {
	const inputRef = useRef(null);
	const dispatch = useDispatch();
	const [value, setValue] = useState(content);

	const handleAddNewTask = async (taskName) => {
		const res = await addNewTask({
			projectId: projectId,
			statusId: statusId,
			name: taskName,
		});

		await onUpdateTasks(res?.data?.task);
		dispatch(GetPagingMyTask());
	};
	function handleKeyDown(event) {
		if (event.keyCode === 13) {
			onClickOutside();
		}
	}
	const onClickOutside = () => {
		if (value) {
			handleAddNewTask(value);
		} else {
			dispatch(deleteTask({statusId, taskId: ""}));
		}
	};

	const ref = useClickOutside(onClickOutside);
	// useEffect(() => {
	// 	const handleClickOutside = (event) => {
	// 		if (ref.current && !ref.current.contains(event.target)) {
	// 			onClickOutside && onClickOutside();
	// 		}
	// 	};
	// 	document.addEventListener("click", handleClickOutside, true);
	// 	return () => {
	// 		document.removeEventListener("click", handleClickOutside, true);
	// 	};
	// }, [onClickOutside]);
	useEffect(() => {
		setTimeout(() => {
			inputRef.current?.focus();

			window.scroll({
				top: inputRef.current?.innerHeight,
				behavior: "smooth",
			});
		}, [1000]);
	}, [inputRef]);

	return (
		<div className=" flex-1" ref={ref}>
			<input
				type="text"
				ref={inputRef}
				onChange={(e) => {
					setValue(e.target.value);
				}}
				onKeyDown={handleKeyDown}
				placeholder="Nhập tên công việc..."
				className="w-full py-1 bg-transparent  outline-none  font-medium  "
			/>
		</div>
	);
};

export default memo(InputComp);
