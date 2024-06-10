import PropTypes from "prop-types";
import {
	Modal as NextUIModal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
} from "@nextui-org/react";
import {useState} from "react";
import NotifyMessage from "_utils/notify";
function ModalDeleteMutiOrOne({
	isOpen,
	onClose,
	onComplete,
	ids,
	funcDelete,
	headerMsg,
	bodyMsg,
}) {
	const [isLoading, setIsLoading] = useState(false);
	const handleOnDelete = async (e) => {
		e.preventDefault();
		try {
			setIsLoading(true);
			await funcDelete(ids);
			NotifyMessage("Xóa thành công", "success");
			onComplete();
			onClose();
		} catch (error) {
			console.log(error);
			NotifyMessage("Lỗi vui lòng thử lại sau", "error");
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<>
			<NextUIModal
				backdrop="opaque"
				isOpen={isOpen}
				onClose={!isLoading ? onClose : () => {}}
				motionProps={{
					variants: {
						enter: {
							y: 0,
							opacity: 1,
							transition: {
								duration: 0.3,
								ease: "easeOut",
							},
						},
						exit: {
							y: -20,
							opacity: 0,
							transition: {
								duration: 0.2,
								ease: "easeIn",
							},
						},
					},
				}}
				classNames={{
					backdrop: "z-[51]",
					wrapper: "z-[52] w-full",
					base: `] !shadow-card-project min-w-[40%] `,
					closeButton: "right-5 z-10 text-lg",
					body: "overflow-auto",
				}}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<form onSubmit={handleOnDelete}>
								<ModalHeader className="flex flex-col gap-1 uppercase text-black">
									{headerMsg}
								</ModalHeader>
								<ModalBody>
									<div className="flex flex-col justify-start items-start w-full gap-2 max-h-[90vh]">
										<p>{bodyMsg}</p>
									</div>
								</ModalBody>
								<ModalFooter>
									<Button
										type="submit"
										radius="sm"
										color="primary"
										isDisabled={isLoading}
										isLoading={isLoading}
									>
										Xác nhận
									</Button>
									<Button
										radius="sm"
										color="danger"
										variant="solid"
										className="bg-danger-400"
										onPress={onClose}
										isDisabled={isLoading}
									>
										Hủy
									</Button>
								</ModalFooter>
							</form>
						</>
					)}
				</ModalContent>
			</NextUIModal>
		</>
	);
}

export default ModalDeleteMutiOrOne;
