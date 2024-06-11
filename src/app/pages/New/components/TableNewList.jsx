import {useCallback, useEffect, useState} from "react";

import {useDispatch, useSelector} from "react-redux";

import {Avatar, Button, Chip, Tooltip, User} from "@nextui-org/react";
import {URL_IMAGE} from "_constants";

import TableNextUI from "app/components/TableNextUI";

import moment from "moment";
import {FaRegTrashCan} from "react-icons/fa6";

import {LiaEditSolid} from "react-icons/lia";

import ModalDeleteMutiOrOne from "../../../components/Modal/ModalDelete";
import {deletesNew} from "../../../../services/api.service";
import ModalNew from "./ModalNew";
import {GetPagingNew} from "../../../../_redux/slice/newSlice";

// const PAGE_SIZE = 10;

function TableNewList({
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
		(state) => state?.new || []
	);
	console.log("data", data, totalDoc);
	const [pgSize] = [...pageSize];
	useEffect(() => {
		onGetPaging({pageIndex, pgSize});
	}, [pageIndex, pgSize]);

	const columns = [
		{name: "Tiêu đề", _id: "title"},
		{name: "Ảnh đại diện", _id: "thumbnail"},
		{name: "Mô tả", _id: "description"},
		{name: "Nội dung", _id: "content"},
		{name: "Trạng thái", _id: "status"},
		{name: "Người tạo", _id: "user"},
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
			case "title":
				return (
					<div className="text-white text-xs text-center">{cellValue}</div>
				);
			case "thumbnail":
				return (
					<div className="flex items-center justify-center">
						<Avatar isBordered src={`${URL_IMAGE}/${cellValue}`} />
					</div>
				);
			case "description":
				return (
					<p
						className="line-clamp-2 text-white flex items-center justify-center"
						dangerouslySetInnerHTML={{__html: cellValue}}
					/>
				);
			case "content":
				return (
					<p
						className="line-clamp-2 text-white flex items-center justify-center"
						dangerouslySetInnerHTML={{__html: cellValue}}
					/>
				);
			case "status":
				return (
					<div className="text-white flex items-center justify-center">
						<Chip
							color={
								cellValue === "pending"
									? "warning"
									: cellValue === "approved"
									? "success"
									: "danger"
							}
						>
							{cellValue === "pending"
								? "Chờ duyệt"
								: cellValue === "approved"
								? "Đã duyệt"
								: "Từ chối"}
						</Chip>
					</div>
				);
			case "user":
				return (
					<p className="text-white flex items-center justify-center">
						{cellValue?.username}
					</p>
				);
			case "createdAt":
				return (
					<div className="text-white text-xs text-center flex items-center justify-center">
						{moment(cellValue).format("DD/MM/YYYY")}
					</div>
				);
			case "actions":
				return (
					<div className="flex gap-2 justify-center">
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
			GetPagingNew({
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
				<ModalNew
					itemId={itemId}
					isOpen={isOpenAddEdit}
					onClose={onCloseAddEdit}
					onOpenChange={onOpenChangeAddEdit}
					onGetPaging={({pageIndex, pgSize}) => {
						dispatch(GetPagingNew({pageIndex, pgSize}));
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
				funcDelete={deletesNew}
				bodyMsg={
					listIdSelected?.length !== 1
						? "Bạn có chắc chắn muốn xóa các nhóm đã chọn?"
						: "Bạn có chắc chắn muốn xóa nhóm này?"
				}
			/>
		</>
	);
}

export default TableNewList;
