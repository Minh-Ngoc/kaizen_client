import { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import RenderFormData from "app/components/RenderFormData/RenderFormData";
import { useForm } from "react-hook-form";
import { addBlog } from "services/api.service";
import NotifyMessage from "_utils/notify";
import CustomModal from "app/components/Modal/CustomModal";
import { blogSchema } from "_utils/validation";
import slugify from "slugify";
import TinyMCE from "app/components/TinyMCE";
import { updateBlog } from "services/api.service";
import { getBlogById } from "services/api.service";
import { URL_IMAGE } from "_constants";
import MyUploadFile from "app/components/MyUploadFile/MyUploadFile";
import { Avatar, Badge } from "@nextui-org/react";

const ModalBlog = ({ isOpen, onClose, itemId, onOpenChange, onGetPaging }) => {
	const getNewData = async (id) => {
		const res = await getBlogById(id);
		const data = res.data?.result;
		setValue("title", data?.title);
		setValue("description", data?.description);
		setValue("content", data?.content);
		setValue("keyword", data?.keyword);
		setValue("slug", data?.slug);

		setValue("isHot", data?.isHot);
		setValue("type", data?.type);
		setValue("images", data?.images);
		setValue("status", data?.status);

		setValue("altImages", data?.altImages);
	};

	useEffect(() => {
		if (itemId) {
			getNewData(itemId);
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
			content: "",
			status: "pending",
			slug: "",
			images: [],
			altImages: "",
			type: "",
			keyword: "",
			isActive: true,
			isHot: false,
		},
		resolver: yupResolver(blogSchema),
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
			label: "Loại blog",
			name: "type",
			kind: "select",
			children: (
				<>
					<option value="experience">kinh nghiệm</option>
					<option value="tool">Công cụ</option>
					<option value="life">Đời sống</option>
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
			label: "Nội dung",
			name: "images",
			kind: "input",
			placeholder: "Nhập nội dung",
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
				const data = await updateBlog(itemId, values);
				if (data?.data?.status === 1) {
					NotifyMessage("Cập nhật bài viết thành công", "success");
					onClose();
					onGetPaging("");
				} else {
					NotifyMessage("Cập nhật bài viết thất bại", "error");
				}
			} else {
				const data = await addBlog(values);
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
								{errors?.content && (
									<div className="text-red-500 text-sm">
										{errors?.content?.message}
									</div>
								)}
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
														const newimages =
															getImages.filter(
																(_, idx) =>
																	idx !==
																	index
															);
														setValue(
															"images",
															newimages
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

export default ModalBlog;
