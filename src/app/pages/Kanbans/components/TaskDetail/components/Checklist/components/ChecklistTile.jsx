import { useMemo, useState } from "react";
import { Button, Textarea, Tooltip } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineClose } from "react-icons/md";
import { setTask, setCheckListTitle } from "_redux/slice/taskSlice";
import { deleteChecklistById, updateChecklist } from "services/api.service";
import NotifyMessage from "_utils/notify";
import { PiTrashLight } from "react-icons/pi";
import PopupAddTimeChecklist from "./PopupAddTimeChecklist";
import { FaRegRectangleList } from "react-icons/fa6";
import PopoverAddTask from "app/pages/Kanbans/components/PopoverAddTask";

function ChecklistTile({ checklist }) {
    const dispatch = useDispatch();
    const { task } = useSelector(state => state.tasks);
	const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const title = useMemo(() => {
        const getChecklist = task?.checklist?.find(el => el?._id === checklist?._id);

        return getChecklist.title;
    }, [task]);


	const handleChangeInput = (value) => {
        const newCheckList = task?.checklist?.map((ch) => {
            if (ch._id === checklist?._id) {
                return {
                    ...ch,
                    title: value,
                };
            }

            return ch;
        });

		dispatch(setCheckListTitle({ taskId: task?._id, checklist: newCheckList }));
		dispatch(setTask({ ...task, checklist: newCheckList }));
	};

    const handleUpdateTitleChecklist = async () => {
		if (!title) {
			return setVisible(false);
		}
		
		try {
			setIsLoading(true);

			const { data } = await updateChecklist(checklist?._id, {
				title,
				taskId: task?._id,
			});

			if (data.status === 1) {
				const newChecklist = task?.checklist?.map((ck) => {
					if (ck._id === checklist?._id) {
						return { ...ck, title };
					}

					return ck;
				});

				dispatch(
					setCheckListTitle({ taskId: task?._id, checklist: newChecklist })
				);

				dispatch(setTask({ ...task, checklist: newChecklist }));

				setVisible(false);
			}
		} catch (error) {
			console.log("error: ", error);
			NotifyMessage("Cập nhật tên việc làm thất bại. Vui lòng thử lại!", "error");
		} finally {
			setIsLoading(false);
		}
	};

    const handleDeleteChecklist = async () => {
		try {
			setIsLoading(true);

			const { data } = await deleteChecklistById(checklist?._id);

			if (data.status === 1) {
				const newChecklist = task?.checklist?.filter((ck) => ck._id !== checklist?._id);

				dispatch(
					setCheckListTitle({ taskId: task?._id, checklist: newChecklist })
				);

				dispatch(setTask({ ...task, checklist: newChecklist }));
			}
		} catch (error) {
			console.log("error: ", error);
			NotifyMessage("Xóa việc làm thất bại. Vui lòng thử lại!", "error");
		} finally {
			setIsLoading(false);
		}
	};

    const onOpenVisible = () => {
        setVisible(true);
    }

    const onKeyDown = (event) => {
        if(event.key === "Enter") {
            // Ngăn không cho giá trị xuống dòng
            event.preventDefault();
			handleUpdateTitleChecklist();
        }
    }

	const popoverProject = useMemo(() => {
		const item = {
			key: `delete-checklist-${checklist?._id}`,
			label: checklist?.title,
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
						onClick={handleDeleteChecklist}
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
				itemKey={`delete-checklist-${checklist?._id}`}
				key={`delete-checklist-${checklist?._id}`}
				item={item}
				trigger={
					<Button
						radius="full"
						variant="bordered"
						className={`min-h-max h-max min-w-max w-max bg-white items-center p-[6px] hover:bg-default-200`}
					>
						<Tooltip
							placemen="top"
							motionProps={{variants: {}}}
							classNames={{
								content: "p-0 rounded-md",
							}}
							content={
								<span
									className={`rounded-md py-1 px-2 text-wrap text-left text-xs max-w-max bg-slate-600 text-white font-normal overflow-hidden align-middle`}
								>
									Xóa '{checklist?.title}'
								</span>
							}
						>
							<p><PiTrashLight className="text-lg" /></p>
						</Tooltip>
					</Button>
				}
			/>
		)
	}, [checklist]);

	return (
		<div className="relative flex-1">
			{/* <div className={`absolute left-0 ${visible ? "top-0" : "top-[2px]"} p-1`}>
				<FiCheckSquare className="text-xl text-task-icon" />
			</div> */}

			<div className={`${visible ? "block" : "flex"} items-center gap-2 justify-between`}>
				<Textarea
					minRows={1}
					labelPlacement="outside"
                    placeholder="Nhập tên việc cần làm..."
					classNames={{
						base: "rounded-sm mt-[2px]",
						inputWrapper: `rounded-sm !min-h-7 shadow-none p-0 bg-white data-[hover=true]:bg-white bg-white outline-2 group-data-[focus=true]:bg-white ${visible ? "outline-primary-400" : ""}`,
						input:
							"px-2 py-0 text-sm !text-task-title font-medium resize-none overflow-hidden break-words",
					}}
					value={title}
					onValueChange={handleChangeInput}
                    onKeyDown={onKeyDown}
					onClick={onOpenVisible}
				/>

				{visible ? (
					<div className="mt-3 flex flex-row gap-2 items-center justify-start">
						<Button
							color="primary"
							variant="solid"
                            isLoading={isLoading}
							onPress={handleUpdateTitleChecklist}
							className="w-max px-3 min-w-0 min-h-0 h-8 rounded-md"
						>
							Lưu
						</Button>
						<Button
							color="primary"
							variant="solid"
							onPress={() => setVisible(false)}
							className="w-max p-1 min-w-0 min-h-0 rounded-md h-8 bg-transparent hover:bg-slate-200"
						>
							<MdOutlineClose className="text-xl text-task-title" />
						</Button>
					</div>
				) : (
					<>
						{/* Time */}
						<PopupAddTimeChecklist checklist={checklist} />

						{popoverProject}
					</>
				)}
			</div>
		</div>
	);
}

export default ChecklistTile;
