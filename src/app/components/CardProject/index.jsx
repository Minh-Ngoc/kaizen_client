import { PiArrowsLeftRightBold } from "react-icons/pi";
import { AvatarGroup, User, Tooltip, Chip, Divider } from "@nextui-org/react";
import { FaRegTrashCan } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { setModal } from "_redux/slice/modalSlice";
import { formatDate } from "_utils";
import { DeleteProject } from "_redux/slice/projectSlice";
import { onClose } from "_redux/slice/modalSlice";
import { LiaEditSolid } from "react-icons/lia";
import FormEditProject from "app/pages/Projects/components/FormEditProject";
import { URL_IMAGE } from "_constants";
import { projectStatus } from "_constants";

function CardProject({ project, ...props }) {
	const {
		_id,
		name,
		team,
		performers,
		status,
		dateStart,
		dateEnd,
		tasks,
	} = project;
	const dispatch = useDispatch();
	const { isLoading } = useSelector((state) => state.projects);

	const handleDeleteProject = async () => {
		try {
			dispatch(DeleteProject(_id));
			dispatch(onClose());
		} catch (error) {
			console.log("error: ", error);
		}
	};

	const handleConfirmDelete = (event) => {
		event.stopPropagation();

		dispatch(
			setModal({
				isOpen: true,
				title: "Xóa dự án",
				body: `Bạn chắc chắn muốn xóa ${name}!`,
				bg: "bg-modal",
				openConfirm: true,
				openCancel: true,
				onConfirm: handleDeleteProject,
				isLoading: isLoading,
				header: '',
				hideCloseButton: false,
				classNames: '',
				backdrop: 'opaque',
				motionProps: ""
			})
		);
	};

	const handleConfirmEdit = (event) => {
		event.stopPropagation();

		dispatch(
			setModal({
				isOpen: true,
				title: (
					<div className="flex items-center gap-2">
						<p className="text-black">Chỉnh sửa dự án</p>
						<Chip color="primary" radius="sm" variant="flat">
							{name}
						</Chip>
					</div>
				),
				body: <FormEditProject project={project} />,
				isDismissable: true,
				openConfirm: false,
				openCancel: false,
				bg: "bg-white",
				header: '',
				hideCloseButton: false,
				classNames: '',
				backdrop: 'opaque',
				motionProps: ""
			})
		);
	};

	const findStatusProject = projectStatus?.find(
		(item) => item?.value === status
	);

	return (
		<div
			className="select-none p-5 bg-card-project flex flex-col items-stretch rounded-2xl cursor-pointer hover:opacity-80 shadow-card-project"
			{...props}
		>
			{/* Card */}
			<div className="h-full">
				{/* Header */}
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-2">
						<div className="flex flex-col">
							{/* Project Name */}
							<p className="text-base text-white mb-2">
								{name}
							</p>
							

							{/* Project Status */}
							<Chip
								variant="solid"
								radius="sm"
								color={findStatusProject?.color}
							>
								{findStatusProject?.label}
							</Chip>
						</div>
					</div>

					<div className="flex mb-[8%]">
						{/* Button Edit */}
						<div
							className="p-2 rounded-full hover:bg-card-project hover:opacity-60"
							onClick={handleConfirmEdit}
						>
							<LiaEditSolid color="white" size={"18px"} />
						</div>

						{/* Button Delete */}
						<div
							className="p-2 rounded-full hover:bg-card-project hover:opacity-60"
							onClick={handleConfirmDelete}
						>
							<FaRegTrashCan color="white" size={"18px"} />
						</div>
					</div>
				</div>
				{/* Body */}
				<div className="flex flex-col">
					{/* Team */}
					<div className="flex gap-4 items-center py-2">
						<p className="text-white text-sm">
							Team:
						</p>
						<p className="text-white text-sm">
							{team?.map(item => item.name)?.join(', ')}
						</p>
					</div>

					{/* Perfomers */}
					<div className="flex gap-4 items-center py-2">
						<p className="text-white text-sm">
							Người thực hiện:
						</p>
						{!performers?.length ? (
							<p className="text-white text-sm">
								Chưa có người thực hiện
							</p>
						) : (
							<AvatarGroup max={6} className="gap-1">
								{performers?.map((user, index) => (
									<Tooltip
										key={index}
										placemen="top"
										motionProps={{ variants: {} }}
										classNames={{
											content: "p-0 rounded-md",
										}}
										content={
											<span
												className={`rounded-md py-1 px-2 text-wrap text-left text-xs max-w-56 bg-slate-600 text-white font-normal overflow-hidden align-middle`}
											>
												{user?.name || user?.username}
											</span>
										}
									>
										<User
											name={`${
												user?.name || user?.username
											}`}
											description={
												!user?.name
													? user?.username
													: ""
											}
											avatarProps={{
												src: user?.avatar
													? `${URL_IMAGE}/${user?.avatar}`
													: "",
											}}
											classNames={{
												base:
													"hover:opacity-50 cursor-pointer",
												description: "hidden",
												name: "hidden",
											}}
										/>
									</Tooltip>
								))}
							</AvatarGroup>
						)}
					</div>
				</div>
			</div>

			<Divider className="my-3 bg-gray-400" />

			{/* Footer */}
			<div className="flex justify-between items-center text-center">
				<div className="flex flex-col">
					<p className="text-white text-xs mb-[6px]">
						{tasks || 0}
					</p>
					<p className="text-gray-400 text-sm mb-[6px]">
						Công việc
					</p>
				</div>
				<div className="flex flex-col">
					<p className="text-white text-xs mb-[6px]">
						{formatDate(dateStart)}
					</p>
					<p className="text-gray-400 text-sm mb-[6px]">
						Ngày bắt đầu
					</p>
				</div>

				<PiArrowsLeftRightBold color="white" size="20px" />

				<div className="flex flex-col">
					<p className="text-white text-xs mb-[6px]">
						{formatDate(dateEnd)}
					</p>
					<p className="text-gray-400 text-sm mb-[6px]">
						Ngày hoàn thành
					</p>
				</div>
			</div>
		</div>
	);
}

export default CardProject;
