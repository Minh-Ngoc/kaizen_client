import {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button, Chip, Tooltip} from "@nextui-org/react";

import TableNextUI from "app/components/TableNextUI";

import moment from "moment";
import {FaRegTrashCan} from "react-icons/fa6";

import {LiaEditSolid} from "react-icons/lia";

import ModalDeleteMutiOrOne from "../../../components/Modal/ModalDelete";
import {deletesSeo} from "../../../../services/api.service";

import ModalSeo from "./ModalSeo";
import {FaTrash} from "react-icons/fa";
import {GetPagingSeo} from "../../../../_redux/slice/seoSlice";

// const PAGE_SIZE = 10;

function TableSeoList({
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
		(state) => state?.seo || []
	);
	console.log("seo", data);

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
			GetPagingSeo({
				pageIndex: pageIndex || 1,
				pageSize: pgSize || 10,
				search: search || "",
			})
		);
	};
	const columns = [
		{name: "Link", _id: "link", className: "w-1/4"},
		{name: "thẻ", _id: "tags", className: "w-1/4"},
		{name: "Ngày tạo", _id: "createdAt", className: "w-1/4"},
		{name: "Hành động", _id: "actions", className: "w-1/4"},
	];

	const renderCell = useCallback((item, columnKey) => {
		const cellValue = item[columnKey];

		switch (columnKey) {
			case "link":
				return (
					<p className="line-clamp-2 text-white flex items-center justify-center">
						{cellValue}
					</p>
				);
			case "tags":
				return (
					<p className="line-clamp-2 text-white   flex items-center justify-center">
						{cellValue?.length}
					</p>
				);

			case "createdAt":
				return (
					<p className="text-white  flex items-center justify-center">
						{moment(cellValue).format("DD/MM/YYYY")}
					</p>
				);

			case "actions":
				return (
					<div className={"flex flex-row gap-1 justify-center"}>
						<Button
							color="primary"
							variant="solid"
							className="min-w-7 h-7 rounded-full p-0"
							onClick={() => handleEdit(item)}
						>
							<Tooltip
								color={"primary"}
								content={"Chỉnh sửa"}
								className="capitalize"
								disableAnimation={true}
							>
								<p>
									<LiaEditSolid />
								</p>
							</Tooltip>
						</Button>

						<Button
							color="danger"
							variant="solid"
							className="min-w-7 h-7 rounded-full p-0"
							onClick={() => {
								setIsOpenModalDelete(true);
								setListIdSelected([item?.original?._id]);
							}}
						>
							<Tooltip
								color={"danger"}
								content={"Xóa"}
								className="capitalize"
								disableAnimation={true}
							>
								<p>
									<FaTrash />
								</p>
							</Tooltip>
						</Button>
					</div>
				);
		}
	}, []);

	const handleEdit = (item) => {
		setItemId(item?._id);
		onOpenAddEdit();
	};

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
			GetPagingSeo({
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
					isLoading={loading}
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
				<ModalSeo
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
					funcDelete={deletesSeo}
					bodyMsg={
						listIds?.length !== 1
							? "Bạn có chắc chắn muốn xóa các bài viết đã chọn?"
							: "Bạn có chắc chắn muốn xóa bài viết này?"
					}
				/>
			)}
		</>
	);
}

export default TableSeoList;
