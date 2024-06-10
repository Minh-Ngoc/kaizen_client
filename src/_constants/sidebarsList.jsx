import Performers from "app/pages/Kanbans/Forms/Performers";
import Dates from "app/pages/Kanbans/Forms/Dates";
import Labels from "app/pages/Kanbans/Forms/Labels";
import Checklist from "app/pages/Kanbans/Forms/Checklist";
import { MdAccessTime } from "react-icons/md";
import { TiTag } from "react-icons/ti";
import { SlUser } from "react-icons/sl";
import { FiCheckSquare } from "react-icons/fi";
import { FaRegRectangleList } from "react-icons/fa6";
import Project from "app/pages/Kanbans/Forms/Project";

export const sidebarsList = [
	{
		key: "project",
		label: "Dự án",
		icon: <FaRegRectangleList size={"16px"} />,
		content: <Project />,
		error: false,
	},
	{
		key: "performers",
		label: "Người thực hiện",
		icon: <SlUser size={"16px"} />,
		content: <Performers />,
		error: false,
	},
	{
		key: "labels",
		label: "Nhãn",
		icon: <TiTag className="text-base -rotate-90" />,
		content: <Labels />,
		error: false,
	},
	{
		key: "checklist",
		label: "Checklists",
		icon: <FiCheckSquare className="text-base" />,
		content: <Checklist />,
		error: false,
	},
	{
		key: "dates",
		label: "Thời gian thực hiện",
		icon: <MdAccessTime size={"16px"} />,
		content: <Dates />,
		error: false,
	},
	// {
	// 	key: "attachments",
	// 	label: "Đính kèm",
	// 	icon: <GrAttachment size={"16px"} />,
	// 	content: <Attachments />,
	// 	error: false,
	// },
];