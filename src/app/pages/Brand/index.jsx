import { Button, Icon, Stack, Text } from "@chakra-ui/react";
import {
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LiaEditSolid } from "react-icons/lia";
import { FaTrash } from "react-icons/fa";
import IndeterminateCheckbox from "app/components/IndeterminateCheckbox/IndeterminateCheckbox";
import { GetPagingBrand } from "_redux/slice/brandSlice";
import { Spinner } from "@nextui-org/react";
import TempTable from "app/components/TempTable";
import ModalBrand from "./components/modal/ModalBrand";
import moment from "moment";
import Header from "app/components/Header/Header";
import { useDisclosure } from "@nextui-org/react";
import { usePagination } from "@ajna/pagination";
import { deletesBrand } from "services/api.service";
import ModalDeleteMutiOrOne from "app/components/Modal/ModalDelete_s";
import { Tooltip } from "@nextui-org/react";

function Brand() {
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
		(state) => state?.brand || []
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
					<Text className="text-white">
						{Number(info?.row?.id) + 1}
					</Text>
				),
			},
			{
				accessorKey: "name",
				header: "Tên hậu đài",
				cell: (info) => (
					<Text className="text-white">{info?.getValue()}</Text>
				),
			},

			{
				accessorKey: "createdAt",
				header: "Ngày tạo",
				cell: (info) => (
					<Text className="text-white">
						{moment(info.getValue()).format("DD/MM/YYYY")}
					</Text>
				),
			},

			{
				accessorKey: "#",
				header: "Hành động",
				cell: ({ row }) => (
					<Stack gap={1} direction={"row"}>
						<Tooltip
							color={"primary"}
							content={"Chỉnh sửa"}
							className="capitalize"
							disableAnimation={true}
						>
							<Button
								p={0}
								minW={"30px"}
								h={"30px"}
								borderRadius={"full"}
								color={"white"}
								_hover={{
									bg: "blue.400",
								}}
								bg={"#0389e9"}
								onClick={() => handleEdit(row)}
							>
								<Icon as={LiaEditSolid} />
							</Button>
						</Tooltip>
						<Tooltip
							color={"danger"}
							content={"Xóa"}
							className="capitalize"
							disableAnimation={true}
						>
							<Button
								p={0}
								minW={"30px"}
								h={"30px"}
								borderRadius={"full"}
								color={"white"}
								_hover={{
									bg: "red.400",
								}}
								bg={"red.500"}
								onClick={() => {
									setIsOpenModalDelete(true);
									setListIdSelected([row?.original?._id]);
								}}
							>
								<Icon as={FaTrash} />
							</Button>
						</Tooltip>
					</Stack>
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

	useEffect(() => {
		handleGetPagination();
	}, [currentPage, pageSize]);
	useEffect(() => {
		const listPostIds = table
			.getSelectedRowModel()
			.flatRows.map((row) => row.original._id);
		setListIdSelected(listPostIds);
	}, [rowSelection]);
	const handleGetPagination = () => {
		dispatch(
			GetPagingBrand({
				pageIndex: currentPage || 1,
				pageSize: pageSize || 10,
				search: search || "",
			})
		);
	};

	const handlePageChange = (nextPage, nextPageSize) => {
		nextPageSize && setPageSize(nextPageSize);
		setCurrentPage(nextPage);
		dispatch(
			GetPagingBrand({
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
			GetPagingBrand({
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
			GetPagingBrand({
				pageIndex: 1,
				pageSize,
				search: search || "",
			})
		);
	}, [search]);

	return (
		<div className="flex flex-col mt-24">
			<Header
				onOpenAddEdit={handleOpenAddEdit}
				onOpenDelete={() => {
					setIsOpenModalDelete(!isOpenModalDelete);
				}}
				listIds={listIdSelected}
				onSearch={setSearch}
				placeholder="Tìm kiếm hậu đài..."
			/>
			<div className="mb-4 rounded-sm flex flex-col justify-center items-center overflow-y-hidden shadow-wrapper">
				<div className="p-6 rounded-lg">
					{loading ? (
						<div className="flex items-center justify-center h-96">
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
								<Text className="text-white">
									Không có dữ liệu
								</Text>
							)}
						</div>
					)}
				</div>
			</div>

			{isOpenAddEdit && (
				<ModalBrand
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
				funcDelete={deletesBrand}
				bodyMsg={
					listIdSelected?.length !== 1
						? "Bạn có chắc chắn muốn xóa các hậu đài đã chọn?"
						: "Bạn có chắc chắn muốn xóa hậu đài này?"
				}
			/>
		</div>
	);
}

export default Brand;
