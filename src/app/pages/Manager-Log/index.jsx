import { useState, useEffect, useMemo, useCallback } from "react";
import {
	Select,
	Flex,
	Icon,
	Stack,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";
import {
	Pagination,
	usePagination,
	PaginationPage,
	PaginationNext,
	PaginationPrevious,
	PaginationPageGroup,
	PaginationContainer,
	PaginationSeparator,
} from "@ajna/pagination";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { IoSearchSharp } from "react-icons/io5";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { logAction } from "_redux/slice/logSlice";
import { userAction } from "_redux/slice/user.slice";
import DateRangerPicker from "app/components/DateRangerPicker";
import { Button } from "@nextui-org/react";
function dateToUtcTime(date) {
	if (!date) return "";
	const userTimeZoneOffset = date?.getTimezoneOffset();
	const utcOffsetInHours = -userTimeZoneOffset / 60;
	const utcTime = new Date(
		date.getTime() + utcOffsetInHours * 60 * 60 * 1000
	);
	return utcTime;
}

export default function ManagerLog() {
	const dispatch = useDispatch();
	const counts = useSelector((state) => state.log.counts);
	const listLog = useSelector((state) => state.log.listLog);
	const isLoading = useSelector((state) => state.log.isLoadingpaging);
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const listUser = useSelector((state) => state.user.listUserGetAll);
	const [userSelected, setUserSelected] = useState("all");
	useEffect(() => {
		dispatch(logAction.getAllPagingLog({}));
		dispatch(userAction.GetAllUser());
	}, []);

	const columns = [
		{ name: "Tên hành động", _id: "actionName" },
		{ name: "Người dùng", _id: "fullName" },
		{ name: "Địa chỉ IP", _id: "ip" },
		{ name: "Ngày tạo", _id: "createdAt" },
	];

	const renderCell = useCallback((item, columnKey) => {
		const cellValue = item[columnKey];

		switch (columnKey) {
			case "actionName":
				return <p className="text-sm text-white">{cellValue}</p>;

			case "fullName":
				return (
					<p className="text-[13px] text-white">
						{item?.user?.firstName || item?.user?.lastName
							? `${item?.user?.firstName || ""} ${
									item?.user?.lastName || ""
							  }`
							: item?.user?.name
							? `${item?.user?.name}`
							: "(Trống)"}
					</p>
				);

			case "ip":
				return <p className="text-sm text-white">{cellValue}</p>;

			case "createdAt":
				return (
					<p className="text-sm text-white">
						{moment(cellValue).format("DD/MM/yyyy")}
					</p>
				);
		}
	}, []);

	// const columns = [
	//   {
	//     header: "Tên hành động",
	//     accessorKey: "actionName",
	//     cell: ({ row }) => (
	//       <p className="text-[13px] text-white ">{row.original?.actionName}</p>
	//     ),
	//   },
	//   {
	//     header: "Người dùng",
	//     accessorKey: "fullName",
	//     cell: ({ row }) => (
	//       <p className="text-[13px] text-white">
	//         {row.original?.user?.firstName || row.original?.user?.lastName
	//           ? `${row.original?.user?.firstName || ""} ${
	//               row.original?.user?.lastName || ""
	//             }`
	//           : row.original?.user?.name
	//           ? `${row.original?.user?.name}`
	//           : "(Trống)"}
	//       </p>
	//     ),
	//   },
	//   {
	//     header: "Địa chỉ ip",
	//     accessorKey: "ip",
	//     cell: ({ row }) => (
	//       <p className="text-[13px] text-white">{row.original?.ip}</p>
	//     ),
	//   },
	//   // {
	//   //   header: "Đường dẫn",
	//   //   accessorKey: "endPoint",
	//   //   cell: ({ row }) => (
	//   //     <p className="text-[13px] text-white">{row.original?.endPoint}</p>
	//   //   ),
	//   // },
	//   // {
	//   //   header: "Phương thức",
	//   //   accessorKey: "method",
	//   //   cell: ({ row }) => (
	//   //     <p className="text-[13px] text-white">{row.original?.method}</p>
	//   //   ),
	//   // },
	//   // {
	//   //   header: "Dữ liệu",
	//   //   accessorKey: "data",
	//   //   cell: ({ row }) => (
	//   //     <p className="text-[13px] text-white max-w-[40vw]">
	//   //       {row.original?.body}
	//   //     </p>
	//   //   ),
	//   // },
	//   {
	//     header: "Ngày tạo",
	//     accessorKey: "createdAt",
	//     cell: ({ row }) => (
	//       <p className="text-[13px] text-white">
	//         {moment(row.getValue("createdAt")).format("DD/MM/yyyy")}
	//       </p>
	//     ),
	//   },
	// ];

	const {
		pages,
		pagesCount,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
	} = usePagination({
		total: counts,
		limits: {
			outer: 1,
			inner: 1,
		},
		initialState: {
			pageSize: 10,
			currentPage: 1,
		},
	});
	const [sorting, setSorting] = useState([]);
	const [columnFilters, setColumnFilters] = useState([]);
	const [columnVisibility, setColumnVisibility] = useState({});
	const [rowSelection, setRowSelection] = useState({});

	const handlePageChange = (nextPage, nextPageSize) => {
		nextPageSize && setPageSize(nextPageSize);
		setCurrentPage(nextPage);
		dispatch(
			logAction.getAllPagingLog({
				pageIndex: nextPage,
				pageSize: nextPageSize ?? pageSize,
				userId: userSelected,
				startDate: dateToUtcTime(startDate),
				endDate: dateToUtcTime(endDate),
			})
		);
	};
	const handleSearh = () => {
		setCurrentPage(1);
		dispatch(
			logAction.getAllPagingLog({
				pageIndex: 1,
				pageSize,
				userId: userSelected,
				startDate: dateToUtcTime(startDate),
				endDate: dateToUtcTime(endDate),
			})
		);
	};
	const table = useReactTable({
		data: listLog,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});
	const listUserSelect = useMemo(() => {
		return (
			<Select
				onChange={(e) => setUserSelected(e.target.value)}
				color={"#ffffff"}
				defaultValue={"all"}
				fontSize={"14px"}
				maxWidth={"230px"}
			>
				{[{ _id: "all", name: "Tất cả người dùng" }, ...listUser]?.map(
					(user, index) => (
						<option
							key={index}
							style={{
								backgroundColor: "red !important",
								color: "#1a1a1a",
							}}
							value={user?._id}
						>
							{user?.firstName || user?.lastName
								? `${user?.firstName || ""} ${
										user?.lastName || ""
								  }`
								: user?.name
								? `${user?.name}`
								: ""}
						</option>
					)
				)}
			</Select>
		);
	}, [listUser]);

	return (
		<div className="flex flex-col mt-24">
			<div className="mb-4 rounded-md px-0 flex flex-col justify-center items-center overflow-y-auto shadow-wrapper">
				<div className="flex flex-row justify-end items-center gap-2">
					<DateRangerPicker
						startDate={startDate}
						endDate={endDate}
						setStartDate={(day) => {
							setStartDate(day);
						}}
						setEndDate={(day) => {
							setEndDate(day);
						}}
					/>
					{listUserSelect}
					<div className="flex flex-row justify-center items-center gap-2">
						<Button
							variant="solid"
							color={"primary"}
							className="rounded-md min-w-32 text-white font-bold text-xs mr-5 tracking-wide"
							startContent={
								<IoSearchSharp className="text-white min-w-max min-h-max" />
							}
							onClick={handleSearh}
						>
							Tìm kiếm
						</Button>
					</div>
				</div>
			</div>

			<div className="mb-4 rounded-md px-0 flex flex-col justify-center items-center overflow-y-auto shadow-wrapper">
				<Table variant="simple" color="gray.500" mb="24px">
					<Thead className="bg-[#758beb]">
						{table.getHeaderGroups().map((headerGroup, index) => (
							<Tr key={index}>
								{headerGroup.headers.map((header) => {
									return (
										<Th key={header.id} padding={""}>
											<Flex
												justify="space-between"
												align="center"
												fontSize={{
													sm: "10px",
													lg: "12px",
												}}
												color="gray.400"
												className="!text-white font-bold"
											>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column
																.columnDef
																.header,
															header.getContext()
													  )}
											</Flex>
										</Th>
									);
								})}
							</Tr>
						))}
					</Thead>

					<Tbody>
						{!isLoading && table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<Tr
									key={row.id}
									data-state={
										row.getIsSelected() && "selected"
									}
								>
									{row.getVisibleCells().map((cell) => (
										<Td
											key={cell.id}
											fontSize={{
												sm: "14px",
											}}
											color="black"
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</Td>
									))}
								</Tr>
							))
						) : isLoading ? (
							Array.from(Array(pageSize)).map((e, index) => (
								<Tr key={index} className="w-full">
									{Array.from(Array(columns.length)).map(
										(cell) => (
											<Td
												key={cell}
												color="black"
												className={`${
													cell === 3 && "w-36"
												}`}
											>
												<p className="text-white text-sm">
													Đang tải...
												</p>
											</Td>
										)
									)}
								</Tr>
							))
						) : (
							<Tr>
								<Td
									colSpan={columns.length}
									className="h-96 !text-center max-sm:!text-start max-sm:!px-32"
									color="white"
								>
									Không có dữ liệu
								</Td>
							</Tr>
						)}
					</Tbody>
				</Table>
				{listLog.length !== 0 ? (
					<Flex
						justify="space-between"
						alignItems={{ sm: "start", md: "center" }}
						className="flex-row max-sm:flex-col max-sm:justify-start max-sm:items-start"
						align="center"
						w="100%"
						px={{ md: "22px" }}
					>
						<Text
							fontSize="sm"
							color="white"
							fontWeight="normal"
							className="text-center"
							p={1}
							mt={{ sm: "5px", md: "0px" }}
							mb={{ sm: "5px", md: "0px" }}
						>
							Có tất cả {counts} log
						</Text>
						<div className="flex flex-row justify-center items-center max-sm:flex-col  max-sm:items-end max-sm:w-full ">
							<Pagination
								pagesCount={pagesCount}
								currentPage={currentPage}
								onPageChange={handlePageChange}
							>
								<PaginationContainer
									className="w-full max-sm:!px-1 max-sm:!py-3 gap-2 max-sm:gap-0"
									align="center"
									justify="space-between"
									ms="auto"
									p={4}
								>
									<PaginationPrevious
										transition="all .5s ease"
										w="40px"
										h="40px"
										borderRadius="8px"
										bg="#fff"
										border="1px solid lightgray"
										_hover={{
											bg: "gray.200",
											opacity: "0.7",
											borderColor: "gray.500",
										}}
									>
										<Icon
											as={GrFormPrevious}
											w="16px"
											h="16px"
											color="gray.400"
										/>
									</PaginationPrevious>
									<PaginationPageGroup
										align="center"
										separator={
											<PaginationSeparator
												onClick={() =>
													console.log(
														"Im executing my own function along with Separator component functionality"
													)
												}
												bg="gray.300"
												fontSize="sm"
												w={7}
												jumpSize={5}
											/>
										}
									>
										{pages.map((page) => (
											<PaginationPage
												page={page}
												key={page}
												className="!text-[13px]"
												variant="no-effects"
												transition="all .5s ease"
												w="40px"
												h="40px"
												borderRadius="8px"
												bg={"#fff"}
												border={"1px solid lightgray"}
												_hover={{
													opacity: "0.7",
													borderColor: "gray.500",
												}}
												_current={{
													border: "none",
													bg: "blue.500",
													color: "white",
												}}
											/>
										))}
									</PaginationPageGroup>
									<PaginationNext
										transition="all .5s ease"
										w="40px"
										h="40px"
										borderRadius="8px"
										bg="#fff"
										border="1px solid lightgray"
										_hover={{
											bg: "gray.200",
											opacity: "0.7",
											borderColor: "gray.500",
										}}
									>
										<Icon
											as={GrFormNext}
											w="16px"
											h="16px"
											color="gray.400"
										/>
									</PaginationNext>
								</PaginationContainer>
							</Pagination>
							<Stack
								direction={{ sm: "column", md: "row" }}
								spacing={{ sm: "4px", md: "12px" }}
								align="center"
								ms={3}
							>
								<div className="min-w-32">
									<Select
										variant="outline"
										value={pageSize}
										onChange={(e) => {
											handlePageChange(
												1,
												Number(e.target.value)
											);
										}}
										color="white"
										size="sm"
										borderRadius="12px"
										cursor="pointer"
									>
										<option className="!text-black">
											10
										</option>
										<option className="!text-black">
											20
										</option>
										<option className="!text-black">
											30
										</option>
										<option className="!text-black">
											50
										</option>
										<option className="!text-black">
											100
										</option>
									</Select>
								</div>
							</Stack>
						</div>
					</Flex>
				) : null}
			</div>
		</div>
	);

	/*
	return (
		<>
			<Flex flexDirection="column" pt={{ base: "120px", md: "75px" }}>
				<Box
					mb="16px"
					borderRadius="4px"
					px="0px"
					display="flex"
					flexDirection="column"
					justifyContent="center"
					align="center"
					zIndex={999}
					className="shadow-wrapper"
				>
					<Card p="24px" borderRadius="20px">
						<div className="flex flex-row justify-end items-center gap-2">
							<DateRangerPicker
								startDate={startDate}
								endDate={endDate}
								setStartDate={(day) => {
									setStartDate(day);
								}}
								setEndDate={(day) => {
									setEndDate(day);
								}}
							/>
							{listUserSelect}
							<div className="max-w-64"></div>
							<div className="flex flex-row justify-center items-center gap-2 ">
								<Button
									onClick={handleSearh}
									borderRadius="4px"
									transition="background .3s ease"
									bg={"blue.500"}
									_hover={{
										bg: "blue.500",
									}}
									_active={{
										bg: "blue.500",
									}}
									me={{ base: "none", lg: "20px" }}
									leftIcon={
										<Icon
											color="white"
											as={IoSearchSharp}
										/>
									}
									minW="135px"
								>
									<Text
										fontSize="xs"
										color="#fff"
										fontWeight="bold"
									>
										Tìm kiếm
									</Text>
								</Button>
							</div>
						</div>
					</Card>
				</Box>
				<Box
					mb="16px"
					borderRadius="4px"
					px="0px"
					display="flex"
					flexDirection="column"
					justifyContent="center"
					align="center"
					overflowY={"auto"}
					className="shadow-wrapper"
				>
					<Card p="24px" borderRadius="20px">
						<Divider />
						
					</Card>
				</Box>
			</Flex>
		</>
	);
  */
}
