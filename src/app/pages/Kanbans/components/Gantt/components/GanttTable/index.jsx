import {
	ColumnDirective,
	ColumnsDirective,
	Inject,
	TreeGridComponent,
} from "@syncfusion/ej2-react-treegrid";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaProjectDiagram, FaUserFriends } from "react-icons/fa";
import { LuClock2 } from "react-icons/lu";
import { useParams } from "react-router-dom";
import { getTasksForGantt } from "services/api.service";

function GanttTable() {
	const { id: projectId } = useParams();
	const treegridInstance = useRef(null);
	const [tasks, setTasks] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
		const syncfusionA = document.querySelectorAll("a");
		const syncfusion = document.querySelector(
			'[href="https://www.syncfusion.com/account/claim-license-key?pl=SmF2YVNjcmlwdA==&vs=MjU="]'
		);
		const syncfusionPopUp = document.querySelectorAll(
			'[href="https://www.syncfusion.com/account/claim-license-key?pl=SmF2YVNjcmlwdA==&vs=MjU="]'
		)?.[1];
		syncfusionA?.forEach((item) => {
			if (
				item.innerText.toLowerCase() === "Claim your free account".toLowerCase()
			) {
				item.parentElement.style.display = "none";
			}

			if (item.innerText === "Claim your FREE account") {
				item.parentElement.parentElement.style.display = "none";
			}
		});

		if (syncfusion) {
			syncfusion.parentElement.style.display = "none";
		}

		if (syncfusionPopUp) {
			const parentElement = syncfusionPopUp.parentElement.parentElement;
			if (parentElement) {
				parentElement.style.display = "none";
			}

			syncfusionPopUp.parentElement.style.display = "none";
		}
	}, []);

    const fetchData = async (id) => {
		try {
			setIsLoading(true);
			const {data} = await getTasksForGantt(id);

			const returnDate = (date) => date ? moment(date).format("YYYY-MM-DD") : null;

			if (data?.status === 1) {
				// Ensure date fields are formatted as strings
				const formattedTasks = data.tasks.map((status) => ({
					...status,
					dateStart: null,
					dateEnd: null,
                    performers: '',
					child: status?.child?.map((task) => {
						return {
							...task,
							dateStart: returnDate(task?.dateStart),
							dateEnd: returnDate(task?.dateEnd),
							child: task?.child?.map((chst) => {
								return {
									...chst,
									dateStart: returnDate(chst?.dateStart),
									dateEnd: returnDate(chst?.dateEnd),
									child: chst?.items?.map((item) => {
										return {
											...item,
											name: item?.title,
											dateStart: returnDate(item?.dateStart),
											dateEnd: returnDate(item?.dateEnd),
											duration:
												!item?.dateStart || !item?.dateEnd
													? 0
													: moment(item?.dateEnd, "YYYY-MM-DD").diff(
															moment(item?.dateStart, "YYYY-MM-DD"),
															"days"
													  ) + 1,
											field: "item",
										};
									}),
								};
							}),
						};
					}) || [],
				}));

				setTasks(formattedTasks);
			}
		} catch (error) {
			console.log("error: ", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchData(projectId);
	}, [projectId]);

	const colsDirective = useMemo(
		() => [
			{
				field: "name",
				headerText: "Công việc",
				width: "100",
				headerTemplate: () => {
					return (
						<div className="flex items-center gap-2">
							<FaProjectDiagram size={18} className="min-w-max min-h-max" />
							<b className="e-header uppercase">Công việc</b>
						</div>
					);
				},
				template: (args) => (
					<p className="text-sm">{args?.name}</p>
				)
			},
			{
				field: "dateStart",
				headerText: "Ngày bắt đầu",
				width: "60",
				textAlign: "Left",
				headerTemplate: () => {
					return (
						<div className="flex items-center gap-2 ">
							<LuClock2 size={18} className="min-w-max min-h-max" />
							<b className="e-header uppercase">Ngày bắt đầu</b>
						</div>
					);
				},
			},
            {
				field: "dateEnd",
				headerText: "Ngày hoàn thành",
				width: "60",
				textAlign: "Left",
				headerTemplate: () => {
					return (
						<div className="flex items-center gap-2 ">
							<LuClock2 size={18} className="min-w-max min-h-max" />
							<b className="e-header uppercase">Ngày hoàn thành</b>
						</div>
					);
				},
			},
			{
				field: "performers",
				headerText: "Người thực hiện",
				width: "100",
				textAlign: "Left",
				headerTemplate: () => {
					return (
						<div className="flex items-center gap-2">
							<FaUserFriends size={18} className="min-w-max min-h-max" />
							<b className="e-header uppercase">Người thực hiện</b>
						</div>
					);
				},
				template: (args) => {
                    if (args.field === 'task') {
						if(!args.performers) return '';
						
						const performers = args.performers
							?.map((user) => user?.name || user?.username)
							?.join(", ");
						
						return performers
					}

                    if (args.field === 'item' && !args?.createdBy) return '';

					const createdBy = args?.createdBy?.name;

					return createdBy;
				},
			},
		],
		[]
	);

	return (
		<div className="rounded-lg">
			<TreeGridComponent
				id="treegridgantt"
				ref={treegridInstance}
				dataSource={tasks || []}
				treeColumnIndex={0}
				childMapping="child"
				height="70vh"
				width={'100%'}
				columns={colsDirective}
				gridLines="Both"
			>
				<ColumnsDirective>
					{colsDirective?.map((item, index) => (
						<ColumnDirective
							key={index}
							field={item.field}
							width={item.width}
							headerText={item.headerText}
							headerTemplate={item.headerTemplate}
							template={item.template}
							textAlign={item.textAlign}
							className="cursor-pointer"
						/>
					))}
				</ColumnsDirective>
				<Inject services={[]} />
			</TreeGridComponent>
		</div>
	);
}

export default GanttTable;
