import {
	Modal as NextUIModal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
} from "@nextui-org/react";
import { onClose } from "_redux/slice/modalSlice";
import { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

function Modal() {
	const dispatch = useDispatch();
	const {
		isOpen,
		title,
		body,
		textConfirm,
		textCancel,
		onConfirm,
		onCancel,
		openConfirm,
		openCancel,
		isLoading,
		isDismissable,
		maxWidth,
		bg,
		header,
		hideCloseButton,
		classNames,
		backdrop,
		isFocused,
		motionProps,
	} = useSelector((state) => state.modal);

	const handleCloseModal = useCallback(() => {
		if (!isFocused) {
			dispatch(onClose());
		}
	}, [isFocused]);

	return (
		<NextUIModal
			backdrop={backdrop}
			isOpen={isOpen}
			onClose={handleCloseModal}
			isDismissable={isDismissable}
			motionProps={motionProps && motionProps}
			classNames={
				classNames
					? classNames
					: {
							// backdrop: "z-[51]",
							wrapper: "w-full overflow-hidden items-center",
							base: `max-h-[90vh] !shadow-card-project min-w-[50%] ${bg} ${maxWidth}`,
							body: "overflow-y-auto text-white",
							closeButton: "right-5 z-10 text-lg",
				}
			}
			hideCloseButton={hideCloseButton}
		>
			<ModalContent>
				{(onClose) => (
					<>
						{header
							? header
							: title && (
									<ModalHeader className="flex flex-col gap-1 uppercase text-white">
										{title}
									</ModalHeader>
						)}
						<ModalBody>{body}</ModalBody>
						{(openCancel || openConfirm) && (
							<ModalFooter>
								{openCancel && (
									<Button
										radius="sm"
										color="danger"
										variant="solid"
										className="bg-danger-400"
										onPress={() => {
											onCancel && onCancel();
											onClose();
										}}
									>
										{textCancel}
									</Button>
								)}
								{openConfirm && (
									<Button
										radius="sm"
										color="primary"
										onPress={() => onConfirm(onClose)}
										isLoading={isLoading}
									>
										{textConfirm}
									</Button>
								)}
							</ModalFooter>
						)}
					</>
				)}
			</ModalContent>
		</NextUIModal>
	);
}

export default memo(Modal);
