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
import {URL_IMAGE} from "_constants";

import TableNextUI from "app/components/TableNextUI";

import moment from "moment";

import {LiaEditSolid} from "react-icons/lia";

import ModalDeleteMutiOrOne from "../../../components/Modal/ModalDelete";

import {FaTrash} from "react-icons/fa";

import {deletesSeoProject} from "../../../../services/api.service";

import {GetPagingSeoProject} from "../../../../_redux/slice/seoProjectSlice";
import ModalSeoProject from "./ModalSeoProject";

// const PAGE_SIZE = 10;

function TableSeoProjectList({
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
		(state) => state?.seoProject || []
	);

	const [pgSize] = [...pageSize];
	useEffect(() => {
		onGetPaging({pageIndex, pgSize});
	}, [pageIndex, pgSize]);

	const columns = [
		{name: "Tiêu đề", _id: "title"},
		{name: "Ảnh", _id: "images"},
		{name: "Loại SeoProject", _id: "type"},
		{name: "Mô tả", _id: "description"},
		{name: "Nội dung", _id: "content"},
		{name: "Trạng thái", _id: "status"},
		{name: "Người tạo", _id: "user"},
		{name: "Ngày tạo", _id: "createdAt"},
		{name: "Hành động", _id: "actions"},
	];

	const renderCell = useCallback((item, columnKey) => {
		const cellValue = item[columnKey];

		switch (columnKey) {
			case "title":
				return <p className="line-clamp-2 text-white">{cellValue}</p>;

			case "images":
				return (
					<AvatarGroup isBordered max={5}>
						{cellValue?.map((avt, index) => (
							<Avatar key={index} src={`${URL_IMAGE}/${avt}`} />
						))}
					</AvatarGroup>
				);

			case "type":
				return <p className="line-clamp-2 text-white">{cellValue}</p>;

			case "description":
				return (
					<p
						className="line-clamp-2 text-white"
						dangerouslySetInnerHTML={{__html: cellValue}}
					/>
				);

			case "content":
				return (
					<p
						className="line-clamp-2 text-white"
						dangerouslySetInnerHTML={{__html: cellValue}}
					/>
				);

			case "status":
				return (
					<div className="flex items-center justify-center">
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
				return <p className="text-white">{cellValue?.username}</p>;

			case "createdAt":
				return (
					<p className="text-white">{moment(cellValue).format("DD/MM/YYYY")}</p>
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
		const checkPage = (totalDoc - listIdSelected?.length) / pgSize;
		if (checkPage <= tempPageIndex - 1) tempPageIndex -= 1;
		if (tempPageIndex <= 0) tempPageIndex = 1;
		dispatch(
			GetPagingSeoProject({
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
				/>
			</div>
			{isOpenAddEdit && (
				<ModalSeoProject
					itemId={itemId}
					isOpen={isOpenAddEdit}
					onClose={onCloseAddEdit}
					onOpenChange={onOpenChangeAddEdit}
					onGetPaging={({pageIndex, pgSize}) => {
						dispatch(GetPagingSeoProject({pageIndex, pgSize}));
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
				funcDelete={deletesSeoProject}
				bodyMsg={
					listIdSelected?.length !== 1
						? "Bạn có chắc chắn muốn xóa các nhóm đã chọn?"
						: "Bạn có chắc chắn muốn xóa nhóm này?"
				}
			/>
		</>
	);
}

export default TableSeoProjectList;
