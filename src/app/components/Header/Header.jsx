import {useState} from "react";
import {IoSearchSharp} from "react-icons/io5";
import {BiPlus, BiTrash} from "react-icons/bi";
import {Button, Input} from "@nextui-org/react";

const Header = ({
	onOpenAddEdit,
	onOpenDelete,
	listIds,
	onSearch,
	placeholder,
}) => {
	const [search, setSearch] = useState("");

	return (
		<div className="mb-16 flex flex-row justify-between items-center p-6 rounded-lg shadow-wrapper bg-table">
			<div className="max-w-[220px] flex items-center gap-2">
				<Button
					variant="solid"
					color={"success"}
					className="rounded-md min-w-32 text-white font-bold text-xs tracking-wide"
					startContent={<BiPlus className="text-white min-w-max min-h-max" />}
					onClick={onOpenAddEdit}
				>
					Thêm mới
				</Button>
				<Button
					variant="solid"
					color={"danger"}
					className="rounded-md min-w-32 text-white font-bold text-xs tracking-wide"
					startContent={<BiTrash className="text-white min-w-max min-h-max" />}
					onClick={onOpenDelete}
					isDisabled={listIds?.length === 0}
				>
					Xóa
				</Button>
			</div>
			<div className="flex flex-row justify-center items-center gap-2">
				<Input
					size="md"
					variant="bordered"
					placeholder={placeholder}
					classNames={{
						inputWrapper:
							"rounded-md py-2 data-[hover=true]:border-primary-400 group-data-[focus=true]:border-primary-400 group-data-[focus=true]:border-2 group-data-[focus=true]:border-primary-400",
						label: "hidden",
						input: "text-sm text-task-title placeholder:text-default-300/70 tracking-wide",
					}}
					onValueChange={setSearch}
					onKeyDown={(e) => {
						if (e.key === "Enter") onSearch(search);
					}}
				/>

				<Button
					variant="solid"
					color={"primary"}
					className="rounded-md min-w-32 text-white font-bold text-xs mr-5 tracking-wide"
					startContent={
						<IoSearchSharp className="text-white min-w-max min-h-max" />
					}
					onClick={() => onSearch(search)}
				>
					Tìm kiếm
				</Button>
			</div>
		</div>
	);
};

export default Header;
