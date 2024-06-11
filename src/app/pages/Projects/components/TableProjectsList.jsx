import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetPagingProject, DeleteProject } from "_redux/slice/projectSlice";
import { setModal, onClose } from "_redux/slice/modalSlice";
import {
	AvatarGroup,
	Button,
	Chip,
	Tooltip,
	User,
} from "@nextui-org/react";
import { projectStatus, URL_IMAGE } from "_constants";
import { formatDate } from "_utils";
import { LiaEditSolid } from "react-icons/lia";
import { FaRegEye, FaRegTrashCan } from "react-icons/fa6";
import { navigates } from "_constants";
import FormEditProject from "./FormEditProject";
import TableNextUI from "app/components/TableNextUI";

// const PAGE_SIZE = 10;

function TableProjectsList() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [pageSize, setPageSize] = useState(new Set(["10"]));
	// const [selectedKey, setSelectedKey] = useState(new Set([]));

	const {
		projects: projectList,
		isLoading,
		total,
	} = useSelector((state) => state.projects);
	const [pageIndex, setPageIndex] = useState(1);

	useEffect(() => {
		const [pgSize] = [...pageSize];
		dispatch(GetPagingProject({ pageSize: pgSize, pageIndex: 1 }));
	}, []);

	const columns = [
		{ name: "Dự án", _id: "name" },
		{ name: "Team", _id: "team" },
		{ name: "Trạng thái", _id: "status" },
		{ name: "Người thực hiện", _id: "performers" },
		{ name: "Ngày bắt đầu", _id: "dateStart", sortable: true },
		{ name: "Ngày kết thúc", _id: "dateEnd", sortable: true },
		{ name: "Công việc", _id: "tasks", sortable: true },
		{ name: "Hành động", _id: "actions" },
	];

	const findStatusProject = (status) =>
		projectStatus?.find((item) => item?.value === status);

	const renderUsersValue = (users) => {
		// eslint-disable-next-line no-extra-boolean-cast
		if (!!users?.length)
			return (
				<AvatarGroup max={6} className="gap-1">
					{users?.map((user, index) => (
						<Tooltip
							key={index}
							placemen="top"
							motionProps={{ variants: {} }}
							classNames={{
								content: "p-0 rounded-md",
							}}
							content={
								<span
									className={`rounded-md py-1 px-2 text-wrap text-left text-sm max-w-56 bg-slate-600 text-white font-normal overflow-hidden align-middle`}
								>
									{user?.name || user?.username}
								</span>
							}
						>
							<User
								name={`${user?.name || user?.username}`}
								description={!user?.name ? user?.username : ""}
								avatarProps={{
									src: user?.avatar
										? `${URL_IMAGE}/${user?.avatar}`
										: "",
								}}
								classNames={{
									base: "hover:opacity-50 cursor-pointer",
									description: "hidden",
									name: "hidden",
								}}
							/>
						</Tooltip>
					))}
				</AvatarGroup>
			);

		return <p className="text-white text-sm text-left">(Trống)</p>;
	};

	const navigateToProjectDetail = (id) => {
		navigate(`${navigates.kanbans}/${id}`);
	};

	const handleConfirmDelete = (project) => {
		dispatch(
			setModal({
				isOpen: true,
				title: "Xóa dự án",
				body: `Bạn chắc chắn muốn xóa ${project?.name}!`,
				bg: "bg-modal",
				openConfirm: true,
				openCancel: true,
				onConfirm: () => {
					dispatch(DeleteProject(project?._id));
					dispatch(onClose());
				},
				isLoading: isLoading,
				header: "",
				hideCloseButton: false,
				classNames: "",
				backdrop: "opaque",
				motionProps: "",
			})
		);
	};

	const handleConfirmEdit = (project) => {
		dispatch(
			setModal({
				isOpen: true,
				title: (
					<div className="flex items-center gap-2">
						<p className="text-black">Chỉnh sửa dự án</p>
						<Chip color="primary" radius="sm" variant="flat">
							{project?.name}
						</Chip>
					</div>
				),
				body: <FormEditProject project={project} />,
				isDismissable: true,
				openConfirm: false,
				openCancel: false,
				bg: "bg-white",
				header: "",
				hideCloseButton: false,
				classNames: "",
				backdrop: "opaque",
				motionProps: "",
			})
		);
	};

	const renderCell = useCallback((item, columnKey) => {
		const cellValue = item[columnKey];

		switch (columnKey) {
			case "team":
				return (
					<div className="text-white text-sm text-center">
						{cellValue?.map((item) => item?.name).join(", ")}
					</div>
				);

			case "status":
				return (
					<Chip
						variant="solid"
						radius="sm"
						color={findStatusProject(cellValue)?.color}
					>
						{findStatusProject(cellValue)?.label}
					</Chip>
				);

			case "performers":
				return renderUsersValue(cellValue);

			case "dateStart":
				return (
					<div className="text-white text-sm text-center">
						{formatDate(cellValue)}
					</div>
				);

			case "dateEnd":
				return (
					<div className="text-white text-sm text-center">
						{formatDate(cellValue)}
					</div>
				);

			case "actions":
				return (
					<div className="flex gap-2">
						{/* Detail */}
						<Tooltip
							color={"warning"}
							content={"Xem chi tiết"}
							className="capitalize"
							disableAnimation={true}
						>
							<Button
								variant="solid"
								radius="full"
								color="warning"
								className="min-w-0 w-8 p-1 h-auto"
								onClick={() => navigateToProjectDetail(item?._id)}
							>
								<FaRegEye className="min-w-max text-base w-4 h-4 text-white" />
							</Button>
						</Tooltip>

						{/* Edit */}
						<Tooltip
							color={"primary"}
							content={"Chỉnh sửa"}
							className="capitalize"
							disableAnimation={true}
						>
							<Button
								variant="solid"
								radius="full"
								color="primary"
								className="min-w-0 w-8 p-1 h-auto"
								onClick={() => handleConfirmEdit(item)}
							>
								<LiaEditSolid className="min-w-max text-base w-4 h-4 text-white" />
							</Button>
						</Tooltip>

						{/* Delete */}
						<Tooltip
							color={"danger"}
							content={"Xóa"}
							className="capitalize"
							disableAnimation={true}
						>
							<Button
								variant="solid"
								radius="full"
								color="danger"
								className="min-w-0 w-8 p-2 h-auto"
								onClick={() => handleConfirmDelete(item)}
							>
								<FaRegTrashCan className="min-w-max w-4 h-4 text-white" />
							</Button>
						</Tooltip>
					</div>
				);

			default:
				return (
					<div className="text-white text-sm text-center">
						{cellValue}
					</div>
				);
		}
	}, []);

	const handleChangePaging = (value) => {
		setPageIndex(value);

		dispatch(
			GetPagingProject({
				pageSize: value,
				pageIndex: String([...pageSize][0]),
			})
		);
	};

	const handlePageSizeChange = async (newPageSize) => {
		setPageSize(newPageSize);

		dispatch(
			GetPagingProject({
				pageSize: String([...newPageSize][0]),
				pageIndex,
			})
		);
	};

	return (
		<div className="bg-card-project shadow-wrapper p-5 rounded-xl">
			<TableNextUI
				columns={columns}
				renderCell={renderCell}
				data={projectList}
				isLoading={isLoading}
				total={total}
				page={pageIndex} // Pass down the page prop
				onPageChange={handleChangePaging} // Pass down the function
				pageSize={pageSize}
				onPageSizeChange={handlePageSizeChange}
				// selectionMode="multiple"
				// selectedKeys={selectedKey}
				// onSelectedChange={setSelectedKey}
			/>
		</div>
	);
}

export default TableProjectsList;
