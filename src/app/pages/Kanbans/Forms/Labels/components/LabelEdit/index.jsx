import { useState } from "react";
import { Input, Divider, Button, Tooltip } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { labelColors } from "_constants";
import { setContentItem } from "_redux/slice/sidebarTaskSlice";
import { setLabelsOfTask, setTask } from "_redux/slice/taskSlice";
import NotifyMessage from "_utils/notify";
import { deleteLabelById, updateLabel } from "services/api.service";
import Labels from "../..";

function LabelEdit({ label, taskId }) {
	const dispatch = useDispatch();
	const { task } = useSelector((state) => state.tasks);

	const [title, setTitle] = useState(label?.title);
	const [isLoading, setIsLoading] = useState(false);

	const [colorSelected, setColorSelected] = useState(label);

	const handleSelectedColor = (color) => {
		setColorSelected(color);
	};

	const handleUpdateLabel = async () => {
		try {
			setIsLoading(true);

			const { data } = await updateLabel(label?._id, {
				title,
				taskId,
				colorCode: colorSelected?.colorCode,
			});

			if (data.status === 1) {
				const newLabels = task?.labels?.map((l) => {
					if (l._id === label?._id) {
						return {
							...l,
							title,
							colorCode: colorSelected?.colorCode,
						};
					}

					return l;
				});

				dispatch(
					setLabelsOfTask({ taskId: task?._id, labels: newLabels })
				);

				dispatch(setTask({ ...task, labels: newLabels }));

				handleClickBack();
			}
		} catch (error) {
			console.log("error: ", error);
			NotifyMessage("Cập nhật nhãn thất bại. Vui lòng thử lại!", "error");
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteLabel = async () => {
		try {
			setIsLoading(true);

			const { data } = await deleteLabelById(label?._id);

			if (data.status === 1) {
				const newLabels = task?.labels?.filter(
					(l) => l?._id !== label?._id
				);

				dispatch(
					setLabelsOfTask({ taskId: task?._id, labels: newLabels })
				);
				dispatch(setTask({ ...task, labels: newLabels }));
			}
		} catch (error) {
			console.log("error: ", error);
			NotifyMessage("Xóa nhãn thất bại. Vui lòng thử lại!", "error");
		} finally {
			setIsLoading(false);
		}
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

	//Stop error resizeObserver
	const debounce = (callback) => {
		const DELAY = 50;
		let tid;
		return function (...args) {
			const ctx = self;
			tid && clearTimeout(tid);
			tid = setTimeout(() => {
				callback.apply(ctx, args);
			}, DELAY);
		};
	};

	const _ = window.ResizeObserver;
	window.ResizeObserver = class ResizeObserver extends _ {
		constructor(callback) {
			callback = debounce(callback, 20);
			super(callback);
		}
	};

	return (
		<div className="mt-2 px-1 flex flex-col gap-2 w-full">
			<div className="py-6 px-8 bg-[#f7f8f9f1] shadow-[rgba(0,_0,_0,_0.05)_0px_0px_0px_1px,_rgb(209,_213,_219)_0px_0px_0px_1px_inset]">
				<span
					className={`inline-block cursor-pointer h-8 w-full min-w-12 max-w-full leading-8 rounded-sm ${colorSelected?.colorCode}`}
				/>
			</div>

			<div className="mt-3">
				<p className="text-xs text-task-title font-semibold mb-1">
					Tiêu đề:
				</p>

				<Input
					size="sm"
					variant="bordered"
					placeholder={`Nhập tiêu đề nhãn...`}
					classNames={{
						inputWrapper:
							"rounded-sm py-2 !h-auto data-[hover=true]:border-primary-400 group-data-[focus=true]:border-primary-400 group-data-[focus=true]:border-2 group-data-[focus=true]:border-primary-400",
						label: "hidden",
						input: "text-sm text-task-title",
					}}
					value={title}
					onChange={(event) => setTitle(event?.target?.value)}
				/>
			</div>

			<div className="mt-3 mb-1">
				<p className="text-xs text-task-title font-semibold mb-1">
					Chọn màu cho tiêu đề:
				</p>

				<div className="grid grid-cols-5 gap-1">
					{labelColors?.map((item, index) => (
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
									{item.colorLabel}
								</span>
							}
						>
							<div
								className={`p-[2px] ${
									colorSelected?.colorLabel === item?.colorLabel
										? "outline outline-2 outline-primary-400 rounded-sm"
										: ""
								}`}
								onClick={() => handleSelectedColor(item)}
							>
								<span
									className={`block cursor-pointer h-8 w-full leading-8 rounded-sm ${item?.colorCode}`}
								/>
							</div>
						</Tooltip>
					))}
				</div>
			</div>

			<Divider />

			<div className="flex justify-end gap-2">
				<Button
					variant="solid"
					color="primary"
					className={`min-h-max h-max min-w-max w-max items-center rounded-sm py-1 px-4`}
					isLoading={isLoading}
					onPress={handleUpdateLabel}
				>
					<span className="font-semibold text-white">Lưu</span>
				</Button>
				<Button
					variant="solid"
					color="danger"
					className={`min-h-max h-max min-w-max w-max items-center rounded-sm py-1 px-4`}
					onPress={handleDeleteLabel}
				>
					<span className="font-semibold text-white">Xóa</span>
				</Button>
			</div>
		</div>
	);
}

export default LabelEdit;
