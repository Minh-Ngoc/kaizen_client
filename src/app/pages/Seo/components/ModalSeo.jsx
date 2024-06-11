import {useEffect, useState} from "react";
import {yupResolver} from "@hookform/resolvers/yup";
import RenderFormData from "app/components/RenderFormData/RenderFormData";
import {useForm} from "react-hook-form";
import {addSeo} from "services/api.service";
import NotifyMessage from "_utils/notify";
import CustomModal from "app/components/Modal/CustomModal";

import {updateSeo} from "services/api.service";
import {getSeoById} from "services/api.service";
import {v4 as uuidv4} from "uuid";
import {FaRegTrashAlt} from "react-icons/fa";
import {Button} from "@nextui-org/react";

import MyInput from "app/components/MyInput/MyInput";
import {generateSchema} from "_utils/validation";
import {BiPlus} from "react-icons/bi";

const ModalSeo = ({isOpen, onClose, itemId, onOpenChange, onGetPaging}) => {
	const [numTags, setNumTags] = useState(() => {
		if (itemId) {
			return [];
		} else {
			const id = uuidv4();
			return [
				{
					id,
					value: "",
				},
			];
		}
	});

	const getNewData = async (id) => {
		const res = await getSeoById(id);

		const data = res.data?.result;
		setValue("link", data?.link);
		const tags = data?.tags;
		const newTags = tags.map((item) => {
			const id = uuidv4();
			return {
				id,
				value: item,
			};
		});
		newTags.forEach((item) => {
			setValue(item?.id, item?.value);
		});
		setNumTags(newTags);
	};

	useEffect(() => {
		if (itemId) {
			getNewData(itemId);
		}
	}, [itemId]);

	const {
		handleSubmit,
		control,
		unregister,
		setValue,
		formState: {errors, isSubmitting},
	} = useForm({
		defaultValues: {
			link: "",
		},
		resolver: yupResolver(generateSchema(numTags)),
	});

	const listData = [
		{
			label: "link (ex: /gioi-thieu)",
			name: "link",
			kind: "input",
			placeholder: "Nhập link",
			width: "col-span-12",
			isRequired: true,
		},
	];

	const handleAddInput = () => {
		const id = uuidv4();
		setNumTags((prev) => [
			...prev,
			{
				id,
				value: "",
			},
		]);
	};
	const onSubmit = handleSubmit(async (values) => {
		const {link, ...rest} = values;
		const tags = Object.values(rest);

		const newData = {
			link,
			tags,
		};

		try {
			if (itemId) {
				const data = await updateSeo(itemId, newData);
				if (data?.data?.status === 1) {
					NotifyMessage("Cập nhật bài viết thành công", "success");
					onClose();
					onGetPaging("");
				} else {
					NotifyMessage("Cập nhật bài viết thất bại", "error");
				}
			} else {
				const data = await addSeo(newData);
				if (data?.data?.status === 1) {
					NotifyMessage("Thêm bài viết thành công", "success");
					onClose();

					onGetPaging("");
				} else {
					NotifyMessage("Thêm bài viết thất bại", "error");
				}
			}
		} catch (error) {
			NotifyMessage("Có lỗi xảy ra", "error");
		}
	});
	const handleRemoveInput = (id) => {
		setNumTags((prev) => prev.filter((item) => item.id !== id));
		unregister(id);
	};
	return (
		<CustomModal
			title={itemId ? "Cập nhật seo" : "Thêm seo"}
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			onSubmit={onSubmit}
		>
			<div className="grid grid-cols-12 gap-4">
				{listData?.map((item, index) => {
					return (
						<div key={index} className={item?.width}>
							<RenderFormData item={item} control={control} errors={errors} />
						</div>
					);
				})}
				<div className="col-span-12 flex flex-col">
					<label className="flex items-center gap-1 capitalize text-sm font-semibold text-gray-900">
						Thẻ
						<span className="text-red-500 font-normal">(*)</span>
					</label>
					{numTags?.map((item, index) => (
						<div key={index} className="flex items-center gap-2 mb-2 ">
							<div className="flex-1">
								<MyInput
									control={control}
									name={item?.id}
									type="text"
									id={item?.id}
									placeholder="Nhập value"
									label={item.label}
									errorMessage={
										errors[item?.id] ? errors[item?.id].message : undefined
									}
								/>
							</div>
							{numTags?.length > 1 && (
								<span
									className="bg-red-500 text-white p-2 rounded-md cursor-pointer"
									onClick={() => handleRemoveInput(item?.id)}
								>
									<FaRegTrashAlt />
								</span>
							)}
						</div>
					))}
					<Button
						color="primary"
						variant="bordered"
						startContent={<BiPlus />}
						onClick={handleAddInput}
						type="button"
						className="w-fit"
					>
						Thêm thẻ
					</Button>
				</div>
			</div>
		</CustomModal>
	);
};

export default ModalSeo;
