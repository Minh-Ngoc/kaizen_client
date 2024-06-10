import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Pagination} from "@nextui-org/react";
import {TbFolderPlus} from "react-icons/tb";
import {useDispatch, useSelector} from "react-redux";
import CardProject from "app/components/CardProject";
import FiltersWrapper from "./components/FiltersWrapper";
import FormNewProject from "./components/FormNewProject";
import {navigates} from "_constants";
import {setModal} from "_redux/slice/modalSlice";
import {GetPagingProject} from "_redux/slice/projectSlice";
import {MdOutlineBrowserNotSupported} from "react-icons/md";
import {BsTable} from "react-icons/bs";
import {TfiLayoutGrid2} from "react-icons/tfi";
import TableProjectsList from "./components/TableProjectsList";
import {setApi} from "_redux/slice/taskSlice";

const PAGE_SIZE = 10;

function Projects() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const {projects: projectList, total} = useSelector((state) => state.projects);
	const [typeShow, setTypeShow] = useState("grid");
	const [pageIndex, setPageIndex] = useState(1);

	const handleCreateNewProject = async () => {
		dispatch(
			setModal({
				isOpen: true,
				title: <p className="text-black">Tạo dự án mới</p>,
				body: <FormNewProject />,
				isDismissable: true,
				openConfirm: false,
				openCancel: false,
				bg: "bg-white",
				header: "",
				hideCloseButton: false,
				classNames: "",
				backdrop: "opaque",
				motionProps: "",
			})
		);
	};

	const navigateToProjectDetail = (id) => {
		dispatch(setApi("tasks"));
		navigate(`${navigates.kanbans}/${id}`);
	};

	useEffect(() => {
		dispatch(GetPagingProject({pageSize: PAGE_SIZE, pageIndex}));
	}, []);

	const handleChangeTypeShow = () => {
		if (typeShow === "grid") {
			setTypeShow("table");
			setPageIndex(1);
		} else {
			setTypeShow("grid");
			dispatch(GetPagingProject({pageSize: PAGE_SIZE, pageIndex}));
		}
	};

	const handleChangePaging = (value) => {
		setPageIndex(value);

		dispatch(GetPagingProject({pageSize: PAGE_SIZE, pageIndex: value}));
	};

	return (
		<div className="flex flex-col mt-24 mb-10">
			{/* Header */}
			<FiltersWrapper />

			{/* Select Show Project List */}
			<div className="shadow-wrapper sticky z-10 top-0 mb-7 bg-card-project p-5 rounded-xl flex sm:flex-col md:flex-row mx-auto max-h-[330px] sm:w-[90%] xl:w-full">
				<div className="flex flex-row justify-between items-center gap-5 w-full">
					<div className="flex flex-row items-center gap-5 w-full">
						<Button
							variant="light"
							className="rounded-md bg-transparent min-w-0 p-2 w-max h-full shadow-card-project data-[hover=true]:opacity-50 data-[hover=true]:bg-card-project-hover"
							onClick={handleChangeTypeShow}
						>
							{typeShow === "grid" ? (
								<BsTable className="text-white text-lg" />
							) : (
								<TfiLayoutGrid2 className="text-white text-lg" />
							)}
						</Button>

						{typeShow === "table" && (
							<Button
								variant="light"
								onClick={handleCreateNewProject}
								className="rounded-md bg-transparent px-4 py-2 w-max h-full items-center shadow-card-project data-[hover=true]:opacity-50 data-[hover=true]:bg-card-project-hover"
							>
								<TbFolderPlus className="w-5 h-5 text-white" />
								<p className="text-base text-white font-bold">Tạo dự án mới</p>
							</Button>
						)}
					</div>

					{typeShow === "grid" && (
						<Pagination
							classNames={{
								base: "shadow-sm",
								item: "text-white",
								prev: "text-white",
								next: "text-white",
							}}
							variant={"solid"}
							color="primary"
							isCompact
							showControls
							total={Math.ceil(total / PAGE_SIZE) || 1}
							page={pageIndex}
							initialPage={pageIndex}
							onChange={handleChangePaging}
						/>
					)}
				</div>
			</div>

			{typeShow === "grid" ? (
				<div className="grid lg:grid-cols-3 sm:grid-cols-1 md:grid-cols-2 gap-7">
					{/* Container Cards */}
					<div className="w-full min-h-[275px] h-full bg-card-project rounded-2xl shadow-card-project">
						{/* Create New Card */}
						<Button
							variant="light"
							fullWidth
							onClick={handleCreateNewProject}
							className="bg-transparent h-full data-[hover=true]:opacity-50 data-[hover=true]:bg-card-project-hover"
						>
							<div className="flex flex-col justify-center items-center text-white">
								<TbFolderPlus className="w-5 h-5 text-white" />
								<p className="text-lg text-white font-bold">Tạo dự án mới</p>
							</div>
						</Button>
					</div>

					{projectList?.map((item, index) => (
						<CardProject
							key={index}
							project={item}
							onClick={() => navigateToProjectDetail(item?._id)}
						/>
					))}

					{/* Card Not Found */}
					{!projectList?.length && (
						<div className="w-full min-h-[309px] h-full bg-card-project rounded-2xl shadow-card-project">
							<Button
								variant="light"
								fullWidth
								className="bg-transparent h-full data-[hover=true]:bg-transparent cursor-default"
							>
								<div className="flex flex-col justify-center items-center text-white">
									<MdOutlineBrowserNotSupported className="w-5 h-5 text-white" />
									<p className="text-lg text-white font-bold">
										Không tìm thấy dự án nào
									</p>
								</div>
							</Button>
						</div>
					)}
				</div>
			) : (
				<TableProjectsList />
			)}
		</div>
	);
}

export default Projects;
