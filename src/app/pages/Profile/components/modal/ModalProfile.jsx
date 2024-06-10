import { yupResolver } from "@hookform/resolvers/yup";
import RenderFormData from "app/components/RenderFormData/RenderFormData";
import { useForm } from "react-hook-form";
import NotifyMessage from "_utils/notify";
import CustomModal from "app/components/Modal/CustomModal";
import { URL_IMAGE } from "_constants";
import MyUploadFile from "app/components/MyUploadFile/MyUploadFile";
import { Avatar, Badge } from "@nextui-org/react";
import { useEffect } from "react";
import { profileSchema } from "_utils/validation";
import { updateUserById } from "services/api.service";
import { dateToUtcTimestamp } from "_utils";
import moment from "moment";
import { useDispatch } from "react-redux";
import { handleUpdateUserData } from "_redux/slice/authSlice";

const ModalProfile = ({ isOpen, onClose, onOpenChange, userData }) => {
	const dispatch = useDispatch();
	const {
		handleSubmit,
		watch,
		control,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: {
			name: "",
			firstName: "",
			lastName: "",
			phoneNumber: "",
			birthday: moment().format("YYYY-MM-DD"),
			address: "",
			bio: "",
			avatar: "",
		},
		resolver: yupResolver(profileSchema),
	});

	const listData = [
		{
			label: "Họ và tên",
			name: "name",
			kind: "input",
			placeholder: "Nhập họ và tên",
			width: "col-span-6",
		},

		{
			label: "Số điện thoại",
			name: "phoneNumber",
			kind: "input",
			placeholder: "Nhập số điện thoại",
			width: "col-span-6",
		},

		{
			label: "Ngày Sinh",
			name: "birthday",
			kind: "input",
			placeholder: "Nhập ngày sinh",
			type: "date",
			width: "col-span-6",
		},
		{
			label: "Địa Chỉ",
			name: "address",
			kind: "input",
			placeholder: "Nhập địa chỉ",
			width: "col-span-6",
		},
		{
			label: "Tiểu sử",
			name: "bio",
			kind: "textarea",
			placeholder: "Nhập tiểu sử",
			width: "col-span-12",
		},
		{
			label: "Ảnh đại diện",
			name: "avatar",
			kind: "input",
			placeholder: "Nhập ảnh đại diện",
			width: "col-span-12",
		},
	];

	const getAvatar = watch("avatar");

	const onSubmit = handleSubmit(async (values) => {
		try {
			const data = await updateUserById(userData?._id, {
				...values,
				role: userData.role,

				birthday: dateToUtcTimestamp(values?.birthday),
			});

			if (data?.data?.status === 1) {
				NotifyMessage("Thêm bài viết thành công", "success");

				dispatch(handleUpdateUserData(data?.data?.data));
				onClose();
			} else {
				NotifyMessage("Thêm bài viết thất bại", "error");
			}
		} catch (error) {
			console.log("error", error);
			NotifyMessage("Có lỗi xảy ra", "error");
		}
	});

	useEffect(() => {
		if (userData) {
			const data = {
				name: userData?.name,
				phoneNumber: userData?.phoneNumber,
				birthday: moment(userData?.birthday).format("YYYY-MM-DD"),
				address: userData?.address,
				bio: userData?.bio,
				avatar: userData?.avatar,
			};
			Object.keys(data).forEach((key) => {
				setValue(key, data[key]);
			});
		}
	}, [userData]);
	return (
		<CustomModal
			title={"Cập nhật lý lịch"}
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			onSubmit={onSubmit}
		>
			<div className="grid grid-cols-12 gap-4">
				{listData?.map((item) => {
					if (item?.name === "avatar") {
						return (
							<div className={item?.width}>
								<MyUploadFile
									control={control}
									name="avatar"
									errorMessage={
										errors?.avatar
											? errors?.avatar?.message
											: undefined
									}
								/>
								{getAvatar && (
									<div className="mt-2">
										<Badge
											content="x"
											className="cursor-pointer"
											color="primary"
											onClick={() => {
												setValue("avatar", "");
											}}
										>
											<Avatar
												radius="md"
												size="lg"
												classNames={{
													base: "w-24 h-24",
												}}
												src={
													typeof getAvatar ===
													"string"
														? `${URL_IMAGE}/${getAvatar}`
														: URL.createObjectURL(
																getAvatar
														  )
												}
											/>
										</Badge>
									</div>
								)}
							</div>
						);
					} else {
						return (
							<div className={item?.width}>
								<RenderFormData
									item={item}
									control={control}
									errors={errors}
								/>
							</div>
						);
					}
				})}
			</div>
		</CustomModal>
	);
};

export default ModalProfile;
