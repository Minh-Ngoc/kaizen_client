import { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import RenderFormData from "app/components/RenderFormData/RenderFormData";
import { useForm } from "react-hook-form";
import { addSeoProject } from "services/api.service";
import NotifyMessage from "_utils/notify";
import CustomModal from "app/components/Modal/CustomModal";
import { seoProjectSchema } from "_utils/validation";
import slugify from "slugify";
import TinyMCE from "app/components/TinyMCE";
import { updateSeoProject } from "services/api.service";
import { getSeoProjectById } from "services/api.service";
import { URL_IMAGE } from "_constants";
import MyUploadFile from "app/components/MyUploadFile/MyUploadFile";
import { Avatar, Badge } from "@nextui-org/react";

const ModalSeoProject = ({
	isOpen,
	onClose,
	itemId,
	onOpenChange,
	onGetPaging,
}) => {
	const getItemData = async (id) => {
		const res = await getSeoProjectById(id);
		const data = res.data?.result;
		setValue("title", data?.title);
		setValue("description", data?.description);
		setValue("content", data?.content);
		setValue("keyword", data?.keyword);
		setValue("slug", data?.slug);
		setValue("isHot", data?.isHot);
		setValue("type", data?.type);
		setValue("images", data?.images);
		setValue("altThumbnail", data?.altThumbnail);
		setValue("status", data?.status);
	};

	useEffect(() => {
		if (itemId) {
			getItemData(itemId);
		}
	}, [itemId]);

	const {
		handleSubmit,
		watch,
		control,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: {
			title: "",
			description: "",
			slug: "",
			images: [],
			altThumbnail: "",
			type: "",

			isHot: false,
			status: "pending",
		},
		resolver: yupResolver(seoProjectSchema),
	});

	const listData = [
		{
			label: "Tiêu đề",
			name: "title",
			kind: "input",
			placeholder: "Nhập tiêu đề",
			width: "col-span-6",
		},
		{
			label: "slug",
			name: "slug",
			kind: "input",
			placeholder: "Nhập slug",
			width: "col-span-6",
		},
		{
			label: "status",
			name: "status",
			kind: "select",
			placeholder: "Nhập trạng thái",
			width: "col-span-6",
			children: (
				<>
					<option value="pending">Chờ duyệt</option>
					<option value="approved">Đã duyệt</option>
					<option value="rejected">Từ chối</option>
				</>
			),
		},
		{
			label: "Loại dự án seo",
			name: "type",
			kind: "select",
			children: (
				<>
					<option value="789bet">789bet</option>
					<option value="jun88">jun88</option>
					<option value="mb66">mb66</option>
					<option value="new88">new88</option>
					<option value="hi88">hi88</option>
				</>
			),
			width: "col-span-6",
		},
		{
			label: "keyword",
			name: "keyword",
			kind: "input",
			placeholder: "Nhập keyword",
			width: "col-span-12",
		},
		{
			label: "mô tả",
			name: "description",
			kind: "textarea",
			placeholder: "Nhập mô tả",
			width: "col-span-12",
		},
		{
			label: "Nội dung",
			name: "content",
			kind: "input",
			placeholder: "Nhập nội dung",
			width: "col-span-12",
		},

		{
			label: "Hình ảnh",
			name: "images",
			kind: "input",
			placeholder: "Nhập hình ảnh",
			width: "col-span-12",
		},

		{
			label: "",
			name: "isHot",
			kind: "switch",
			children: watch("isHot") ? "Nổi bật" : "Bình thường",
			width: "col-span-3",
		},
	];
	const handleOnChangeInput = (value) => {
		setValue("content", value);
	};
	const getTitle = watch("title");

	const getImages = watch("images");

	useEffect(() => {
		const slug = slugify(getTitle || "", {
			replacement: "-", // replace spaces with replacement character, defaults to `-`
			remove: undefined, // remove characters that match regex, defaults to `undefined`
			lower: true, // convert to lower case, defaults to `false`
			strict: false, // strip special characters except replacement, defaults to `false`
			locale: "vi", // language code of the locale to use
			trim: true, // trim leading and trailing replacement chars, defaults to `true`
		});

		setValue("slug", slug);
	}, [getTitle]);
	const onSubmit = handleSubmit(async (values) => {
		try {
			if (itemId) {
				const data = await updateSeoProject(itemId, values);
				if (data?.data?.status === 1) {
					NotifyMessage("Cập nhật bài viết thành công", "success");
					onClose();
					onGetPaging("");
				} else {
					NotifyMessage("Cập nhật bài viết thất bại", "error");
				}
			} else {
				const data = await addSeoProject(values);
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

	return (
		<CustomModal
			title={itemId ? "Cập nhật bài viết" : "Thêm bài viết"}
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			onSubmit={onSubmit}
		>
			<div className="grid grid-cols-12 gap-4">
				{listData?.map((item, index) => {
					if (item?.name === "content") {
						return (
							<div key={index} className={item?.width}>
								<label className="block capitalize mb-2 text-sm font-semibold text-gray-900">
									{item.label}
								</label>
								<TinyMCE
									value={watch("content")}
									onEditorChange={(value) =>
										handleOnChangeInput(value)
									}
									height="400px"
								/>
							</div>
						);
					} else if (item?.name === "images") {
						return (
							<div key={index} className={item?.width}>
								<MyUploadFile
									control={control}
									name="images"
									isMulti={true}
									errorMessage={
										errors?.images
											? errors?.images?.message
											: undefined
									}
								/>
								{getImages?.length > 0 && (
									<div className="mt-2 flex items-center gap-2">
										{getImages.map((item, index) => (
											<div key={index}>
												<Badge
													content="x"
													className="cursor-pointer"
													color="primary"
													onClick={() => {
														const newImages =
															getImages.filter(
																(_, idx) =>
																	idx !==
																	index
															);
														setValue(
															"images",
															newImages
														);
													}}
												>
													<Avatar
														radius="md"
														size="lg"
														classNames={{
															base: "w-24 h-24",
														}}
														src={
															typeof item ===
															"string"
																? `${URL_IMAGE}/${item}`
																: URL.createObjectURL(
																		item
																)
														}
													/>
												</Badge>
											</div>
										))}
									</div>
								)}
							</div>
						);
					} else {
						return (
							<div key={index} className={item?.width}>
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

export default ModalSeoProject;
