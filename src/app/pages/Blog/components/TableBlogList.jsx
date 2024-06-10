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
import {FaRegTrashCan} from "react-icons/fa6";

import {LiaEditSolid} from "react-icons/lia";

import ModalDeleteMutiOrOne from "../../../components/Modal/ModalDelete";

import {FaTrash} from "react-icons/fa";
import ModalBlog from "./ModalBlog";
import {GetPagingBlog} from "../../../../_redux/slice/blogSlice";
import {deletesBlog} from "../../../../services/api.service";

// const PAGE_SIZE = 10;
const typeBlog = {
	experience: "Kinh nghiệm",
	tool: "Công cụ",
	life: "Đời sống",
};
function TableBlogList({
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
		(state) => state?.blog || []
	);

	const [pgSize] = [...pageSize];
	useEffect(() => {
		onGetPaging({pageIndex, pgSize});
	}, [pageIndex, pgSize]);

	const columns = [
		{name: "Tiêu đề", _id: "title"},
		{name: "Ảnh", _id: "images"},
		{name: "Loại blog", _id: "type"},
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
						{cellValue?.map((item, index) => (
							<Avatar key={index} src={`${URL_IMAGE}/${item}`} />
						))}
					</AvatarGroup>
				);

			case "type":
				return <p className="text-nowrap text-white">{typeBlog[cellValue]}</p>;

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
			GetPagingBlog({
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
				<ModalBlog
					itemId={itemId}
					isOpen={isOpenAddEdit}
					onClose={onCloseAddEdit}
					onOpenChange={onOpenChangeAddEdit}
					onGetPaging={({pageIndex, pgSize}) => {
						dispatch(GetPagingBlog({pageIndex, pgSize}));
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
				funcDelete={deletesBlog}
				bodyMsg={
					listIdSelected?.length !== 1
						? "Bạn có chắc chắn muốn xóa các nhóm đã chọn?"
						: "Bạn có chắc chắn muốn xóa nhóm này?"
				}
			/>
		</>
	);
}

export default TableBlogList;