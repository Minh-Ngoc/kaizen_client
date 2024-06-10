import {
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LiaEditSolid } from "react-icons/lia";
import { FaTrash } from "react-icons/fa";
import IndeterminateCheckbox from "app/components/IndeterminateCheckbox/IndeterminateCheckbox";
import { GetPagingActivity } from "_redux/slice/activitySlice";
import { Avatar, AvatarGroup, Button, Chip, Spinner, Tooltip } from "@nextui-org/react";
import TempTable from "app/components/TempTable";
import ModalActivity from "./components/modal/ModalActivity";
import ModalDelete from "app/components/Modal/ModalDelete";
import moment from "moment";
import Header from "app/components/Header/Header";
import { DeleteActivity } from "_redux/slice/activitySlice";
import { useDisclosure } from "@nextui-org/react";
import { URL_IMAGE } from "_constants";
import { usePagination } from "@ajna/pagination";
import { deletesActivity } from "services/api.service";
import ModalDeleteMutiOrOne from "app/components/Modal/ModalDelete_s";

function Activity() {
	const dispatch = useDispatch();
	const [sorting, setSorting] = React.useState([]);
	const [columnFilters, setColumnFilters] = React.useState([]);
	const [columnVisibility, setColumnVisibility] = React.useState({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [search, setSearch] = useState("");
	const [listIdSelected, setListIdSelected] = useState([]);
	const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
	const {
		isOpen: isOpenAddEdit,
		onOpen: onOpenAddEdit,
		onClose: onCloseAddEdit,
		onOpenChange: onOpenChangeAddEdit,
	} = useDisclosure();

	const [itemId, setItemId] = React.useState("");

	const { data, loading, totalDoc, totalPage } = useSelector(
		(state) => state?.activity || []
	);
	const handleOpenAddEdit = () => {
		onOpenAddEdit();
		setItemId("");
	};
	const columns = useMemo(
		() => [
			{
				id: "select",
				header: ({ table }) => (
					<IndeterminateCheckbox
						{...{
							checked: table.getIsAllRowsSelected(),
							indeterminate: table.getIsSomeRowsSelected(),
							onChange: table.getToggleAllRowsSelectedHandler(),
						}}
					/>
				),
				cell: ({ row }) => (
					<div className="px-1">
						<IndeterminateCheckbox
							{...{
								checked: row.getIsSelected(),
								disabled: !row.getCanSelect(),
								indeterminate: row.getIsSomeSelected(),
								onChange: row.getToggleSelectedHandler(),
							}}
						/>
					</div>
				),
			},
			{
				accessorKey: "id",
				header: "STT",
				cell: (info) => (
					<p className="text-white">{Number(info?.row?.id) + 1}</p>
				),
			},
			{
				accessorKey: "title",
				header: "Tiêu đề",
				cell: (info) => (
					<p className="text-white line-clamp-2">
						{info?.getValue()}
					</p>
				),
			},
			{
				accessorKey: "images",
				header: "Ảnh đại diện",
				cell: (info) => (
					<AvatarGroup isBordered max={5}>
						{info?.getValue()?.map((item, index) => (
							<Avatar key={index} src={`${URL_IMAGE}/${item}`} />
						))}
					</AvatarGroup>
				),
			},

			{
				accessorKey: "description",
				header: "Mô tả",
				cell: (info) => (
					<p
						className="line-clamp-2 text-white"
						dangerouslySetInnerHTML={{ __html: info.getValue() }}
					/>
				),
			},
			{
				accessorKey: "content",
				header: "Nội dung",
				cell: (info) => (
					<p
						className="line-clamp-2 text-white"
						dangerouslySetInnerHTML={{ __html: info.getValue() }}
					/>
				),
			},
			{
				accessorKey: "status",
				header: "Trạng thái",
				cell: (info) => (
					<p className="text-white ">
						<Chip
							color={
								info.getValue() === "pending"
									? "warning"
									: info.getValue() === "approved"
									? "success"
									: "danger"
							}
						>
							{info.getValue() === "pending"
								? "Chờ duyệt"
								: info.getValue() === "approved"
								? "Đã duyệt"
								: "Từ chối"}
						</Chip>
					</p>
				),
			},

			{
				accessorKey: "user",
				header: "Người tạo",
				cell: (info) => (
					<p className="text-white">{info.getValue()?.username}</p>
				),
			},

			{
				accessorKey: "createdAt",
				header: "Ngày tạo",
				cell: (info) => (
					<p className="text-white">
						{moment(info.getValue()).format("DD/MM/YYYY")}
					</p>
				),
			},

			{
				accessorKey: "#",
				header: "Hành động",
				cell: ({ row }) => (
					<div className={"flex flex-row gap-1"}>
						<Button
							color="primary"
							variant="solid"
							className="min-w-7 h-7 rounded-full p-0"
							onClick={() => handleEdit(row)}
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
								setListIdSelected([row?.original?._id]);
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
				),
			},
		],

		[]
	);

	const table = useReactTable({
		data,
		columns,
		enableRowSelection: true,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		manualPagination: true,
		autoResetPageIndex: false,
		pageCount: totalPage,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});
	const {
		pages,
		pagesCount,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
	} = usePagination({
		total: totalDoc,
		limits: {
			outer: 1,
			inner: 1,
		},
		initialState: {
			pageSize: 10,
			currentPage: 1,
		},
	});

	const handleEdit = (data) => {
		setItemId(data.original?._id);
		onOpenAddEdit();
	};
	const handleGetPagination = () => {
		dispatch(
			GetPagingActivity({
				pageIndex: currentPage || 1,
				pageSize: pageSize || 10,
				search: search || "",
			})
		);
	};

	useEffect(() => {
		handleGetPagination();
	}, [currentPage, pageSize]);
	useEffect(() => {
		const listPostIds = table
			.getSelectedRowModel()
			.flatRows.map((row) => row.original._id);
		setListIdSelected(listPostIds);
	}, [rowSelection]);

	const handlePageChange = (nextPage, nextPageSize) => {
		nextPageSize && setPageSize(nextPageSize);
		setCurrentPage(nextPage);
		dispatch(
			GetPagingActivity({
				pageIndex: nextPage,
				pageSize: nextPageSize ?? pageSize,
				search: search || "",
			})
		);
	};
	const handleOnDelete = () => {
		let tempPageIndex = currentPage;
		const checkPage = (totalDoc - listIdSelected?.length) / pageSize;
		if (checkPage <= tempPageIndex - 1) tempPageIndex -= 1;
		if (tempPageIndex <= 0) tempPageIndex = 1;
		dispatch(
			GetPagingActivity({
				pageIndex: tempPageIndex,
				pageSize,
				search: search || "",
			})
		);
		setRowSelection({});
		setListIdSelected([]);
		setCurrentPage(tempPageIndex);
	};
	useEffect(() => {
		setCurrentPage(1);
		dispatch(
			GetPagingActivity({
				pageIndex: 1,
				pageSize,
				search: search || "",
			})
		);
	}, [search]);
	return (
		<>
			<div className="flex flex-col mt-24">
				<Header
					onOpenAddEdit={handleOpenAddEdit}
					onOpenDelete={() => {
						setIsOpenModalDelete(!isOpenModalDelete);
					}}
					listIds={listIdSelected}
					onSearch={setSearch}
					placeholder="Tìm kiếm bài viết..."
				/>

				<div className="mb-4 rounded-md px-0 flex flex-col justify-center items-center overflow-y-auto shadow-wrapper">
					{loading ? (
						<div className="h-96 p-4">
							<Spinner label="Loading..." color="blue" />
						</div>
					) : (
						<div>
							{data?.length ? (
								<TempTable
									table={table}
									totalDoc={totalDoc}
									loading={loading}
									pagesCount={pagesCount}
									currentPage={currentPage}
									handlePageChange={handlePageChange}
									pages={pages}
									pageSize={pageSize}
								/>
							) : (
								<p className="text-white">Không có dữ liệu</p>
							)}
						</div>
					)}
				</div>
			</div>
			{isOpenAddEdit && (
				<ModalActivity
					itemId={itemId}
					isOpen={isOpenAddEdit}
					onClose={onCloseAddEdit}
					onOpenChange={onOpenChangeAddEdit}
					onGetPaging={handleGetPagination}
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
				funcDelete={deletesActivity}
				bodyMsg={
					listIdSelected?.length !== 1
						? "Bạn có chắc chắn muốn xóa các bài viết đã chọn?"
						: "Bạn có chắc chắn muốn xóa bài viết này?"
				}
			/>
		</>
	);
}

export default Activity;
