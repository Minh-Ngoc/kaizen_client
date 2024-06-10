import {useDisclosure} from "@nextui-org/react";
import TableTeamList from "./components/TableTeamList";
import ModalTeam from "./components/ModalTeam";
import {useState} from "react";
import Header from "../../components/Header/Header";
import {GetPagingTeam} from "../../../_redux/slice/teamSlice";
import {useDispatch} from "react-redux";
import ModalDeleteMutiOrOne from "../../components/Modal/ModalDelete";

function Team() {
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
			GetPagingTeam({
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
				<TableTeamList
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

export default Team;
