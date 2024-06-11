import { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import RenderFormData from "app/components/RenderFormData/RenderFormData";
import { useForm } from "react-hook-form";
import { addBrand } from "services/api.service";
import NotifyMessage from "_utils/notify";
import CustomModal from "app/components/Modal/CustomModal";
import { brandSchema } from "_utils/validation";
import { updateBrand } from "services/api.service";
import { getBrandById } from "services/api.service";

const ModalBrand = ({ isOpen, onClose, itemId, onOpenChange, onGetPaging }) => {
	const getItemData = async (id) => {
		const res = await getBrandById(id);
		const data = res.data?.result;
		setValue("name", data?.name);
	};

	useEffect(() => {
		if (itemId) {
			getItemData(itemId);
		}
	}, [itemId]);

	const {
		handleSubmit,
		control,
		setValue,
		// eslint-disable-next-line no-unused-vars
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: {
			title: "",
			description: "",
			slug: "",
			images: "",
			altThumbnail: "",
			type: "",
			isActive: true,
			isHot: false,
		},
		resolver: yupResolver(brandSchema),
	});

	const listData = [
		{
			label: "Tên hậu đài",
			name: "name",
			kind: "input",
			placeholder: "Nhập tên hậu đài",
			width: "col-span-12",
		},
	];

	const onSubmit = handleSubmit(async (values) => {
		try {
			if (itemId) {
				const data = await updateBrand(itemId, values);
				if (data?.data?.status === 1) {
					NotifyMessage("Cập nhật hậu đài thành công", "success");
					onClose();
					onGetPaging("");
				} else {
					NotifyMessage("Cập nhật hậu đài thất bại", "error");
				}
			} else {
				const data = await addBrand(values);
				if (data?.data?.status === 1) {
					NotifyMessage("Thêm hậu đài thành công", "success");
					onClose();

					onGetPaging("");
				} else {
					NotifyMessage("Thêm hậu đài thất bại", "error");
				}
			}
		} catch (error) {
			NotifyMessage("Có lỗi xảy ra", "error");
		}
	});

	return (
		<CustomModal
			title={itemId ? "Cập nhật hậu đài" : "Thêm hậu đài"}
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			onSubmit={onSubmit}
		>
			<div className="grid grid-cols-12 gap-4">
				{listData?.map((item, index) => {
					return (
						<div key={index} className={item?.width}>
							<RenderFormData
								item={item}
								control={control}
								errors={errors}
							/>
						</div>
					);
				})}
			</div>
		</CustomModal>
	);
};

export default ModalBrand;
