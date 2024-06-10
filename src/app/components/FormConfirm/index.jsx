import { MdOutlineClose } from "react-icons/md";
import { Textarea, Button } from "@nextui-org/react";
import { useEffect, useRef } from "react";

const FormConfirm = ({
	visible,
	value,
	isLoading,
	isDismissable = true,
	onChange,
	form,
	textConfirm,
	openConfirm = true,
	textCancel,
	openCancel = true,
	onConfirm = () => {},
	onClose = () => {},
	...rest
}) => {
	const ref = useRef(null);
	const inputRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (ref.current && !ref.current.contains(event.target)) {
				onClose();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [ref]);

	useEffect(() => {
		if (visible && inputRef.current) {
			inputRef.current.focus();
		}
	}, [visible]);

	return (
		<div className={`flex flex-col gap-y-2`} ref={isDismissable ? ref : null}>
			{form ? (
				form
			) : (
				<Textarea
					ref={inputRef}
					value={value}
					minRows={1}
					labelPlacement="outside"
					placeholder="Nhập tên công việc..."
					radius="sm"
					classNames={{
						base: "shadow-input rounded-md",
						inputWrapper: `p-0 bg-white data-[hover=true]:bg-white group-data-[focus=true]:bg-white`,
						input:
							"px-2 py-2 text-black resize-none overflow-hidden break-words text-area-input",
					}}
					cacheMeasurements
					onValueChange={onChange}
					{...rest}
				/>
			)}

			{(openConfirm || openCancel) && (
				<div className={`flex flex-row gap-2 items-center justify-start`}>
					{openConfirm && (
						<Button
							color="primary"
							variant="solid"
							onPress={onConfirm}
							isLoading={isLoading}
							className="w-max px-3 min-w-0 min-h-0 h-8 rounded-md"
						>
							{textConfirm || "Tạo công việc"}
						</Button>
					)}

					{openCancel && (
						<Button
							color="primary"
							variant="solid"
							onPress={onClose}
							className="w-max p-1 mt-1 min-w-0 min-h-0 rounded-md h-8 bg-transparent hover:bg-slate-200"
						>
							{textCancel || (
								<MdOutlineClose className="text-xl text-task-title" />
							)}
						</Button>
					)}
				</div>
			)}
		</div>
	);
};

export default FormConfirm;
