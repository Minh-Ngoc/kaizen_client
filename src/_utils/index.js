import {format, isToday, differenceInDays} from "date-fns";
import {vi} from "date-fns/locale";

export const colorStatusTask = (position) => {
	switch (position) {
		case 1:
			return "bg-yellow-200";

		case 2:
			return "bg-blue-200";

		case 3:
			return "bg-orange-200";

		case 4:
			return "bg-green-200";

		case 5:
			return "bg-green-400 text-white";

		case 6:
			return "bg-orange-400 text-white";

		case 7:
			return "bg-yellow-400 text-white";

		case 8:
			return "bg-red-400 text-white";

		case 9:
			return "bg-slate-200";
	}
};

export const validateEmail = (email) => {
	const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
	return emailRegex.test(email);
};

export const formatDate = (date) => {
	const dateObject = new Date(date);

	const formatDate =
		dateObject.getDate() < 10
			? `0${dateObject.getDate()}`
			: dateObject.getDate();

	const formatMonth =
		dateObject.getMonth() + 1 < 10
			? `0${dateObject.getMonth() + 1}`
			: dateObject.getMonth() + 1;

	return `${formatDate}-${formatMonth}-${dateObject.getFullYear()}`;
};

export const formatFacebookDate = (date) => {
	const now = new Date();

	const inputDate = new Date(date);

	const daysDifference = differenceInDays(now, inputDate);

	if (isToday(inputDate)) {
		return format(inputDate, "HH:mm", {locale: vi});
	} else if (daysDifference < 7) {
		return format(inputDate, "EEEE, dd/MM/yyyy HH:mm", {locale: vi});
	} else {
		return format(inputDate, "'thứ' EEEE 'tuần rồi lúc' HH:mm", {locale: vi});
	}
};

export const convertObjectDataToNewDate = (value) => {
	const date = new Date(value?.year, value?.month - 1, value?.day);
	date.setHours(0, 0, 0);

	return date;
};

export const convertObjectNewDateToObject = (date) => {
	if (!date) return null;

	const newDate = new Date(date);

	// Adjust for Ho Chi Minh City's time zone (UTC+7)
	// newDate.setHours(newDate.getHours());

	// Adjust date components if necessary
	if (newDate.getHours() >= 24) {
		newDate.setDate(newDate.getDate() - 1); // Subtract one day
	}

	const day = newDate?.getDate();
	const month = newDate?.getMonth() + 1;
	const year = newDate?.getFullYear();

	return {day, month, year};
};

export const generatePlaceholderTask = (task) => {
	return {
		_id: `${task?.statusId}-placeholder-task`,
		statusId: task?.statusId,
		projectId: task.projectId,
		position: 0,
		FE_PlaceholderTask: true,
	};
};

export function dateToUtcTimestamp(date) {
	const newDate = new Date(date);
	const userTimeZoneOffset = newDate?.getTimezoneOffset();
	const utcOffsetInHours = -userTimeZoneOffset / 60;
	newDate.setHours(newDate.getHours() + utcOffsetInHours);
	return newDate.toISOString();
}
export function GetDateExactTime(isoDateString) {
	if (!isoDateString) return new Date();
	var dateParts = isoDateString?.match(
		/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})Z/
	);
	var year = parseInt(dateParts[1]);
	var month = parseInt(dateParts[2]) - 1;
	var day = parseInt(dateParts[3]);
	var hour = parseInt(dateParts[4]);
	var minute = parseInt(dateParts[5]);
	var second = parseInt(dateParts[6]);
	var millisecond = parseInt(dateParts[7]);
	return new Date(year, month, day, hour, minute, second, millisecond);
}

