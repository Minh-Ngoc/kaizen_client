// import {
// 	AlertDialog,
// 	AlertDialogBody,
// 	AlertDialogFooter,
// 	AlertDialogHeader,
// 	AlertDialogContent,
// 	AlertDialogOverlay,
// 	Button,
// } from "@chakra-ui/react";

import { useRef } from "react";

const ModalSingleDelete = ({ isOpen, onClose, onDelete }) => {
	const cancelRef = useRef();

	const handleDelete = async () => {
		try {
			await onDelete();
		} catch (error) {
			console.log("error: ", error);
		}
	};

	return <div>123</div>;
	return (
		<AlertDialog
			isOpen={isOpen}
			leastDestructiveRef={cancelRef}
			onClose={onClose}
		>
			<AlertDialogOverlay>
				<AlertDialogContent>
					<AlertDialogHeader fontSize="lg" fontWeight="bold">
						Bạn có chắc chắn?
					</AlertDialogHeader>

					<AlertDialogBody>
						Bạn có thực sự muốn xóa không? Quá trình này không thể
						hoàn tác
					</AlertDialogBody>

					<AlertDialogFooter>
						<Button ref={cancelRef} onClick={onClose}>
							Cancel
						</Button>
						<Button colorScheme="red" onClick={handleDelete} ml={3}>
							Delete
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialogOverlay>
		</AlertDialog>
	);
};

export default ModalSingleDelete;
