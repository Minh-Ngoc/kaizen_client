import {
	Pagination,
	Select,
	SelectItem,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@nextui-org/react";
import {memo, useMemo, useState} from "react";

function TableNextUI({
	data = [],
	columns,
	renderCell,
	isLoading = false,
	total,
	page = 1,
	pageSize = 10,
	onPageChange,
	selectionMode = "single", //multiple or single
	selectedKeys = new Set([]),
	onSelectedChange = () => {},
	onPageSizeChange,
}) {
	const [sortDescriptor, setSortDescriptor] = useState({
		column: "age",
		direction: "ascending",
	});

	const sortedItems = useMemo(() => {
		return [...data]?.sort((a, b) => {
			const first = a[sortDescriptor.column];
			const second = b[sortDescriptor.column];
			let cmp = first < second ? -1 : first > second ? 1 : 0;

			if (Number(first) == String(first) && Number(second) == String(second)) {
				cmp = first - second;
			}

			return sortDescriptor.direction === "descending" ? -cmp : cmp;
		});
	}, [data, sortDescriptor]);

	const bottomContent = useMemo(() => {
		const totalPages = Math.ceil(total / Number([...pageSize][0]));

		const options = [
			{label: "10", value: "10"},
			{label: "20", value: "20"},
			{label: "30", value: "30"},
			{label: "50", value: "50"},
			{label: "100", value: "100"},
		];

		return (
			<div className="py-2 px-2 flex justify-between items-center">
				<div className="flex gap-6">
					<Select
						label=""
						variant="bordered"
						classNames={{
							label: "group-data-[filled=true]:-translate-y-5",
							base: "w-24",
							value: "text-gray-300",
							trigger:
								"min-h-7 h-9 border data-[focus=true]:border-[#35d1f5] data-[open=true]:border-[#35d1f5] data-[open=true]:shadow-[0rem_0rem_0rem_0.125rem_rgba(129,_227,_249,_1)] shadow-none",
						}}
						listboxProps={{
							itemClasses: {
								base: [
									"rounded-md",
									"text-default-500",
									"transition-opacity",
									"data-[hover=true]:text-foreground",
									"data-[hover=true]:bg-default-100",
									"dark:data-[hover=true]:bg-default-50",
									"data-[selectable=true]:focus:bg-default-50",
									"data-[pressed=true]:opacity-70",
									"data-[focus-visible=true]:ring-default-500",
								],
							},
						}}
						popoverProps={{
							classNames: {
								base: "before:bg-default-200",
								content: "w-24",
							},
						}}
						isMultiline={true}
						selectionMode="single"
						items={options || []}
						selectedKeys={pageSize}
						onSelectionChange={onPageSizeChange}
					>
						{(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
					</Select>
					<span className="text-small text-default-400">
						{selectionMode === "single"
							? ""
							: selectedKeys === "all"
							? "Đã chọn tất cả"
							: `${selectedKeys?.size} trên ${total} được chọn`}
					</span>
				</div>
				<Pagination
					showControls
					color="primary"
					page={page}
					total={totalPages || 1}
					variant="light"
					onChange={onPageChange}
				/>
			</div>
		);
	}, [
		total,
		pageSize,
		page,
		onPageChange,
		onPageSizeChange,
		selectionMode,
		selectedKeys,
	]);

	return (
		<Table
			color="default"
			aria-label="Example table with custom cells"
			fullWidth
			classNames={{
				base: "",
				wrapper: "max-h-[65vh] min-h-[200px] bg-transparent shadow-wrapper",
				th: "uppercase text-center bg-primary text-white text-base font-medium",
				td: "py-4 group-aria-[selected=false]:group-data-[hover=true]:before:bg-gray-500/60",
			}}
			isHeaderSticky
			bottomContentPlacement="outside"
			// topContentPlacement="outside"
			bottomContent={bottomContent}
			sortDescriptor={sortDescriptor}
			onSortChange={setSortDescriptor}
			selectionMode={selectionMode}
			selectedKeys={selectedKeys}
			onSelectionChange={onSelectedChange}
			// onCellAction={onCellAction}
		>
			<TableHeader columns={columns}>
				{(column) => (
					<TableColumn
						key={column._id}
						className={`${column._id === "actions" && "w-36 text-center"}`}
						allowsSorting={column.sortable}
					>
						{column.name}
					</TableColumn>
				)}
			</TableHeader>
			<TableBody
				items={sortedItems}
				emptyContent={!isLoading ? "Không có dữ liệu" : ""}
				isLoading={isLoading}
				loadingContent={<Spinner size="lg" color="primary" />}
			>
				{(item) => (
					<TableRow key={item._id}>
						{(columnKey) => (
							<TableCell>{renderCell(item, columnKey)}</TableCell>
						)}
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}

export default memo(TableNextUI);
