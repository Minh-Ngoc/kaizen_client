import {useDisclosure} from "@nextui-org/react";

import Header from "../../components/Header/Header";

import {useState} from "react";
import TableBlogList from "./components/TableBlogList";

function Blog() {
	const [search, setSearch] = useState("");
	const [itemId, setItemId] = useState("");

	const [listIds, setListIds] = useState([]);

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

	return (
		<>
			<div className="flex flex-col mt-24">
				<Header
					onOpenAddEdit={handleOpenAddEdit}
					onOpenDelete={() => {
						setIsOpenModalDelete(!isOpenModalDelete);
					}}
					listIds={listIds}
					onSearch={setSearch}
					placeholder="Tìm kiếm tên..."
				/>
				<TableBlogList
					isOpenAddEdit={isOpenAddEdit}
					onOpenAddEdit={onOpenAddEdit}
					onCloseAddEdit={onCloseAddEdit}
					onOpenChangeAddEdit={onOpenChangeAddEdit}
					isOpenModalDelete={isOpenModalDelete}
					setIsOpenModalDelete={setIsOpenModalDelete}
					itemId={itemId}
					setItemId={setItemId}
					search={search}
					setListIds={setListIds}
					listIds={listIds}
				/>
			</div>
		</>
	);
}

export default Blog;
