import { memo, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Checkbox, Textarea, Tooltip } from "@nextui-org/react";
import { MdOutlineClose } from "react-icons/md";
import { setTask, setCheckListTitle, setTasks, UpdateTask } from "_redux/slice/taskSlice";
import {
	deleteItemChecklistById,
	updateItemChecklist,
	convertItemToTask,
} from "services/api.service";
import { GoTasklist } from "react-icons/go";
import NotifyMessage from "_utils/notify";
import { PiTrashLight } from "react-icons/pi";
import PopupAddTimeChecklistItem from "./PopupAddTimeChecklistItem";
import PopoverAddTask from "app/pages/Kanbans/components/PopoverAddTask";
import { FaRegRectangleList } from "react-icons/fa6";
import { getStatusById } from "services/api.service";

const STATUS_COMPLETED = '6629bb7c331b96b6a72d91f9';

function ItemChecklist({ checklist, item }) {
	const dispatch = useDispatch();
	const { task, tasks: tasksList } = useSelector((state) => state.tasks);
	const [visible, setVisible] = useState(false);
	const [status, setStatus] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const title = useMemo(() => {
		const findChecklist = task?.checklist?.find(
			(chst) => chst._id === checklist?._id
		);
		const it = findChecklist?.items.find((el) => el?._id === item?._id);

		return it?.title;
	}, [task, checklist, item]);

	const fetchData = async () => {
		try {
			const { data } = await getStatusById(task?.statusId);

			if(data?.status === 1) {
				setStatus(data?.data?.name);
			}
		} catch (error) {
			console.log('error: ', error);
		}
	}

	useEffect(() => {
		fetchData();
	}, [])

	const handleChangeTitleItem = (value) => {
		const newChecklist = task?.checklist?.map((chst) => {
			if (chst._id === checklist?._id) {
				const items = chst?.items?.map((it) => {
					if (it?._id === item?._id) {
						return { ...it, title: value };
					}
					return it;
				});
				return { ...chst, items };
			}

			return chst;
		});

		dispatch(
			setCheckListTitle({ taskId: task?._id, checklist: newChecklist })
		);

		dispatch(setTask({ ...task, checklist: newChecklist }));
	};

	const handleUpdateTitleChecklist = async () => {
		if (!title) {
			return setVisible(false);
		}

		try {
			setIsLoading(true);

			const { data } = await updateItemChecklist(checklist?._id, item?._id, {
				title,
			});

			if (data.status === 1) {
				setVisible(false);
			}
		} catch (error) {
			console.log("error: ", error);
			NotifyMessage(
				"Cập nhật việc làm thất bại. Vui lòng thử lại!",
				"error"
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleUpdateIsChecked = async (value) => {
		// setIschecked(value);

		try {
			setIsLoading(true);

			const { data } = await updateItemChecklist(checklist?._id, item?._id, {
				isChecked: value,
			});

			if (data.status === 1) {
				const newChecklist = task?.checklist?.map((chst) => {
					if (chst._id === checklist?._id) {
						const items = chst?.items?.map((it) => {
							if (it?._id === item?._id) {
								return { ...it, isChecked: value };
							}
							return it;
						});
						return { ...chst, items };
					}

					return chst;
				});

				const allChecklistsChecked = newChecklist?.every(chst =>
					chst?.items.every(item => item.isChecked)
				);

				const isCompleted = !!newChecklist?.length && !!allChecklistsChecked;

				if(isCompleted) {
					dispatch(UpdateTask({
						id: task?._id, 
						body: {
							statusId: STATUS_COMPLETED
						}
					}));

					const newTasks = tasksList?.map(
						tsk => {
							if (tsk?._id === task?._id) {
								return {
									...tsk,
									statusId: STATUS_COMPLETED
								};
							}

							return tsk;
						}
					);

					dispatch(setTasks(newTasks));
				};

				dispatch(
					setCheckListTitle({
						taskId: task?._id,
						checklist: newChecklist,
					})
				);

				dispatch(setTask({ ...task, checklist: newChecklist }));
			}
		} catch (error) {
			console.log("error: ", error);
			NotifyMessage(
				"Cập nhật việc làm thất bại. Vui lòng thử lại!",
				"error"
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteItemChecklist = async () => {
		try {
			setIsLoading(true);

			const { data } = await deleteItemChecklistById(
				checklist?._id,
				item?._id
			);

			if (data.status === 1) {
				const newChecklist = task?.checklist?.map((chst) => {
					if (chst._id === checklist?._id) {
						const items = chst?.items?.filter(
							(it) => it?._id !== item?._id
						);
						return { ...chst, items };
					}

					return chst;
				});

				dispatch(
					setCheckListTitle({
						taskId: task?._id,
						checklist: newChecklist,
					})
				);

				dispatch(setTask({ ...task, checklist: newChecklist }));
			}
		} catch (error) {
			console.log("error: ", error);
			NotifyMessage(
				"Xóa việc làm thất bại. Vui lòng thử lại!",
				"error"
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleConvertItemChecklistToTask = async () => {
		try {
			setIsLoading(true);

			const { data } = await convertItemToTask(checklist?._id, item?._id);

			if (data.status === 1) {
				const newChecklist = task?.checklist?.map((chst) => {
					if (chst._id === checklist?._id) {
						const items = chst?.items?.filter(
							(it) => it?._id !== item?._id
						);
						return { ...chst, items };
					}

					return chst;
				});

				dispatch(
					setCheckListTitle({
						taskId: task?._id,
						checklist: newChecklist,
					})
				);

				dispatch(setTask({ ...task, checklist: newChecklist }));

				dispatch(setTasks([...tasksList, data?.task]));
			}
		} catch (error) {
			console.log("error: ", error);
			NotifyMessage(
				"Cập nhật việc làm thất bại. Vui lòng thử lại!",
				"error"
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSetVisible = () => {
		setVisible(true);
	};

	const popoverDeleteItem = useMemo(() => {
		const itemPopup = {
			key: `delete-item-${item?._id}`,
			label: item?.title,
			icon: <FaRegRectangleList size={"16px"} />,
			content: (
				<div className="mb-3 px-1 flex flex-col gap-2 w-full">
					<p className="text-xs text-task-title font-semibold">
						Mọi hành động sẽ bị xóa khỏi nguồn cấp dữ liệu hoạt động và
						bạn sẽ không thể mở lại công việc. Không có hoàn tác.
					</p>
					<Button
						fullWidth
						variant="light"
						className={`bg-red-500 relative data-[hover=true]:bg-red-400 items-center rounded-sm py-1 px-2`}
						onClick={handleDeleteItemChecklist}
						isLoading={isLoading}
					>
						<span className="font-semibold text-white">Xóa công việc</span>
					</Button>
				</div>
			),
			error: false,
		};

		return (
			<PopoverAddTask
				itemKey={`delete-item-${item?._id}`}
				key={`delete-item-${item?._id}`}
				item={itemPopup}
				trigger={
					<Button
						radius="full"
						variant="bordered"
						className={`min-h-max h-max min-w-max w-max bg-white items-center p-[6px] hover:bg-default-200`}
					>
						<Tooltip
								placemen="top"
								motionProps={{ variants: {} }}
								classNames={{
									content: "p-0 rounded-md",
								}}
								content={
									<span
										className={`rounded-md py-1 px-2 text-wrap text-left text-xs max-w-max bg-slate-600 text-white font-normal overflow-hidden align-middle`}
									>
										Xóa '{item?.title}'
									</span>
								}
							>
								<p><PiTrashLight className="text-base" /></p>
							</Tooltip>
					</Button>
				}
			/>
		)
	}, [item]);

	const popoverConvertItemToTask = useMemo(() => {
		const itemPopup = {
			key: `convert-item-${item?._id}`,
			label: item?.title,
			icon: <FaRegRectangleList size={"16px"} />,
			content: (
				<div className="mb-3 px-1 flex flex-col gap-2 w-full">
					<p className="text-xs text-task-title font-semibold">
						Chuyển '{item?.title}' thành công việc {status}!
					</p>
					<Button
						fullWidth
						variant="light"
						className={`bg-red-500 relative data-[hover=true]:bg-red-400 items-center rounded-sm py-1 px-2`}
						onClick={handleConvertItemChecklistToTask}
						isLoading={isLoading}
					>
						<span className="font-semibold text-white">Xác nhận</span>
					</Button>
				</div>
			),
			error: false,
		};

		return (
			<PopoverAddTask
				itemKey={`convert-item-${item?._id}`}
				key={`convert-item-${item?._id}`}
				item={itemPopup}
				trigger={
					<Button
						radius="full"
						variant="bordered"
						className={`min-h-max bg-white h-max min-w-max w-max items-center p-[6px] hover:bg-default-200`}
					>
						<Tooltip
								placemen="top"
								motionProps={{ variants: {} }}
								classNames={{
									content: "p-0 rounded-md",
								}}
								content={
									<span
										className={`rounded-md py-1 px-2 text-wrap text-left text-xs max-w-max bg-slate-600 text-white font-normal overflow-hidden align-middle`}
									>
										Chuyển '{item?.title}' thành công việc {status}!
									</span>
								}
							>
								<p><GoTasklist className="text-base" /></p>
							</Tooltip>
					</Button>
				}
			/>
		)
	}, [item, status]);

	return (
		<div className="relative">
			<div className={`absolute left-2 ${visible ? "top-2" : "top-1"} p-1`}>
				<Checkbox
					size="md"
					isSelected={item?.isChecked}
					onValueChange={handleUpdateIsChecked}
					classNames={{
						base: "p-0",
					}}
				/>
			</div>

			<div className="ml-12">
				{visible ? (
					<div className="my-3 max-w-item-checklist">
						<Textarea
							minRows={1}
							labelPlacement="outside"
							placeholder="Thêm chỉ mục..."
							classNames={{
								base: "rounded-sm",
								inputWrapper: `rounded-sm !min-h-7 shadow-none p-0 bg-white data-[hover=true]:bg-white bg-white outline-2 group-data-[focus=true]:bg-white ${
									visible ? "outline-primary-400" : ""
								}`,
								input: `px-2 py-0 text-sm !text-task-title font-medium resize-none overflow-hidden break-words`,
							}}
							value={title}
							onValueChange={handleChangeTitleItem}
							// onKeyDown={onKeyDown}
						/>
						<div className="mt-3 flex flex-row gap-2 items-center justify-start">
							<Button
								color="primary"
								variant="solid"
								isLoading={isLoading}
								onPress={handleUpdateTitleChecklist}
								className="font-medium w-max px-3 min-w-0 min-h-0 h-8 rounded-md"
							>
								Lưu
							</Button>
							<Button
								color="primary"
								variant="solid"
								onPress={() => setVisible(false)}
								className="font-medium w-max px-[6px] min-w-0 min-h-0 rounded-md h-8 bg-transparent text-task-title hover:bg-slate-200"
							>
								<MdOutlineClose className="text-xl text-task-title" />
							</Button>
						</div>
					</div>
				) : (
					<div className="flex flex-row justify-between items-center flex-nowrap py-1 gap-2 group/trash hover:bg-btn-detail relative">
						<Button
							variant="light"
							fullWidth
							className={`bg-transparent h-8 relative data-[hover=true]:bg-transparent items-center rounded-md justify-between py-1 px-2`}
							onClick={handleSetVisible}
						>
							<span
								className={`font-semibold text-[#505f79] ${
									item?.isChecked
										? "line-through text-isChecked"
										: "no-underline"
								}`}
							>
								{title}
							</span>
						</Button>

						<div className="flex gap-2 absolute right-2 invisible group-hover/trash:visible">
							{/* Update Time */}
							<PopupAddTimeChecklistItem
								checklist={checklist}
								item={item}
							/>

							{/* Convert To Task */}
							{popoverConvertItemToTask}

							{/* Delete */}
							{popoverDeleteItem}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default memo(ItemChecklist);
