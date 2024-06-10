import {Avatar, Button, useDisclosure} from "@nextui-org/react";
import {useSelector} from "react-redux";
import ModalProfile from "./components/modal/ModalProfile";
import {URL_IMAGE} from "_constants";
import moment from "moment";

const Profile = () => {
	const {userData} = useSelector((state) => state.auth);
	const {
		isOpen: isOpenAddEdit,
		onOpen: onOpenAddEdit,
		onClose: onCloseAddEdit,
		onOpenChange: onOpenChangeAddEdit,
	} = useDisclosure();

	return (
		<>
			<div className="flex flex-col mt-28">
				<div className="max-w-screen-lg bg-white rounded-lg h-fit w-full  mx-auto p-5">
					<div className="border-b border-gray-100 pb-4 flex items-center justify-between">
						<div>
							<h5 className="text-xl font-semibold">Hồ Sơ Của Tôi</h5>
							<p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
						</div>
						<Button color="primary" onClick={onOpenAddEdit}>
							<i className="fas fa-edit"></i> Chỉnh sửa
						</Button>
					</div>
					<div className="grid grid-cols-12 gap-5 pt-4">
						<div className="col-span-9 flex flex-col gap-4">
							<div className="flex items-center gap-2">
								<label
									htmlFor=""
									className="text-right capitalize font-semibold w-[200px]"
								>
									tên đăng nhập :
								</label>
								<span>{userData?.username}</span>
							</div>
							<div className="flex items-center gap-2">
								<label
									htmlFor=""
									className="text-right capitalize font-semibold w-[200px]"
								>
									họ và tên :
								</label>
								<span>{userData?.name}</span>
							</div>

							<div className="flex items-center gap-2">
								<label
									htmlFor=""
									className="text-right capitalize font-semibold w-[200px]"
								>
									số điện thoại :
								</label>
								<span>
									{userData?.phoneNumber
										? userData?.phoneNumber
										: "Chưa cập nhật"}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<label
									htmlFor=""
									className="text-right capitalize font-semibold w-[200px]"
								>
									Ngày sinh :
								</label>
								<span>
									{userData?.birthday
										? moment(userData?.birthday).format("YYYY-MM-DD")
										: "Chưa cập nhật"}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<label
									htmlFor=""
									className="text-right capitalize font-semibold w-[200px]"
								>
									Địa chỉ :
								</label>
								<span>
									{userData?.address ? userData?.address : "Chưa cập nhật"}
								</span>
							</div>
							<div className="flex  gap-2">
								<label
									htmlFor=""
									className="text-right capitalize font-semibold w-[200px] flex-shrink-0"
								>
									Tiểu sử :
								</label>
								<p>{userData?.bio ? userData?.bio : "Chưa cập nhật"}</p>
							</div>
						</div>
						<div className="col-span-5 border-l flex flex-col gap-4 items-center justify-center">
							<div className="w-[150px] h-[150px]">
								<Avatar
									className="w-full h-full rounded-full"
									src={
										userData?.avatar ? URL_IMAGE + "/" + userData?.avatar : ""
									}
								/>
							</div>

							<p className="w-[200px] text-sm">
								Dụng lượng file tối đa 5 MB Định dạng:.JPEG, .PNG
							</p>
						</div>
					</div>
				</div>
			</div>
			{isOpenAddEdit && (
				<ModalProfile
					isOpen={isOpenAddEdit}
					onClose={onCloseAddEdit}
					onOpenChange={onOpenChangeAddEdit}
					userData={userData}
				/>
			)}
		</>
	);
};

export default Profile;
