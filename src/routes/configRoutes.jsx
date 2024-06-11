import {GoTasklist} from "react-icons/go";
import { FaRegRectangleList } from "react-icons/fa6";
import {MdDashboard, MdOutlineSecurity} from "react-icons/md";
import {GrUserManager} from "react-icons/gr";
import {GiFlatPlatform} from "react-icons/gi";
import {TbBrandAsana} from "react-icons/tb";
import {MdOutlineStackedLineChart} from "react-icons/md";
import {RiTeamLine} from "react-icons/ri";
import {TbLocationSearch} from "react-icons/tb";
import { GrDomain } from "react-icons/gr";
import { GrAssistListening } from "react-icons/gr";
import { PiTicketLight } from "react-icons/pi";

const configRoutes = [
	{
		id: "dashboard",
		title: "Dashboard",
		name: "Dashboard",
		parent: true,
		icon: (
			<MdDashboard color="inherit" className="min-w-max min-h-max text-lg" />
		),
		link: "/dashboard",
	},
	{
		id: "my-tasks",
		auth: "tasks",
		title: "Công việc của tôi",
		name: "my-tasks",
		parent: true,
		icon: (
			<GoTasklist color="inherit" className="min-w-max min-h-max text-lg" />
		),
		link: "/my-tasks",
	},
	{
		id: "project",
		auth: "project",
		title: "Quản lý dự án",
		name: "project",
		parent: true,
		icon: (
			<FaRegRectangleList
				color="inherit"
				className="min-w-max min-h-max text-lg"
			/>
		),
		link: "/projects",
	},
	{
		id: "role",
		auth: "role",
		title: "Quản lý quyền hạn",
		name: "role",
		parent: true,
		icon: (
			<MdOutlineSecurity
				color="inherit"
				className="min-w-max min-h-max text-lg"
			/>
		),
		link: "/permission-manage",
	},
	{
		id: "user",
		auth: "user",
		title: "Quản lý người dùng",
		name: "user",
		parent: true,
		icon: (
			<GrUserManager color="inherit" className="min-w-max min-h-max text-lg" />
		),
		link: "/user-manage",
	},
	{
		id: "department",
		auth: "department",
		title: "Quản lý phòng ban",
		name: "department",
		parent: true,
		icon: (
			<GiFlatPlatform color="inherit" className="min-w-max min-h-max text-lg" />
		),
		link: "/department-manage",
	},
	{
		id: "brand",
		auth: "brand",
		title: "Quản lý thương hiệu",
		name: "brand",
		parent: true,
		icon: (
			<TbBrandAsana color="inherit" className="min-w-max min-h-max text-lg" />
		),
		link: "/brand-manage",
	},
	{
		id: "kpibonus",
		auth: "kpibonus",
		title: "Quản lý KPI bonus",
		name: "kpibonus",
		parent: true,
		icon: (
			<MdOutlineStackedLineChart
				color="inherit"
				className="min-w-max min-h-max text-lg"
			/>
		),
		link: "/kpi-bonus-manage",
	},
	{
		id: "team",
		auth: "team",
		title: "Quản lý Team",
		name: "team",
		parent: true,
		icon: (
			<RiTeamLine color="inherit" className="min-w-max min-h-max text-lg" />
		),
		link: "/team-manage",
	},
	{
		id: "seo",
		auth: "project",
		title: "Quản lý SEO",
		name: "seo",
		parent: true,
		icon: (
			<TbLocationSearch
				color="inherit"
				className="min-w-max min-h-max text-lg"
			/>
		),
		child: [
			{
				id: "new",
				title: "Quản lý tin tức",
				name: "new",
				link: "/seo/new-manage",
				icon: "dot",
			},
			{
				id: "blog",
				title: "Quản lý Blog",
				name: "blog",
				link: "/seo/blog-manage",
				icon: "dot",
			},
			{
				id: "activity",
				title: "Quản lý hoạt động",
				name: "activity",
				link: "/seo/activity-manage",
				icon: "dot",
			},
			{
				id: "project-manage",
				title: "Quản lý dự án",
				name: "project-manage",
				link: "/seo/project-manage",
				icon: "dot",
			},
			{
				id: "seo-manage",
				title: "Quản lý SEO",
				name: "seo-manage",
				link: "/seo/seo-manage",
				icon: "dot",
			},
		],
	},
	{
		id: "domain",
		auth: "domain",
		title: "Quản lý Domain",
		name: "domain",
		parent: true,
		icon: (
			<GrDomain color="inherit" className="min-w-max min-h-max text-lg" />
		),
		link: "/domain-manage",
	},
	{
		id: "log",
		auth: "log",
		title: "Quản lý Log",
		name: "log",
		parent: true,
		icon: (
			<GrAssistListening color="inherit" className="min-w-max min-h-max text-lg" />
		),
		link: "/log-manage",
	},
	{
		id: "your-ticket",
		auth: "your-ticket",
		title: "Ticket của bạn",
		name: "your-ticket",
		parent: true,
		icon: (
			<PiTicketLight color="inherit" className="min-w-max min-h-max text-lg" />
		),
		link: "/your-ticket",
	},
];

export default configRoutes;
