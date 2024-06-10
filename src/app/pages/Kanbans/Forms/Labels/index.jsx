import {useCallback, useMemo, useState} from "react";
import {Input, Checkbox, cn, Button, Tooltip} from "@nextui-org/react";
import {useDispatch, useSelector} from "react-redux";
import {LuPencil} from "react-icons/lu";
import {IoChevronBackOutline} from "react-icons/io5";
import {debounce} from "lodash";
import {setContentItem} from "_redux/slice/sidebarTaskSlice";
import LabelEdit from "./components/LabelEdit";
import NewLabel from "./components/NewLabel";
import {setLabelsOfTask, setTask} from "_redux/slice/taskSlice";
import {updateLabel} from "services/api.service";
import NotifyMessage from "_utils/notify";
import {updateTaskUI} from "_redux/slice/taskSlice";

function Labels() {
	const dispatch = useDispatch();
	const {tasks, task, currentTab} = useSelector((state) => state.tasks);
	const [filterValue, setFilterValue] = useState("");

	const DEBOUNCE_DELAY_FILTER = 100;

	const filteredLabels = useMemo(() => {
		if (filterValue) {
			const inputValue = filterValue.trim().toLowerCase();

			// Filter operation
			let filteredData = task?.labels.filter((user) => {
				return Object.values(user).some(
					(value) =>
						typeof value === "string" &&
						value.toLowerCase().includes(inputValue)
				);
			});

			return filteredData;
		}

		return task?.labels;
	}, [filterValue, tasks, task?.labels]);

	const handleChangeInput = (event) => {
		if (event?.target?.value) {
			return setFilterValue(event?.target?.value);
		}

		setFilterValue("");
	};

	const debouncedFilter = debounce(handleChangeInput, DEBOUNCE_DELAY_FILTER);

	const updateCheckedLabel = async (id, body) => {
		try {
			const {data} = await updateLabel(id, body);

			if (data.status === 1) {
				return data?.label;
			}
		} catch (error) {
			console.log("error: ", error);
			NotifyMessage("Cập nhật nhãn thất bại. Vui lòng thử lại!", "error");
		}
	};

	const handleUpdateCheckedLabel = (_id) => {
		const newLabels = task?.labels?.map((label) => {
			if (label._id === _id) {
				return {
					...label,
					isChecked: !label.isChecked,
				};
			}

			return label;
		});

		const label = task?.labels?.find((l) => l._id === _id);

		updateCheckedLabel(_id, {
			taskId: task._id,
			isChecked: !label.isChecked,
		});

		dispatch(setLabelsOfTask({taskId: task?._id, labels: newLabels}));
		dispatch(setTask({...task, labels: newLabels}));
		currentTab === "list" &&
			dispatch(
				updateTaskUI({
					taskId: task?._id,
					statusId: task?.statusId,
					labels: newLabels,
				})
			);
	};

	const getLabelById = useCallback(
		(id) => {
			if (task?.labels) {
				const label = task?.labels?.find((label) => label._id === id);
				return label?.isChecked;
			}
		},
		[task?.labels]
	);

	const handleClickEditLabelColor = (item) => {
		dispatch(
			setContentItem({
				key: "labels",
				subTitle: "Chỉnh sửa nhãn",
				content: <LabelEdit label={item} taskId={task?._id} />,
				back: (
					<span
						className="p-2 absolute left-1 top-2 cursor-pointer hover:bg-btn-detail rounded-md"
						onClick={handleClickBack}
					>
						<IoChevronBackOutline className="text-base text-task-title" />
					</span>
				),
			})
		);
	};

	const handleClickBack = () => {
		dispatch(
			setContentItem({
				key: "labels",
				subTitle: "",
				content: <Labels />,
				back: <></>,
			})
		);
	};

	const handleClickNewLabel = () => {
		dispatch(
			setContentItem({
				key: "labels",
				subTitle: "Tạo nhãn mới",
				content: <NewLabel labels={task?.labels} taskId={task?._id} />,
				back: (
					<span
						className="p-2 absolute left-1 top-2 cursor-pointer hover:bg-btn-detail rounded-md"
						onClick={handleClickBack}
					>
						<IoChevronBackOutline className="text-base text-task-title" />
					</span>
				),
			})
		);
	};

	return (
		<div className="mt-2 px-1 flex flex-col gap-2 w-full">
			<Input
				size="sm"
				variant="bordered"
				placeholder={`Tìm nhãn...`}
				classNames={{
					inputWrapper:
						"rounded-sm py-2 !h-auto data-[hover=true]:border-primary-400 group-data-[focus=true]:border-primary-400 group-data-[focus=true]:border-2 group-data-[focus=true]:border-primary-400",
					label: "hidden",
					input: "text-sm text-task-title",
				}}
				onChange={debouncedFilter}
			/>

			<div className="mt-3">
				<p className="text-xs text-task-title font-semibold">Nhãn:</p>

				<div className="mt-2 mb-4">
					{!!filteredLabels?.length &&
						filteredLabels?.map((item, index) => (
							<div key={index} className="flex items-center">
								<Checkbox
									aria-label={"checked"}
									radius={"none"}
									classNames={{
										base: cn(
											"inline-flex w-max max-w-md",
											"items-center justify-start",
											"cursor-pointer rounded-lg gap-0 m-0 px-0 border-2 border-transparent"
										),
										label: "hidden",
									}}
									isSelected={getLabelById(item?._id)}
									onValueChange={() => handleUpdateCheckedLabel(item?._id)}
								/>
								<div className="flex flex-1 gap-1 justify-between">
									<Tooltip
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
												Tiêu đề: "{item?.title}"
											</span>
										}
									>
										<span
											className={`cursor-pointer flex-1 h-8 leading-8 rounded-sm ${item?.colorCode} text-ellipsis text-nowrap text-left text-sm text-task-label font-medium overflow-hidden align-middle px-2`}
											onClick={() => handleUpdateCheckedLabel(item?._id)}
										>
											{item?.title}
										</span>
									</Tooltip>

									{/* Edit Label */}
									<div
										className="p-2 cursor-pointer hover:bg-btn-detail rounded-md"
										onClick={() => handleClickEditLabelColor(item)}
									>
										<LuPencil className="text-base text-task-title" />
									</div>
								</div>
							</div>
						))}
				</div>

				<Button
					fullWidth
					variant="light"
					className={`bg-btn-detail hover:data-[hover=true]:bg-btn-detail-hover items-center rounded-sm py-1 px-2`}
					onClick={handleClickNewLabel}
				>
					<span className="font-semibold text-[#505f79]">Tạo nhãn mới</span>
				</Button>
			</div>
		</div>
	);
}

export default Labels;
