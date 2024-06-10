export const navigates = {
	login: "/login",
	register: "/register",
	projects: "/projects",
	kanbans: "/kanbans",
	dashboard: "/",
};

export const projectStatus = [
	{label: "Tất cả", value: "all"},
	{label: "Đang thực hiện", value: "doing", color: "warning"},
	{label: "Hoàn thành", value: "completed", color: "success"},
	{label: "Đã đóng", value: "closed", color: "danger"},
];

export const labelColors = [
	// Subtle
	{
		colorLabel: "subtle-green",
		colorCode: "bg-green-200",
	},
	{
		colorLabel: "subtle-yellow",
		colorCode: "bg-yellow-200",
	},
	{
		colorLabel: "subtle-orange",
		colorCode: "bg-orange-200",
	},
	{
		colorLabel: "subtle-red",
		colorCode: "bg-red-200",
	},
	{
		colorLabel: "subtle-purple",
		colorCode: "bg-purple-200",
	},
	// Default
	{
		colorLabel: "green",
		colorCode: "bg-green-400",
	},
	{
		colorLabel: "yellow",
		colorCode: "bg-yellow-400",
	},
	{
		colorLabel: "orange",
		colorCode: "bg-orange-400",
	},
	{
		colorLabel: "red",
		colorCode: "bg-red-400",
	},
	{
		colorLabel: "purple",
		colorCode: "bg-purple-400",
	},
	// Bold
	{
		colorLabel: "bold-green",
		colorCode: "bg-green-600",
	},
	{
		colorLabel: "bold-yellow",
		colorCode: "bg-yellow-600",
	},
	{
		colorLabel: "bold-orange",
		colorCode: "bg-orange-600",
	},
	{
		colorLabel: "bold-red",
		colorCode: "bg-red-600",
	},
	{
		colorLabel: "bold-purple",
		colorCode: "bg-purple-600",
	},

	// Subtle
	{
		colorLabel: "subtle-blue",
		colorCode: "bg-blue-200",
	},
	{
		colorLabel: "subtle-sky",
		colorCode: "bg-sky-200",
	},
	{
		colorLabel: "subtle-lime",
		colorCode: "bg-lime-200",
	},
	{
		colorLabel: "subtle-pink",
		colorCode: "bg-pink-200",
	},
	{
		colorLabel: "subtle-slate",
		colorCode: "bg-slate-200",
	},
	// Default
	{
		colorLabel: "blue",
		colorCode: "bg-blue-400",
	},
	{
		colorLabel: "sky",
		colorCode: "bg-sky-400",
	},
	{
		colorLabel: "lime",
		colorCode: "bg-lime-400",
	},
	{
		colorLabel: "pink",
		colorCode: "bg-pink-400",
	},
	{
		colorLabel: "slate",
		colorCode: "bg-slate-400",
	},
	// Bold
	{
		colorLabel: "bold-blue",
		colorCode: "bg-blue-600",
	},
	{
		colorLabel: "bold-sky",
		colorCode: "bg-sky-600",
	},
	{
		colorLabel: "bold-lime",
		colorCode: "bg-lime-600",
	},
	{
		colorLabel: "bold-pink",
		colorCode: "bg-pink-600",
	},
	{
		colorLabel: "bold-slate",
		colorCode: "bg-slate-600",
	},
];

export const URL_IMAGE = "https://cdn.okvip.business/newkaizen";

export const rankList = [
	{label: "Tập sự", value: "probationary"},
	{label: "Nhôm", value: "aluminium"},
	{label: "Đồng", value: "copper"},
	{label: "Bạc", value: "sliver"},
	{label: "Vàng", value: "gold"},
	{label: "Bạch Kim", value: "platinum"},
	{label: "Kim Cương", value: "diamond"},
	{label: "Cao thủ", value: "master"},
];
export function dateToUtcTimestamp(date) {
	if (!date) return new Date();
	const newDate = new Date(date);
	const userTimeZoneOffset = newDate?.getTimezoneOffset();
	const utcOffsetInHours = -userTimeZoneOffset / 60;
	newDate.setHours(newDate?.getHours() + utcOffsetInHours);
	return newDate?.toISOString();
}
