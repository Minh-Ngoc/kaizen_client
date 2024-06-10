import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { URL_IMAGE } from "_constants";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "services/api.service";

function Profile() {
	const userData = useSelector((state) => state.auth.userData);

	return (
		<Dropdown
			placement="bottom-start"
			classNames={{
				trigger: "cursor-pointer",
				content: "rounded-md",
			}}
			disableAnimation
		>
			<DropdownTrigger>
				<div className="flex items-center gap-1">
					<div className="flex flex-row justify-center items-center gap-2">
						<div className="w-[72px] h-[72px] flex flex-row justify-center items-center relative">
							<Avatar
								src={
									userData?.avatar
										? URL_IMAGE + "/" + userData?.avatar
										: ""
								}
								isBordered
								className="w-10 h-10"
							/>
						</div>

						<p className="text-sm text-white font-bold">
							{userData?.firstName || userData?.lastName
								? `${userData?.firstName || ""} ${
										userData?.lastName || ""
                                }`
								: userData?.name
								? `${userData?.name}`
								: "(Trống)"}
						</p>
					</div>
				</div>
			</DropdownTrigger>
			<DropdownMenu aria-label="User Actions" variant="flat">
				<DropdownItem color="danger" className="rounded-md">
					<Link to="/profile">
						Tài khoản của tôi
					</Link>
				</DropdownItem>
				<DropdownItem
					color="danger"
					onClick={() => {
						setTimeout(() => {
							logout();
						}, 200);
					}}
					className="rounded-md"
				>
					<div>Đăng xuất</div>
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
}

export default Profile;
