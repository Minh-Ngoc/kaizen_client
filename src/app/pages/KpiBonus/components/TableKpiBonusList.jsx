import {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
	Avatar,
	AvatarGroup,
	Button,
	Chip,
	Tooltip,
	User,
} from "@nextui-org/react";

import TableNextUI from "app/components/TableNextUI";

import moment from "moment";
import {FaRegTrashCan} from "react-icons/fa6";

import {LiaEditSolid} from "react-icons/lia";

import ModalDeleteMutiOrOne from "../../../components/Modal/ModalDelete";
import {deletesKpiBonus} from "../../../../services/api.service";

import {GetPagingKpiBonus} from "../../../../_redux/slice/kpiBonusSlice";
import ModalKpiBonus from "./ModalKpiBonus";

// const PAGE_SIZE = 10;

function TableKpiBonusList({
	isOpenAddEdit,
	onOpenAddEdit,
	onCloseAddEdit,
	onOpenChangeAddEdit,
	isOpenModalDelete,
	setIsOpenModalDelete,
	itemId,
	setItemId,
	search,
	setListIds,
	listIds,
}) {
	const dispatch = useDispatch();
	const [selectedKeys, setSelectedKeys] = useState(new Set([]));
	const [pageIndex, setPageIndex] = useState(1);
	const [pageSize, setPageSize] = useState(new Set(["10"]));
	const {data, loading, totalDoc, totalPage} = useSelector(
		(state) => state?.kpiBonus || []
	);

	useEffect(() => {
		if (typeof selectedKeys === "string") {
			const ids = data?.map((item) => item?._id);
			setListIds([...ids]);
		} else {
			setListIds([...selectedKeys]);
		}
	}, [selectedKeys]);
	const [pgSize] = [...pageSize];
	useEffect(() => {
		handleGetPagination({pageIndex, pgSize});
	}, [pageIndex, pgSize, search]);
	const handleGetPagination = () => {
		dispatch(
			GetPagingKpiBonus({
				pageIndex: pageIndex || 1,
				pageSize: pgSize || 10,
				search: search || "",
			})
		);
	};
	const columns = [
		{name: "Tên kpi bonus", _id: "name", className: "w-1/3"},
		{name: "Ngày tạo", _id: "createdAt", className: "w-1/3"},
		{name: "Hành động", _id: "actions", className: "w-1/3"},
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
					<div className="text-white text-sm text-center">{cellValue}</div>
				);

			case "createdAt":
				return (
					<div className="text-white text-sm text-center">
						{moment(cellValue).format("DD/MM/YYYY")}
					</div>
				);
			case "actions":
				return (
					<div className="flex gap-2  justify-center">
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
								className="min-w-0 w-8 p-1 h-auto flex-shrink-0"
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
									setListIds([item?._id]);
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
		const checkPage = (totalDoc - listIds?.length) / pgSize;
		if (checkPage <= tempPageIndex - 1) tempPageIndex -= 1;
		if (tempPageIndex <= 0) tempPageIndex = 1;
		dispatch(
			GetPagingKpiBonus({
				pageIndex: tempPageIndex,
				pageSize: pgSize,
				search: "",
			})
		);

		setListIds([]);
		setPageIndex(tempPageIndex);
	};
	return (
		<>
			<div className="bg-card-project shadow-wrapper p-5 pb-10 rounded-xl">
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
					selectionMode="multiple"
					selectedKeys={selectedKeys}
					onSelectedChange={setSelectedKeys}
				/>
			</div>
			{isOpenAddEdit && (
				<ModalKpiBonus
					itemId={itemId}
					isOpen={isOpenAddEdit}
					onClose={onCloseAddEdit}
					onOpenChange={onOpenChangeAddEdit}
					onGetPaging={handleGetPagination}
				/>
			)}
			{isOpenModalDelete && (
				<ModalDeleteMutiOrOne
					isOpen={isOpenModalDelete}
					onClose={() => {
						setIsOpenModalDelete(false);
						setListIds([]);
						setSelectedKeys(new Set([]));
					}}
					onComplete={handleOnDelete}
					ids={listIds?.join("-")}
					headerMsg={`Xác nhận`}
					funcDelete={deletesKpiBonus}
					bodyMsg={
						listIds?.length !== 1
							? "Bạn có chắc chắn muốn xóa các Kpi Bonus đã chọn?"
							: "Bạn có chắc chắn muốn xóa Kpi Bonus này?"
					}
				/>
			)}
		</>
	);
}

export default TableKpiBonusList;
