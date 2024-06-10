import {
	Popover,
	PopoverTrigger,
	PopoverContent,
	Button,
	User,
	Input,
	Chip,
} from "@nextui-org/react";
import {memo, useEffect, useMemo, useState} from "react";
import {IoIosArrowDown} from "react-icons/io";
import NotifyMessage from "_utils/notify";
import {cloneDeep, debounce} from "lodash";
import SkeletonUsersSelect from "../SkeletonUsersSelect";
import {getUsersList} from "services/api.service";
import {GiCheckMark} from "react-icons/gi";
import {MdOutlineClose} from "react-icons/md";
import {URL_IMAGE} from "_constants";
import {useCallback} from "react";
import InfiniteScroll from "react-infinite-scroll-component";

function SelectUsers({
	title,
	variant = "flat",
	light = false,
	fullWidth = false,
	selectionMode = "multiple",
	placement = "end",
	isInvalid = false,
	usersSelected,
	setUsersSelected,
	trigger,
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [usersList, setUsersList] = useState([]);
	const [filterValues, setFilterValues] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [hasFilter, setHasFilter] = useState(false);
	const [pageIndex, setPageIndex] = useState(1);
	const [total, setTotal] = useState(0);

	const PAGE_SIZE = 20;

	const query = useMemo(() => ({pageSize: PAGE_SIZE, pageIndex}), [pageIndex]);

	const fetchDataUsers = useCallback(
		async (query) => {
			if (isLoading) return;

			try {
				setIsLoading(true);

				const {data} = await getUsersList(query);

				if (data?.status === 1) {
					const newUsers =
						pageIndex === 1 ? data.users : [...usersList, ...data.users];

					setUsersList(newUsers);

					const usersId =
						selectionMode === "single"
							? [usersSelected?._id]
							: usersSelected?.map((select) => select?._id);

					setFilterValues(
						newUsers?.filter((item) => !usersId?.includes(item?._id))
					);

					if (data.total > PAGE_SIZE * pageIndex)
						setPageIndex((prevIndex) => prevIndex + 1);

					setTotal(data.total);
				}
			} catch (error) {
				console.log("error: ", error);
				// NotifyMessage(
				// 	"Không thể tải thông tin người dùng. Vui lòng tải lại trang!",
				// 	"error"
				// );
			} finally {
				setIsLoading(false);
			}
		},
		[pageIndex, hasFilter]
	);

	useEffect(() => {
		if (!isOpen) {
			setUsersList([]);
			setFilterValues([]);
			setPageIndex(1);
			setTotal(0);
		} else {
			fetchDataUsers(query);
		}
	}, [isOpen]);

	const DEBOUNCE_DELAY_FILTER = 100;

	const handleChangeInput = async (event) => {
		setHasFilter(!!event?.target?.value);

		const inputValue = event.target.value.trim().toLowerCase();

		if (inputValue) {
			if (isLoading) return;

			try {
				setIsLoading(true);

				const {data} = await getUsersList({searchValue: inputValue});

				if (data?.status === 1) {
					setUsersList(data.users);
					setFilterValues(data.users);
				}
			} catch (error) {
				console.log("error: ", error);
				// NotifyMessage(
				// 	"Không thể tải thông tin người dùng. Vui lòng tải lại trang!",
				// 	"error"
				// );
			} finally {
				setIsLoading(false);
				setPageIndex(1);
			}
		} else {
			fetchDataUsers(query);
		}
	};

	const debouncedFilter = debounce(handleChangeInput, DEBOUNCE_DELAY_FILTER);

	const onOpenChange = (open) => {
		setIsOpen(open);
	};

	const handleRemovePerformers = useCallback(
		(id) => {
			if (selectionMode === "single") {
				return setUsersSelected({});
			}

			const user = usersSelected?.find((item) => item?._id === id);

			if (user) {
				const newSelected = usersSelected?.filter(
					(item) => item._id !== user?._id
				);
				setUsersSelected(newSelected);
				setUsersList((prev) => [...prev, user]);
			}
		},
		[usersSelected]
	);

	const handleSelectedUsers = (users, item) => {
		if (selectionMode === "multiple") {
			setUsersSelected([...users, item]);
		} else {
			setUsersSelected(item);
			onOpenChange(false);
		}

		setFilterValues((prev) => prev?.filter((el) => el?._id !== item?._id));
	};

	const handleClosePopover = () => {
		setIsOpen(false);
	};

	const textCSS = useMemo(() => (light ? "text-white" : "text-task-title"), [
		light,
	]);

	const borderCSS = useMemo(
		() => (light ? "border-2 border-white" : "border-2 border-default-200"),
		[light]
	);

	const hasMore = useMemo(() => {
		if (isLoading || hasFilter) return false;

		if (total > usersList?.length && !hasFilter) {
			return true;
		}

		return false;
	}, [total, usersList, hasFilter]);

	const renderValueSelected = useMemo(() => {
		if (selectionMode === "multiple" && !!usersSelected?.length) {
			return (
				<div className="flex flex-wrap gap-1">
					{usersSelected?.map((user, index) => (
						<Chip key={index} radius="sm" color="primary">
							{user?.name || user?.username}
						</Chip>
					))}
				</div>
			);
		}

		if (selectionMode === "single" && !!Object.keys(usersSelected).length) {
			return (
				<Chip radius="sm" color="primary">
					{usersSelected?.name || usersSelected?.username}
				</Chip>
			);
		}

		return (
			<span
				className={`font-normal text-sm ${isInvalid ? "text-danger" : textCSS}`}
			>
				{title}
			</span>
		);
	}, [usersSelected, selectionMode, isInvalid]);

	const renderValueSelection = useMemo(() => {
		if (filterValues?.length) {
			return filterValues?.map((item) => (
				<Button
					key={item?._id}
					fullWidth
					variant="light"
					className={`bg-transparent items-center rounded-sm justify-start py-1 px-2`}
					onClick={() => handleSelectedUsers(usersSelected, item)}
				>
					<User
						name={`${item.name || item.username}`}
						description={!item.name ? item?.username : ""}
						avatarProps={{
							src: item?.avatar ? `${URL_IMAGE}/${item?.avatar}` : "",
						}}
					/>
				</Button>
			));
		}

		return (
			<Button
				fullWidth
				variant="light"
				isDisabled
				className={`bg-transparent items-center rounded-sm justify-center py-1 px-2`}
			>
				Không tìm thấy người dùng nào!
			</Button>
		);
	}, [filterValues, usersSelected]);

	return (
		<Popover
			placement={placement}
			offset={-150}
			backdrop="transparent"
			disableAnimation
			isOpen={isOpen}
			onOpenChange={onOpenChange}
		>
			<PopoverTrigger>
				<Button
					radius="sm"
					variant={variant}
					className={`${fullWidth ? "w-full" : "w-max"} h-max ${
						isInvalid ? "border border-danger" : borderCSS
					} relative data-[hover=true]:border-primary data-[open=true]:border-primary data-[focus=true]:border-primary ${
						variant === "flat"
							? "bg-white data-[hover=true]:bg-white"
							: "bg-transparent data-[hover=true]:bg-transparent"
					} items-center justify-between py-2 px-3 h-10`}
					endContent={
						<IoIosArrowDown
							className={`${isInvalid ? "text-danger" : textCSS} text-base`}
						/>
					}
				>
					{renderValueSelected}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="min-w-80 max-w-80 px-2 py-0 rounded-md overflow-hidden">
				<header className="py-1 relative w-full">
					<h3 className="py-0 px-8 h-10 align-middle text-sm leading-10 text-center tracking-wide font-semibold text-task-title text-ellipsis text-nowrap overflow-hidden">
						{title}
					</h3>

					<span
						className="p-2 absolute right-1 top-2 cursor-pointer hover:bg-btn-detail rounded-md"
						onClick={handleClosePopover}
					>
						<MdOutlineClose className="text-base text-task-title" />
					</span>
				</header>

				{/* Content */}
				<section
					id="scrollableDiv"
					className="w-full mb-3 overflow-y-auto max-h-[500px] scrollbar-kanban overscroll-contain"
				>
					<InfiniteScroll
						dataLength={usersList?.length}
						next={() => fetchDataUsers(query)}
						hasMore={hasMore}
						loader={<SkeletonUsersSelect />}
						scrollableTarget="scrollableDiv"
					>
						<div className="mt-2 px-1 flex flex-col gap-2 w-full relative">
							<Input
								size="sm"
								variant="bordered"
								placeholder={`Tìm ${title}...`}
								classNames={{
									inputWrapper:
										"rounded-sm py-2 !h-auto data-[hover=true]:border-primary-400 group-data-[focus=true]:border-primary-400 group-data-[focus=true]:border-2 group-data-[focus=true]:border-primary-400",
									label: "hidden",
									input: "text-sm text-task-title",
								}}
								onChange={debouncedFilter}
							/>

							{/* Performers Selected */}
							{/* Multiple Select */}
							{selectionMode === "multiple" && !!usersSelected?.length && (
								<div className="mt-3">
									<p className="text-xs text-task-title font-semibold">
										Người giao việc đã chọn:
									</p>

									<div className="flex flex-col gap-y-2 mt-3">
										{usersSelected?.map((item) => (
											<Button
												key={item?._id}
												fullWidth
												variant="light"
												className={`bg-transparent items-center rounded-sm justify-between py-1 px-2`}
												onClick={() => handleRemovePerformers(item?._id)}
												endContent={<GiCheckMark />}
											>
												<User
													name={`${item?.name || item?.username}`}
													description={!item?.name ? item?.username : ""}
													avatarProps={{
														src: item?.avatar
															? `${URL_IMAGE}/${item?.avatar}`
															: "",
													}}
												/>
											</Button>
										))}
									</div>
								</div>
							)}

							{/* Single Select */}
							{selectionMode === "single" &&
								!!Object.keys(usersSelected).length && (
									<div className="mt-3">
										<p className="text-xs text-task-title font-semibold mb-3">
											Người giao việc đã chọn:
										</p>

										<Button
											fullWidth
											variant="light"
											className={`bg-transparent items-center rounded-sm justify-between py-1 px-2`}
											onClick={handleRemovePerformers}
											endContent={<GiCheckMark />}
										>
											<User
												name={`${
													usersSelected?.name || usersSelected?.username
												}`}
												description={
													!usersSelected?.name ? usersSelected?.username : ""
												}
												avatarProps={{
													src: usersSelected?.avatar
														? `${URL_IMAGE}/${usersSelected?.avatar}`
														: "",
												}}
											/>
										</Button>
									</div>
								)}

							{/* Select Performers */}
							<div className="mt-3">
								<p className="text-xs text-task-title font-semibold">
									Chọn người giao việc:
								</p>

								<div className="flex flex-col gap-y-2 mt-3">
									{renderValueSelection}
								</div>
							</div>
						</div>
					</InfiniteScroll>
				</section>
			</PopoverContent>
		</Popover>
	);
}

export default memo(SelectUsers);
