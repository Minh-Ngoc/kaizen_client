import {
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LiaEditSolid } from "react-icons/lia";
import { FaTrash } from "react-icons/fa";
import IndeterminateCheckbox from "app/components/IndeterminateCheckbox/IndeterminateCheckbox";
import { GetPagingBlog } from "_redux/slice/blogSlice";
import { Avatar, AvatarGroup, Button, Chip, Spinner, Tooltip } from "@nextui-org/react";
import TempTable from "app/components/TempTable";
import ModalBlog from "./components/modal/ModalBlog";
import ModalDelete from "app/components/Modal/ModalDelete";
import moment from "moment";
import Header from "app/components/Header/Header";
import { DeleteBlog } from "_redux/slice/blogSlice";
import { useDisclosure } from "@nextui-org/react";
import { URL_IMAGE } from "_constants";
const typeBlog = {
	experience: "Kinh nghiệm",
	tool: "Công cụ",
	life: "Đời sống",
};
import { usePagination } from "@ajna/pagination";
import ModalDeleteMutiOrOne from "app/components/Modal/ModalDelete_s";
import { deletesBlog } from "services/api.service";

function Blog() {
	const dispatch = useDispatch();
	const [sorting, setSorting] = useState([]);
	const [columnFilters, setColumnFilters] = useState([]);
	const [columnVisibility, setColumnVisibility] = useState({});
	const [rowSelection, setRowSelection] = useState({});
	const [search, setSearch] = useState("");
	const [listIdSelected, setListIdSelected] = useState([]);
	const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
	const {
		isOpen: isOpenAddEdit,
		onOpen: onOpenAddEdit,
		onClose: onCloseAddEdit,
		onOpenChange: onOpenChangeAddEdit,
	} = useDisclosure();

	const [itemId, setItemId] = useState("");

	const { data, loading, totalDoc, totalPage } = useSelector(
		(state) => state?.blog || []
	);

	const handleOpenAddEdit = () => {
		onOpenAddEdit();
		setItemId("");
	};

	const columns = [
		{ name: "Tiêu đề", _id: "title" },
		{ name: "Ảnh", _id: "images" },
		{ name: "Loại blog", _id: "type" },
		{ name: "Mô tả", _id: "description" },
		{ name: "Nội dung", _id: "content" },
		{ name: "Trạng thái", _id: "status" },
		{ name: "Người tạo", _id: "user" },
		{ name: "Ngày tạo", _id: "createdAt" },
		{ name: "Hành động", _id: "actions" },
	];

	const renderCell = useCallback((item, columnKey) => {
		const cellValue = item[columnKey];

		switch(columnKey) {
			case "title":
				return (
					<p className="line-clamp-2 text-white">
						{cellValue}
					</p>
				);

			case "images":
				return (
					<AvatarGroup isBordered max={5}>
						{cellValue?.map((item, index) => (
							<Avatar key={index} src={`${URL_IMAGE}/${item}`} />
						))}
					</AvatarGroup>
				);

			case "type": 
				return (
					<p className="text-nowrap text-white">
						{typeBlog[cellValue]}
					</p>
				);

			case "description":
				return (
					<p
						className="line-clamp-2 text-white"
						dangerouslySetInnerHTML={{ __html: cellValue }}
					/>
				);
			
			case "content":
				return (
					<p
						className="line-clamp-2 text-white"
						dangerouslySetInnerHTML={{ __html: cellValue }}
					/>
				);

			case "status":
				return (
					<p className="text-white">
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
					</p>
				);

			case "user":
				return (
					<p className="text-white">{cellValue}</p>
				);
			
			case "createdAt":
				return (
					<p className="text-white">
						{moment(cellValue).format("DD/MM/YYYY")}
					</p>
				);

			case "actions":
				return (
					<div className={"flex flex-row gap-1"}>
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

	// const columns = useMemo(
	// 	() => [
	// 		{
	// 			id: "select",
	// 			header: ({ table }) => (
	// 				<IndeterminateCheckbox
	// 					{...{
	// 						checked: table.getIsAllRowsSelected(),
	// 						indeterminate: table.getIsSomeRowsSelected(),
	// 						onChange: table.getToggleAllRowsSelectedHandler(),
	// 					}}
	// 				/>
	// 			),
	// 			cell: ({ row }) => (
	// 				<div className="px-1">
	// 					<IndeterminateCheckbox
	// 						{...{
	// 							checked: row.getIsSelected(),
	// 							disabled: !row.getCanSelect(),
	// 							indeterminate: row.getIsSomeSelected(),
	// 							onChange: row.getToggleSelectedHandler(),
	// 						}}
	// 					/>
	// 				</div>
	// 			),
	// 		},
	// 		{
	// 			accessorKey: "id",
	// 			header: "STT",
	// 			cell: (info) => (
	// 				<p className="text-white">{Number(info?.row?.id) + 1}</p>
	// 			),
	// 		},
	// 		{
	// 			accessorKey: "title",
	// 			header: "Tiêu đề",
	// 			cell: (info) => (
	// 				<p className="line-clamp-2 text-white">
	// 					{info?.getValue()}
	// 				</p>
	// 			),
	// 		},
	// 		{
	// 			accessorKey: "images",
	// 			header: "Ảnh",
	// 			cell: (info) => (
	// 				<AvatarGroup isBordered max={5}>
	// 					{info?.getValue()?.map((item, index) => (
	// 						<Avatar key={index} src={`${URL_IMAGE}/${item}`} />
	// 					))}
	// 				</AvatarGroup>
	// 			),
	// 		},
	// 		{
	// 			accessorKey: "type",
	// 			header: "Loại blog",
	// 			cell: (info) => (
	// 				<p className="text-nowrap text-white">
	// 					{typeBlog[info.getValue()]}
	// 				</p>
	// 			),
	// 		},
	// 		{
	// 			accessorKey: "description",
	// 			header: "Mô tả",
	// 			cell: (info) => (
	// 				<p
	// 					className="line-clamp-2 text-white"
	// 					dangerouslySetInnerHTML={{ __html: info.getValue() }}
	// 				/>
	// 			),
	// 		},
	// 		{
	// 			accessorKey: "content",
	// 			header: "Nội dung",
	// 			cell: (info) => (
	// 				<p
	// 					className="line-clamp-2 text-white"
	// 					dangerouslySetInnerHTML={{ __html: info.getValue() }}
	// 				/>
	// 			),
	// 		},
	// 		{
	// 			accessorKey: "status",
	// 			header: "Trạng thái",
	// 			cell: (info) => (
	// 				<p className="text-white">
	// 					<Chip
	// 						color={
	// 							info.getValue() === "pending"
	// 								? "warning"
	// 								: info.getValue() === "approved"
	// 								? "success"
	// 								: "danger"
	// 						}
	// 					>
	// 						{info.getValue() === "pending"
	// 							? "Chờ duyệt"
	// 							: info.getValue() === "approved"
	// 							? "Đã duyệt"
	// 							: "Từ chối"}
	// 					</Chip>
	// 				</p>
	// 			),
	// 		},

	// 		{
	// 			accessorKey: "user",
	// 			header: "Người tạo",
	// 			cell: (info) => (
	// 				<p className="text-white">{info.getValue()?.username}</p>
	// 			),
	// 		},

	// 		{
	// 			accessorKey: "createdAt",
	// 			header: "Ngày tạo",
	// 			cell: (info) => (
	// 				<p className="text-white">
	// 					{moment(info.getValue()).format("DD/MM/YYYY")}
	// 				</p>
	// 			),
	// 		},

	// 		{
	// 			accessorKey: "#",
	// 			header: "Hành động",
	// 			cell: ({ row }) => (
	// 				<div className={"flex flex-row gap-1"}>
	// 					<Button
	// 						color="primary"
	// 						variant="solid"
	// 						className="min-w-7 h-7 rounded-full p-0"
	// 						onClick={() => handleEdit(row)}
	// 					>
	// 						<Tooltip
	// 							color={"primary"}
	// 							content={"Chỉnh sửa"}
	// 							className="capitalize"
	// 							disableAnimation={true}
	// 						>
	// 							<p>
	// 								<LiaEditSolid />
	// 							</p>
	// 						</Tooltip>
	// 					</Button>

	// 					<Button
	// 						color="danger"
	// 						variant="solid"
	// 						className="min-w-7 h-7 rounded-full p-0"
	// 						onClick={() => {
	// 							setIsOpenModalDelete(true);
	// 							setListIdSelected([row?.original?._id]);
	// 						}}
	// 					>
	// 						<Tooltip
	// 							color={"danger"}
	// 							content={"Xóa"}
	// 							className="capitalize"
	// 							disableAnimation={true}
	// 						>
	// 							<p>
	// 								<FaTrash />
	// 							</p>
	// 						</Tooltip>
	// 					</Button>
	// 				</div>
	// 			),
	// 		},
	// 	],

	// 	[]
	// );

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
	const handleGetPagination = (search) => {
		dispatch(
			GetPagingBlog({
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
			GetPagingBlog({
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
			GetPagingBlog({
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
			GetPagingBlog({
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

				<div className="mb-16 flex flex-row justify-between items-center p-6 rounded-lg shadow-wrapper">
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
				<ModalBlog
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
				funcDelete={deletesBlog}
				bodyMsg={
					listIdSelected?.length !== 1
						? "Bạn có chắc chắn muốn xóa các bài viết đã chọn?"
						: "Bạn có chắc chắn muốn xóa bài viết này?"
				}
			/>
		</>
	);
}

export default Blog;
