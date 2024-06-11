import {useDisclosure} from "@nextui-org/react";
import {useState} from "react";
import {useDispatch} from "react-redux";
import Header from "../../components/Header/Header";
import TableBlogList from "./components/TableBlogList";
import {GetPagingSeo} from "../../../_redux/slice/seoSlice";
import TableSeoList from "./components/TableSeoList";

function Seo() {
	const dispatch = useDispatch();
	const [search, setSearch] = useState("");
	const [itemId, setItemId] = useState("");

	const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
	const {
		isOpen: isOpenAddEdit,
		onOpen: onOpenAddEdit,
		onClose: onCloseAddEdit,
		onOpenChange: onOpenChangeAddEdit,
	} = useDisclosure();
	const handleOpenAddEdit = () => {
		onOpenAddEdit();
		setItemId("");
	};
	const handleGetPagination = ({pageIndex, pgSize}) => {
		dispatch(
			GetPagingSeo({
				pageIndex: pageIndex || 1,
				pageSize: pgSize || 10,
				search: "",
			})
		);
	};

	return (
		<>
			<div className="flex flex-col pt-[120px] md:pt-[75px]">
				<Header
					onOpenAddEdit={handleOpenAddEdit}
					onOpenDelete={() => {
						setIsOpenModalDelete(!isOpenModalDelete);
					}}
					listIds={[]}
					onSearch={setSearch}
					placeholder="Tìm kiếm tên nhóm..."
				/>
				<TableSeoList
					isOpenAddEdit={isOpenAddEdit}
					onOpenAddEdit={onOpenAddEdit}
					onCloseAddEdit={onCloseAddEdit}
					onOpenChangeAddEdit={onOpenChangeAddEdit}
					onGetPaging={handleGetPagination}
					isOpenModalDelete={isOpenModalDelete}
					setIsOpenModalDelete={setIsOpenModalDelete}
					itemId={itemId}
					setItemId={setItemId}
				/>
			</div>
		</>
	);
}

export default Seo;
