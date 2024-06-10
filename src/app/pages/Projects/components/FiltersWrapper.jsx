import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetPagingProject } from "_redux/slice/projectSlice";
import {
	Autocomplete,
	AutocompleteItem,
	Button,
	DateRangePicker,
	Select,
	SelectItem,
} from "@nextui-org/react";
import { projectStatus } from "_constants";
import { getAllTeams } from "_redux/slice/teamSlice";
import { IoIosClose } from "react-icons/io";
import moment from "moment";

function FiltersWrapper() {
	const dispatch = useDispatch();
	const { listTeam } = useSelector((state) => state.team);
	const [time, setTime] = useState(null);
	const [team, setTeam] = useState(null);
	const [status, setStatus] = useState("");

	useEffect(() => {
		dispatch(getAllTeams());
	}, []);

	const handleFilterByDate = (value) => {
		setTime(value);

		const filter = {};

		if (value) {
			const start = moment(value?.start?.toDate())
				?.startOf("day")
				?.toISOString();
			const end = moment(value?.end?.toDate())
				?.endOf("day")
				?.toISOString();

			filter.dateStart = start;
			filter.dateEnd = end;
		}

		if (status && status !== "all") {
			filter.status = status;
		}

		if (team) {
			filter.team = team;
		}

		dispatch(GetPagingProject(filter));
	};

	const handleFilterByStatus = (value) => {
		const filter = {};
		const newStatus = [...value][0];

		setStatus(newStatus);

		if (newStatus && newStatus !== "all") {
			filter.status = newStatus;
		}

		if (time) {
			const start = moment(time?.start?.toDate())
				?.startOf("day")
				?.toISOString();
			const end = moment(time?.end?.toDate())
				?.endOf("day")
				?.toISOString();

			filter.dateStart = start;
			filter.dateEnd = end;
		}

		if (team) {
			filter.team = team;
		}

		dispatch(GetPagingProject(filter));
	};

	const handleFilterByTeam = (key) => {
		setTeam(key);

		// Filter Project
		const filter = {};

		if (status && status !== "all") {
			filter.status = status;
		}

		if (key) {
			filter.team = key;
		}

		if (time) {
			const start = moment(time?.start?.toDate())
				?.startOf("day")
				?.toISOString();
			const end = moment(time?.end?.toDate())
				?.endOf("day")
				?.toISOString();

			filter.dateStart = start;
			filter.dateEnd = end;
		}

		dispatch(GetPagingProject(filter));
	};

	const handleRemoveDate = () => {
		setTime(null);

		const filter = {};

		if (status && status !== "all") {
			filter.status = status;
		}

		if (team) {
			filter.team = team;
		}

		dispatch(GetPagingProject(filter));
	};

	return (
		<div className="mb-7 shadow-wrapper bg-card-project p-5 rounded-xl flex sm:flex-col md:flex-row mx-auto max-h-[330px] sm:w-[90%] xl:w-full">
			<div className="flex items-center gap-5 sm:flex-col md:flex-row flex-wrap w-full">
				{/* Filter By Status */}
				<Select
					variant={"bordered"}
					placeholder={"Trạng thái"}
					radius="sm"
					classNames={{
						base: "max-w-44",
						value: "text-white",
						trigger:
							"text-white data-[open=true]:border-primary data-[hover=true]:border-primary data-[focus=true]:border-primary",
					}}
					selectionMode={"single"}
					popoverProps={{
						classNames: {
							content: "rounded-md",
						},
						// disableAnimation: true,
						motionProps: {
							variants: {
								enter: {
									y: 0,
									opacity: 1,
									duration: 0.1,
									transition: {
										opacity: {
											duration: 0.15,
										},
									},
								},
								exit: {
									y: "10%",
									opacity: 0,
									duration: 0,
									transition: {
										opacity: {
											duration: 0.1,
										},
									},
								},
							},
						},
					}}
					disableAnimation
					onSelectionChange={handleFilterByStatus}
				>
					{projectStatus.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</Select>

				<DateRangePicker
					popoverProps={{
						className: "min-w-[300px] w-[300px]",
					}}
					calendarProps={{
						className: "!w-full !max-w-full",
						content: "!w-full !max-w-full",
					}}
					id="nextui-date-range-picker"
					radius="sm"
					variant={"bordered"}
					placeholder="Thời gian thực hiện"
					className="max-w-xs"
					disableAnimation
					startContent={
						time && (
							<Button
								className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-tiny rounded-full px-0 !gap-0 !transition-none bg-transparent data-[hover=true]:bg-default/40 min-w-8 w-8 h-8 -mr-2 text-inherit"
								variant="solid"
								color="danger"
								onPress={handleRemoveDate}
							>
								<IoIosClose className="text-xl min-w-max" />
							</Button>
						)
					}
					value={time}
					onChange={handleFilterByDate}
				/>

				{/* Filter By Team */}
				<Autocomplete
					defaultItems={listTeam}
					placeholder="Team"
					radius="sm"
					variant="bordered"
					selectedKey={team}
					inputProps={{
						classNames: {
							input: "!text-white placeholder:text-white",
							label: "!text-white",
							clearButton: "!text-white",
							inputWrapper:
								"group-data-[open=true]:border-primary group-data-[hover=true]:border-primary group-data-[focus=true]:border-primary",
						},
					}}
					classNames={{
						base: "max-w-52",
						endContentWrapper: "text-white",
						clearButton: "!text-white",
						selectorButton: "!text-white",
					}}
					onSelectionChange={handleFilterByTeam}
				>
					{(item) => (
						<AutocompleteItem key={item._id}>
							{item.name}
						</AutocompleteItem>
					)}
				</Autocomplete>
			</div>
		</div>
	);
}

export default FiltersWrapper;
