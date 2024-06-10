import { Avatar, Progress } from "@nextui-org/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import configRoutes from "routes/configRoutes";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { URL_IMAGE } from "_constants";
import { calculateRankScore } from "_utils";

const Sidebar = () => {
	const userData = useSelector((state) => state.auth.userData);
	const location = useLocation();
	const [openedMenu, setOpenedMenu] = useState({});
	const [activeName, setActiveName] = useState("");

	const activeLink = useMemo(() => location.pathname, [location]);

	const listRef = useRef({});

	useEffect(() => {
		const findActiveRoute = (routes) => {
			for (const route of routes) {
				if (activeLink === route.link) {
					return route.name;
				}
				if (route.child) {
					const activeChild = findActiveRoute(route.child);
					if (activeChild) {
						return activeChild;
					}
				}
			}
			return null;
		};

		const activeRouteName = findActiveRoute(configRoutes);
		if (activeRouteName) {
			setActiveName(activeRouteName);
		}
	}, [activeLink]);

	const handleNavigate = (name) => {
		setActiveName(name);
	};

	const handleToggle = (name) => {
		const [key] = Object.keys(openedMenu);

		if(key === name) {
			return setOpenedMenu({});
		}

		setOpenedMenu((prevState) => {
			const isCurrentlyOpen = prevState[name]?.open;
			const rootEl = name.split(".")[0];

			return {
				...prevState,
				[name]: {
					open: !isCurrentlyOpen,
					height: isCurrentlyOpen
						? "0px"
						: `${listRef.current[name]?.scrollHeight || 0}px`,
				},
				[rootEl]: {
					open: true,
					height: `${listRef.current[rootEl]?.scrollHeight || 0}px`,
				},
			};
		});
	};

	const generateMenu = useCallback((item, index, recursive = 0) => {
		const isActive = activeName === item.name;
		const isParentActive = activeName.split(".")[0] === item.name;

		const isAnyChildActive = item.child?.some(
			(child) => activeName === child.name
		);

		const Navigate = item?.child && item?.child?.length ? 'div' : Link;

		const [key] = Object.keys(openedMenu);

		return (
			<li key={index}>
				<Navigate
					to={item.link}
					role="button"
					tabIndex={0}
					id={item.id}
					onClick={() => {
						if ("child" in item) {
							handleToggle(item.name);
						} else if ("link" in item) {
							handleNavigate(item.name);
						}
					}}
					onKeyDown={(event) => {
						if (event.code === "Space") {
							if ("child" in item) {
								handleToggle(item.name);
							} else if ("link" in item) {
								handleNavigate(item.name);
							}
						}
					}}
					className={[
						"select-none group m-0 flex cursor-pointer rounded-lg items-center justify-between h-12 py-0 pr-3 mb-1 focus:outline-none pl-4",
						isActive || isParentActive || isAnyChildActive
							? "text-white font-semibold bg-[#0389e9]"
							: "text-slate-400",
						"hover:bg-slate-300/20",
					].join(" ")}
				>
					<div className="flex items-center gap-3">
						{item.icon &&
							(item.icon === "dot" ? (
								<div className="h-3 w-3 flex items-center justify-center">
									<div
										className={`${
											isActive ||
											isParentActive ||
											isAnyChildActive
												? "h-2 w-2"
												: "h-1 w-1"
										} bg-current rounded-full duration-200`}
									></div>
								</div>
							) : (
								<Avatar
									icon={item?.icon}
									classNames={{
										base: `${
											isActive ||
											isParentActive ||
											isAnyChildActive
												? "bg-white"
												: "bg-[#0389e9]"
										} h-8 w-8`,
										icon: `${
											isActive ||
											isParentActive ||
											isAnyChildActive
												? "text-[#0389e9]"
												: "text-white"
										}`,
									}}
								/>
							))}
						<div className="truncate">{item.title}</div>
					</div>
					{"child" in item && (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className={`h-5 w-5 translate-transform duration-100 ease-linear ${key === item.name ? 'rotate-90' : 'rotate-0'}`}
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
								clipRule="evenodd"
							/>
						</svg>
					)}
				</Navigate>
				{"child" in item && (
					<ul
						ref={(el) => (listRef.current[item.name] = el)}
						className="overflow-hidden duration-300 ease-in-out pl-9"
						style={{
							maxHeight: `${
								openedMenu[item.name]?.height || "0px"
							}`,
						}}
					>
						{item.child.map((child, idx) =>
							generateMenu(child, idx, recursive + 1)
						)}
					</ul>
				)}
			</li>
		);
	}, [activeName, openedMenu]);

	const renderNameProfile = useMemo(() => {
		if (userData?.firstName || userData?.lastName) {
			return `${userData?.firstName || ""} ${userData?.lastName || ""}`;
		}

		if (userData?.name) {
			return userData?.name;
		}

		return userData?.username;
	}, [userData]);

	const avatar = useMemo(() => {
		if (userData?.avatar) {
			return URL_IMAGE + "/" + userData?.avatar;
		}

		return "";
	}, [userData]);

    const [rankData, setRankData] = useState({
		percent: 0,
		text: `0 / 1.000.000`,
		rankText: "Tập sự",
	});

    useEffect(() => {
		setRankData(calculateRankScore(userData?.rankScore ?? 0));
	}, [userData]);

	return (
		<nav role="navigation" className="bg-table shadow-wrapper rounded-md sticky top-2 overflow-hidden">
			{/* Begin: Header */}
			<div className="pt-6 pb-2 flex flex-col items-center">
				<Link
					to={"/"}
					className="text-center flex flex-col items-center justify-center"
				>
					<div className="relative rounded-full duration-300 h-20 w-20 flex items-center justify-center">
						<Avatar
							src={avatar}
							className="w-12 h-12"
						/>
						{[
							"copper",
							"platinum",
							"master",
							"gold",
							"diamond",
						].includes(userData?.rank) && (
							<div className="block absolute -top-4 w-[122px]">
								<img
									src={`/rank/${userData?.rank}.png`}
									alt="Hạng người dùng"
									className="w-full h-full"
								/>
							</div>
						)}
					</div>
					<div className="text-lg uppercase font-semibold text-white mt-6 truncate duration-300">
						{renderNameProfile}
					</div>
					<div className="flex flex-row gap-1 justify-between items-end mb-1">
						<p className="text-base text-slate-400 font-medium">
							{rankData?.rankText}
						</p>
					</div>
				</Link>
				<div className="flex flex-col w-full px-4 h-12 justify-items-end items-end">
					<div className="rounded w-full relative">
						<div className="w-full h-full flex justify-center items-center z-20 absolute">
							<p className="text-xs text-gray-600 font-bold">
								{rankData?.text}
							</p>
						</div>
						<Progress
							aria-label="Loading..."
							radius="sm"
							classNames={{
								base: "max-w-md",
								track: "drop-shadow-md border border-default h-5",
								indicator:
									"bg-gradient-to-r from-pink-500 to-yellow-500",
								label: "tracking-wider font-medium text-default-600",
								value: "text-foreground/60",
							}}
							value={rankData?.percent}
						/>
					</div>
				</div>
			</div>
			{/* End: Header */}
			
			<div className="list-none text-sm font-normal px-3 mb-10 p-0 overflow-y-scroll max-h-sidebar-list scrollbar-kanban">
				{configRoutes?.map((item, index) =>
					generateMenu(item, index)
				)}
			</div>
		</nav>
	);
};

export default Sidebar;