export function calculateRankScore(score) {
	if (score >= 8000000) {
		return {
			percent: 100,
			text: `${score?.toLocaleString()} Điểm`,
			rankText: "Cao thủ",
		};
	} else if (score >= 6000000) {
		return {
			percent: ((score - 6000000) / 2000000) * 100,
			text: `${(score - 6000000)?.toLocaleString()} / 2.000.000 Điểm (Cao Thủ)`,
			rankText: "Kim Cương",
		};
	} else if (score >= 4000000) {
		return {
			percent: ((score - 4000000) / 2000000) * 100,
			text: `${(
				score - 4000000
			)?.toLocaleString()} / 2.000.000 Điểm (Kim Cương)`,
			rankText: "Bạch Kim",
		};
	} else if (score >= 3000000) {
		return {
			percent: ((score - 3000000) / 1000000) * 100,
			text: `${(
				score - 3000000
			)?.toLocaleString()} / 1.000.000 Điểm (Bạch Kim)`,
			rankText: "Vàng",
		};
	} else if (score >= 2000000) {
		return {
			percent: ((score - 2000000) / 1000000) * 100,
			text: `${(score - 2000000)?.toLocaleString()} / 1.000.000 Điểm (Vàng)`,
			rankText: "Bạc",
		};
	} else if (score >= 1000000) {
		return {
			percent: ((score - 1000000) / 1000000) * 100,
			text: `${(score - 1000000)?.toLocaleString()} / 1.000.000 Điểm (Bạc)`,
			rankText: "Đồng",
		};
	} else if (score > 0) {
		return {
			percent: (score / 1000000) * 100,
			text: `${score?.toLocaleString()} / 1.000.000 Điểm (Đồng)`,
			rankText: "Nhôm",
		};
	} else {
		return {
			percent: 0,
			text: `${score?.toLocaleString()} / 1.000.000 Điểm (Nhôm)`,
			rankText: "Tập sự",
		};
	}
}
export function addCommas(input) {
	// Remove non-digit characters except dot
	input = input.replace(/[^0-9.]/g, "");

	// Split the number into integer and decimal parts
	let parts = input.split(".");
	let integerPart = parts[0];
	let decimalPart = parts[1] || "";

	// Add commas to the integer part
	integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

	// Combine integer part and decimal part (if any)
	if (decimalPart !== "") {
		return integerPart + "." + decimalPart;
	} else {
		return integerPart;
	}
}

export const getPriorityText = {
	normal: {text: "Bình thường", color: "primary"},
	prioritize: {text: "Ưu tiên", color: "warning"},
	urgent: {text: "Khẩn cấp", color: "danger"},
};
export const getProjectTicketText = {
	business: {text: "Business", color: "default"},
	entity: {text: "Entity", color: "default"},
	checklink_checkcontent: {
		text: "Check link và check content",
		color: "default",
	},
	vps: {text: "VPS", color: "default"},
	ctv: {text: "Cộng tác viên", color: "default"},
};
export const getResponseStatusText = {
	pending: {text: "Đang chờ", color: "warning"},
	reply: {text: "Đã phản hồi", color: "success"},
};

export const listPriority = [
	{label: "Tất cả độ ưu tiên", value: "normal"},
	{label: "Bình thường", value: "normal"},
	{label: "Ưu tiên", value: "prioritize"},
	{label: "Khẩn cấp", value: "urgent"},
];
export const listProjectTicket = [
	{label: "Tất cả dự án", value: "normal"},
	{label: "Business", value: "business"},
	{label: "Entity", value: "entity"},
	{
		label: "Check link và check content",
		value: "checklink_checkcontent",
	},
	{label: "VPS", value: "vps"},
	{label: "Cộng tác viên", value: "ctv"},
];
export const listResponseStatus = [
	{label: "Tất cả trạng thái", value: "normal"},
	{label: "Đang chờ", value: "pending"},
	{label: "Đã phản hồi", value: "reply"},
];

export const listPriorityModal = [
	{label: "Bình thường", value: "normal"},
	{label: "Ưu tiên", value: "prioritize"},
	{label: "Khẩn cấp", value: "urgent"},
];
export const listProjectTicketModal = [
	{label: "Business", value: "business"},
	{label: "Entity", value: "entity"},
	{
		label: "Check link và check content",
		value: "checklink_checkcontent",
	},
	{label: "VPS", value: "vps"},
	{label: "Cộng tác viên", value: "ctv"},
];
export const isValidObjectId = (id) => {
	const objectIdPattern = /^[0-9a-fA-F]{24}$/;
	return objectIdPattern.test(id);
};
