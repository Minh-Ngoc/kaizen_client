import {Input, Button, User} from "@nextui-org/react";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {GiCheckMark} from "react-icons/gi";
import {debounce} from "lodash";
import SkeletonUsersSelect from "app/components/SkeletonUsersSelect";
import {UpdateTask, setTasks} from "_redux/slice/taskSlice";
import NotifyMessage from "_utils/notify";
import {URL_IMAGE} from "_constants";
import {setSidebarTask} from "_redux/slice/sidebarTaskSlice";
import {getPerformersByProject} from "services/api.service";
import {updateTaskUI} from "_redux/slice/taskSlice";

function Performers() {
	const dispatch = useDispatch();
	const {tasks, task, isLoading: isLoadingSubmit, currentTab} = useSelector(
		(state) => state.tasks
	);

	const [performers, setPerformers] = useState([]);
	const [filterValues, setFilterValues] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setPerformers(task?.performers);
	}, [task]);

	const fetchDataUsers = async (projectId) => {
		try {
			setIsLoading(true);
			const {data} = await getPerformersByProject({id: projectId});
			if (data?.status === 1) {
				if (performers?.length) {
					setFilterValues(
						data?.users?.filter(
							(user) => !performers?.find((us) => us?._id === user?._id) && user
						)
					);
				} else {
					setFilterValues(data?.users);
				}
			}
		} catch (error) {
			console.log("error: ", error);
			NotifyMessage(
				"Không thể tải thông tin người dùng. Vui lòng tải lại trang!",
				"error"
			);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (task?.project?._id && performers) {
			fetchDataUsers(task?.project?._id);
		}
	}, [task, performers]);

	const DEBOUNCE_DELAY_FILTER = 100;

	const handleChangeInput = async (event) => {
		const inputValue = event.target.value.trim().toLowerCase();

		if (inputValue) {
			if (isLoading) return;

			try {
				setIsLoading(true);

				const {data} = await getPerformersByProject({
					id: task?.project?._id,
					searchValue: inputValue,
				});

				if (data?.status === 1) {
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
			fetchDataUsers();
		}
	};

	const debouncedFilter = debounce(handleChangeInput, DEBOUNCE_DELAY_FILTER);

	const handleRemovePerformers = (id) => {
		const user = performers?.find((item) => item?._id === id);

		if (user) {
			const newSelected = performers.filter((item) => item._id !== id);
			setFilterValues((prev) => [...prev, user]);

			return setPerformers(newSelected);
		}
	};

	const handleSelectedPerformers = (item) => {
		setPerformers((prev) => (prev && prev?.length ? [...prev, item] : [item]));
		setFilterValues((prev) => prev?.filter((el) => el?._id !== item?._id));
	};

	const onSubmit = () => {
		const formatDataSubmit = performers?.map((performer) => performer._id);

		if (formatDataSubmit) {
			const newTasks = tasks?.map((tsk) => {
				if (tsk?._id === task?._id) {
					return {...task, performers};
				}

				return tsk;
			});

			dispatch(setTasks(newTasks));

			dispatch(
				UpdateTask({
					id: task?._id,
					body: {
						performers: formatDataSubmit,
					},
				})
			);
			dispatch(setSidebarTask({isOpen: false}));
			currentTab === "list" &&
				dispatch(
					updateTaskUI({
						statusId: task?.statusId,
						taskId: task?._id,
						performers: formatDataSubmit,
					})
				);
		}
	};

	return (
		<div className="mt-2 px-1 flex flex-col gap-2 w-full relative">
			<Input
				size="sm"
				variant="bordered"
				placeholder={`Tìm người giao việc...`}
				classNames={{
					inputWrapper:
						"rounded-sm py-2 !h-auto data-[hover=true]:border-primary-400 group-data-[focus=true]:border-primary-400 group-data-[focus=true]:border-2 group-data-[focus=true]:border-primary-400",
					label: "hidden",
					input: "text-sm text-task-title",
				}}
				onChange={debouncedFilter}
			/>

			{/* Performers Selected */}
			{!!performers?.length && (
				<div className="mt-3">
					<p className="text-xs text-task-title font-semibold">
						Người giao việc đã chọn:
					</p>

					<div className="flex flex-col gap-y-2 mt-3">
						{performers?.map((item) => (
							<Button
								key={item?._id}
								fullWidth
								variant="light"
								className={`bg-transparent items-center rounded-sm justify-between py-1 px-2`}
								onClick={() => handleRemovePerformers(item?._id)}
								endContent={<GiCheckMark />}
							>
								<User
									name={`${item.name || item.username}`}
									description={!item.name ? item?.username : ""}
									avatarProps={{
										src: item?.avatar ? `${URL_IMAGE}/${item?.avatar}` : "",
									}}
								/>
							</Button>
						))}
					</div>
				</div>
			)}
			{/* Select Performers */}
			<div className="mt-3">
				<p className="text-xs text-task-title font-semibold">
					Chọn người giao việc:
				</p>

				<div className="flex flex-col gap-y-2 my-3">
					{isLoading ? (
						Array.from({length: 10}, (_, idx) => (
							<SkeletonUsersSelect key={idx} />
						))
					) : filterValues?.length ? (
						filterValues?.map((item) => (
							<Button
								key={item?._id}
								fullWidth
								variant="light"
								className={`bg-transparent items-center rounded-sm justify-start py-1 px-2`}
								onClick={() => handleSelectedPerformers(item)}
							>
								<User
									name={`${item.name || item.username}`}
									description={!item.name ? item?.username : ""}
									avatarProps={{
										src: item?.avatar ? `${URL_IMAGE}/${item?.avatar}` : "",
									}}
								/>
							</Button>
						))
					) : (
						<Button
							fullWidth
							variant="light"
							isDisabled
							className={`bg-transparent items-center rounded-sm justify-center py-1 px-2`}
						>
							Không tìm thấy người thực hiện nào!
						</Button>
					)}
				</div>
			</div>

			{/* Button Update Selected Performers */}
			<Button
				fullWidth
				variant="light"
				className={`z-10 mt-3 sticky bottom-0 bg-primary hover:data-[hover=true]:bg-primary-400 items-center rounded-sm py-1 px-2`}
				onClick={onSubmit}
				isLoading={isLoadingSubmit}
			>
				<span className="font-semibold text-white">Lưu</span>
			</Button>
		</div>
	);
}

export default Performers;
