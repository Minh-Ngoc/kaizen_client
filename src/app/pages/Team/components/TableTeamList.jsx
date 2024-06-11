import {useCallback, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {GetPagingProject, DeleteProject} from "_redux/slice/projectSlice";
import {setModal, onClose} from "_redux/slice/modalSlice";
import {
	Avatar,
	AvatarGroup,
	Button,
	Chip,
	Tooltip,
	useDisclosure,
	User,
} from "@nextui-org/react";
import {projectStatus, URL_IMAGE} from "_constants";

import TableNextUI from "app/components/TableNextUI";
import {GetPagingTeam} from "../../../../_redux/slice/teamSlice";
import moment from "moment";
import {FaRegTrashCan} from "react-icons/fa6";

import {LiaEditSolid} from "react-icons/lia";
import ModalTeam from "./ModalTeam";
import ModalDeleteMutiOrOne from "../../../components/Modal/ModalDelete";
import {deletesTeam} from "../../../../services/api.service";

// const PAGE_SIZE = 10;

function TableTeamList({
	isOpenAddEdit,
	onOpenAddEdit,
	onCloseAddEdit,
	onOpenChangeAddEdit,
	onGetPaging,
	isOpenModalDelete,
	setIsOpenModalDelete,
	itemId,
	setItemId,
}) {
	const dispatch = useDispatch();
	const [listIdSelected, setListIdSelected] = useState([]);

	const [pageIndex, setPageIndex] = useState(1);
	const [pageSize, setPageSize] = useState(new Set(["10"]));
	const {data, loading, totalDoc, totalPage} = useSelector(
		(state) => state?.team || []
	);
	const [pgSize] = [...pageSize];
	useEffect(() => {
		onGetPaging({pageIndex, pgSize});
	}, [pageIndex, pgSize]);

	const columns = [
		{name: "Tên đội", _id: "name"},
		{name: "Số lãnh đạo", _id: "leaders"},
		{name: "Ngày tạo", _id: "createdAt"},
		{name: "Hành động", _id: "actions"},
	];

	const handleEdit = (item) => {
		setItemId(item?._id);
		onOpenAddEdit();
	};
	const renderCell = useCallback((item, columnKey) => {
		const cellValue = item[columnKey];

		switch (columnKey) {
			case "name":
				return (
					<div className="text-white text-xs text-center">{cellValue}</div>
				);
			case "leaders":
				return (
					<div className="flex items-center justify-center">
						<AvatarGroup isBordered max={3}>
							{cellValue?.map((item, index) => (
								<Tooltip
									key={index}
									showArrow={true}
									content={`${item?.firstName} ${item?.lastName}`}
									classNames={{
										base: " text-nowrap",
										content: "text-black ",
									}}
									disableAnimation={true}
								>
									<Avatar
										src={item?.avatar ? `${URL_IMAGE}/${item?.avatar}` : ""}
									/>
								</Tooltip>
							))}
						</AvatarGroup>
					</div>
				);
			case "createdAt":
				return (
					<div className="text-white text-xs text-center">
						{moment(cellValue).format("DD/MM/YYYY")}
					</div>
				);
			case "actions":
				return (
					<div className="flex gap-2">
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
								onClick={() => handleEdit(item)}
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
								onClick={() => {
									setIsOpenModalDelete(true);
									setListIdSelected([item?._id]);
								}}
							>
								<FaRegTrashCan className="min-w-max w-4 h-4 text-white" />
							</Button>
						</Tooltip>
					</div>
				);

			// default:
			// 	return (
			// 		<div className="text-white text-xs text-center">{cellValue}</div>
			// 	);
		}
	}, []);

	const handleChangePaging = (value) => {
		setPageIndex(value);
	};

	const handlePageSizeChange = async (newPageSize) => {
		setPageSize(newPageSize);
	};
	const handleOnDelete = () => {
		let tempPageIndex = pageIndex;
		const checkPage = (totalDoc - listIdSelected?.length) / pgSize;
		if (checkPage <= tempPageIndex - 1) tempPageIndex -= 1;
		if (tempPageIndex <= 0) tempPageIndex = 1;
		dispatch(
			GetPagingTeam({
				pageIndex: tempPageIndex,
				pageSize: pgSize,
				search: "",
			})
		);

		setListIdSelected([]);
		setPageIndex(tempPageIndex);
	};
	return (
		<>
			<div className="bg-card-project shadow-wrapper p-5 rounded-xl">
				<TableNextUI
					columns={columns}
					renderCell={renderCell}
					data={data}
					// isLoading={isLoading}
					total={totalDoc || 1}
					page={pageIndex} // Pass down the page prop
					onPageChange={handleChangePaging} // Pass down the function
					pageSize={pageSize}
					onPageSizeChange={handlePageSizeChange}
				/>
			</div>
			{isOpenAddEdit && (
				<ModalTeam
					itemId={itemId}
					isOpen={isOpenAddEdit}
					onClose={onCloseAddEdit}
					onOpenChange={onOpenChangeAddEdit}
					onGetPaging={({pageIndex, pgSize}) => {
						dispatch(GetPagingTeam({pageIndex, pgSize}));
					}}
				/>
			)}

			<ModalDeleteMutiOrOne
				isOpen={isOpenModalDelete}
				onClose={() => {
					setIsOpenModalDelete(false);
					setListIdSelected([]);
				}}
				onComplete={handleOnDelete}
				ids={listIdSelected?.join("-")}
				headerMsg={`Xác nhận`}
				funcDelete={deletesTeam}
				bodyMsg={
					listIdSelected?.length !== 1
						? "Bạn có chắc chắn muốn xóa các nhóm đã chọn?"
						: "Bạn có chắc chắn muốn xóa nhóm này?"
				}
			/>
		</>
	);
}

export default TableTeamList;
