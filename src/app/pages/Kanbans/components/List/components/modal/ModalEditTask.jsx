import {Modal, ModalBody, ModalContent} from "@nextui-org/react";

import {GetPagingMyTask} from "_redux/slice/taskSlice";
import TaskDetail from "app/pages/Kanbans/components/TaskDetail";
import React, { useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";

const ModalEditTask = ({isOpen, onClose}) => {
	const {task} = useSelector((state) => state?.tasks || []);

	const handleCloseModal = () => {
		onClose();
	};

	useEffect(() => {
		if(!task || !Object.keys(task)?.length) {
			onClose();
		}
	}, [task])

	return (
		<Modal
			backdrop="opaque"
			isOpen={isOpen}
			onClose={handleCloseModal}
			isDismissable={false}
			classNames={{
				// backdrop: "z-[51]",
				wrapper: "w-full overflow-hidden",
				base: `max-h-[90vh] !shadow-card-project min-w-[50%]`,
				body: "overflow-y-auto",
				closeButton: "right-5 z-10 text-lg",
			}}
		>
			<ModalContent>
				<ModalBody>
					<TaskDetail task={task} />
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default ModalEditTask;
