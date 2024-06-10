import * as yup from "yup";

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

const newSchema = yup.object({
	title: yup.string().required("không được để trống"),

	thumbnail: yup
		.mixed()
		.test("File is required", "không được để trống ", (value) => value)
		.test("Type", " Không đúng định dạng ảnh (jpg, jpeg,png)", (value) => {
			return typeof value === "string"
				? true
				: value && SUPPORTED_FORMATS.includes(value?.type);
		})
		.test("Size", "kích thuớc file không được vượt quá 5MB", (value) => {
			return typeof value === "string" ? true : value && value?.size <= 5000000;
		}),

	description: yup.string().required("không được để trống"),
	keyword: yup.string().required("không được để trống"),
	status: yup.string().required("không được để trống"),
});
const brandSchema = yup.object({
	name: yup.string().required("không được để trống"),
});
const kpiBonusSchema = yup.object({
	name: yup.string().required("không được để trống"),
	level: yup.array().of(
		yup.object({
			levelName: yup.string().required("không được để trống"),
			volume: yup.string().required("không được để trống"),
			top: yup.string().required("không được để trống"),
			customer: yup.string().required("không được để trống"),
			totalDeposit: yup.string().required("không được để trống"),
			award: yup.string().required("không được để trống"),
		})
	),
});
const teamSchema = yup.object({
	name: yup.string().required("không được để trống"),
	leaders: yup
		.array()
		.required("không được để trống")
		.min(1, "không được để trống"),
});

const blogSchema = yup.object({
	title: yup.string().required("không được để trống"),

	images: yup
		.array()
		.required("không được để trống")
		.min(1, "không được để trống")
		.test("Type", " Không đúng định dạng ảnh (jpg, jpeg,png)", (value) => {
			if (typeof value[0] === "string") return true;
			return value.every((item) => SUPPORTED_FORMATS.includes(item?.type));
		})
		.test("Size", "kích thuớc file không được vượt quá 5MB", (value) => {
			if (typeof value[0] === "string") return true;
			return value.every((item) => item?.size <= 5000000);
		}),
	type: yup.string().required("không được để trống"),

	description: yup.string().required("không được để trống"),
	keyword: yup.string().required("không được để trống"),
	status: yup.string().required("không được để trống"),
});
const activitySchema = yup.object({
	title: yup.string().required("không được để trống"),

	images: yup
		.array()
		.required("không được để trống")
		.min(1, "không được để trống")
		.test("Type", " Không đúng định dạng ảnh (jpg, jpeg,png)", (value) => {
			if (typeof value[0] === "string") return true;
			return value.every((item) => SUPPORTED_FORMATS.includes(item?.type));
		})
		.test("Size", "kích thuớc file không được vượt quá 5MB", (value) => {
			if (typeof value[0] === "string") return true;
			return value.every((item) => item?.size <= 5000000);
		}),
	description: yup.string().required("không được để trống"),
	keyword: yup.string().required("không được để trống"),
	status: yup.string().required("không được để trống"),
});
const seoProjectSchema = yup.object({
	title: yup.string().required("không được để trống"),

	images: yup
		.array()
		.required("không được để trống")
		.min(1, "không được để trống")
		.test("Type", " Không đúng định dạng ảnh (jpg, jpeg,png)", (value) => {
			if (typeof value[0] === "string") return true;
			return value.every((item) => SUPPORTED_FORMATS.includes(item?.type));
		})
		.test("Size", "kích thuớc file không được vượt quá 5MB", (value) => {
			if (typeof value[0] === "string") return true;
			return value.every((item) => item?.size <= 5000000);
		}),
	type: yup.string().required("không được để trống"),
	description: yup.string().required("không được để trống"),
	keyword: yup.string().required("không được để trống"),
	status: yup.string().required("không được để trống"),
});
const profileSchema = yup.object({
	name: yup.string().required("không được để trống"),
	// can empty phonenumber
	phoneNumber: yup
		.string()
		.test("phoneNumber", "Số điện thoại không hợp lệ", (value) =>
			value ? /^[0-9]{10}$/.test(value) : true
		),

	// if avatar is existed then it will be tested, otherwise it will be ignored
	avatar: yup
		.mixed()
		.test("avatar", "Không đúng định dạng ảnh (jpg, jpeg, png)", (value) => {
			if (!value || typeof value === "string") return true;
			return SUPPORTED_FORMATS.includes(value.type);
		})
		.test("avatar", "kích thuớc file không được vượt quá 5MB", (value) => {
			if (!value || typeof value === "string") return true;
			return value.size <= 5000000;
		}),
});
const generateSchema = (fields) => {
	// link: yup.string().required("không được để trống"),
	const schemaObject = {};

	// Dynamically generate schema based on user-defined fields
	fields.forEach((field) => {
		schemaObject[field.id] = yup.string().required("không được để trống"); // Define validation rules here
	});
	schemaObject.link = yup.string().required("không được để trống");

	return yup.object().shape(schemaObject);
};

export {
	newSchema,
	brandSchema,
	kpiBonusSchema,
	teamSchema,
	blogSchema,
	activitySchema,
	seoProjectSchema,
	profileSchema,
	generateSchema,
};
