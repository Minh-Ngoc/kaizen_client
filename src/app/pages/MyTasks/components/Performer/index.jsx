import {Tooltip, User} from "@nextui-org/react";
import {URL_IMAGE} from "_constants";
import {setTask} from "_redux/slice/taskSlice";
import PopoverAddTask from "app/pages/Kanbans/components/PopoverAddTask";
import Performers from "app/pages/Kanbans/Forms/Performers";
import React, {memo, useEffect} from "react";
import {FaPlus} from "react-icons/fa6";
import {SlUser} from "react-icons/sl";
import {useDispatch} from "react-redux";
import {getTaskById} from "services/api.service";

const Performer = ({performers, taskId}) => {
	const dispatch = useDispatch();
	const fetchData = async () => {
		const task = await getTaskById(taskId);
		const result = task?.data?.result[0];

		dispatch(setTask(result));
	};
	return (
		<div className="flex items-center flex-wrap gap-y-2">
			{performers?.map((item) => (
				<Tooltip
					key={item?._id}
					placemen="top"
					motionProps={{variants: {}}}
					classNames={{
						content: "p-0 rounded-md",
					}}
					content={
						<span
							className={`rounded-md py-1 px-2 text-wrap text-left text-xs max-w-56 bg-slate-600 text-white font-normal overflow-hidden align-middle`}
						>
							{item?.name || item?.username}
						</span>
					}
				>
					<User
						name={`${item?.name || item?.username}`}
						description={!item?.name ? item?.username : ""}
						avatarProps={{
							src: item?.avatar ? `${URL_IMAGE}/${item?.avatar}` : "",
							classNames: {
								base: "w-8 h-8",
							},
						}}
						classNames={{
							base: "hover:opacity-50 cursor-pointer",
							description: "hidden",
							name: "hidden",
						}}
					/>
				</Tooltip>
			))}
			<PopoverAddTask
				itemKey={`performers-${taskId}-${Date.now()}`}
				item={{
					key: `performers`,
					label: "Người thực hiện",
					icon: <SlUser size={"16px"} />,
					content: <Performers />,
					error: false,
				}}
				trigger={
					<div
						className="hover:opacity-50 cursor-pointer flex relative justify-center items-center box-border overflow-hidden align-middle z-0 outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 w-8 h-8 text-tiny bg-btn-detail-hover text-default-foreground rounded-full flex-shrink-0"
						onClick={fetchData}
					>
						<span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-normal text-center text-inherit">
							<FaPlus size={"16px"} color="rgb(90 105 131)" />
						</span>
					</div>
				}
			/>
		</div>
	);
};

export default memo(Performer);
