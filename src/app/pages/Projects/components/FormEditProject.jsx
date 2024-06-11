/* eslint-disable no-case-declarations */
/* eslint-disable no-unsafe-optional-chaining */
import { useState } from "react";
import {
	Input,
	ModalFooter,
	Button,
	DateRangePicker,
	Select,
	SelectItem,
} from "@nextui-org/react";
import { onClose } from "_redux/slice/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import SelectUsers from "app/components/SelectUsers";
import { UpdateProject } from "_redux/slice/projectSlice";
import { useEffect } from "react";
import { getAllTeams } from "_redux/slice/teamSlice";
import ReactSelect from "react-select";
import moment from "moment";
import { parseDate } from "@internationalized/date";
import { projectStatus } from "_constants";
import { I18nProvider } from "@react-aria/i18n";
import { setModal } from "_redux/slice/modalSlice";

const FormEditProject = ({ project }) => {
	const dispatch = useDispatch();
	const { listTeam } = useSelector((state) => state.team);
	const { isLoading } = useSelector((state) => state.projects);

	const [form, setForm] = useState({
		name: {
			label: "Tên dự án",
			type: "input",
			errorMessage: "",
			placeholder: "Tên dự án...",
			value: project?.name,
		},
		status: {
			label: "Trạng thái",
			type: "status",
			errorMessage: "",
			placeholder: "Chọn trạng thái...",
			value: project?.status,
		},
		executionTime: {
			label: "Thời gian thực hiện",
			type: "time",
			errorMessage: "",
			value: {
				dateStart: parseDate(
					moment(project?.dateStart).format("YYYY-MM-DD")
				),
				dateEnd: parseDate(
					moment(project?.dateEnd).format("YYYY-MM-DD")
				),
			},
		},
		team: {
			label: "Team",
			type: "autocomplete",
			dataOptions: listTeam?.map((item) => ({
				label: item?.name,
				value: item?._id,
			})),
			errorMessage: "",
			placeholder: "Chọn Team...",
			value: project?.team?.map((item) => ({
				label: item?.name,
				value: item?._id,
			})),
		},
		performers: {
			label: "Người thực hiện",
			type: "select",
			selectionMode: "multiple",
			errorMessage: "",
			placeholder: "Chọn người theo dõi...",
			value: project?.performers || [],
		},
	});

	useEffect(() => {
		dispatch(getAllTeams());
	}, []);

	const handleOnChangeInput = (event, key) => {
		let value;

		switch (key) {
			case "name":
				value = event?.target?.value;
				break;

			case "status":
				const [newStatus] = [...event];
				value = newStatus;

				break;

			case "performers":
			case "followers":
			case "desc":
			case "team":
				value = event;
				break;

			case "executionTime":
				value = {
					dateStart: event?.start,
					dateEnd: event?.end,
				};
				break;

			case "files":
				value = event?.target?.files || event;
		}

		setForm((prev) => ({
			...prev,
			[key]: {
				...prev[key],
				value,
				errorMessage: value ? "" : prev[key]?.errorMessage,
			},
		}));
	};

	const onSubmit = async () => {
		if (!form?.name?.value) {
			setForm((prevForm) => ({
				...prevForm,
				name: {
					...prevForm?.name,
					errorMessage: `Vui lòng nhập tên dự án`,
				},
			}));

			return;
		}

		if (!form.status.value) {
			setForm((prevForm) => ({
				...prevForm,
				status: {
					...prevForm?.status,
					errorMessage: `Vui lòng chọn trạng thái dự án!`,
				},
			}));

			return;
		}

		if (
			!form?.executionTime?.value.dateStart ||
			!form?.executionTime?.value.dateEnd
		) {
			setForm((prevForm) => ({
				...prevForm,
				executionTime: {
					...prevForm?.executionTime,
					errorMessage: `Vui lòng chọn thời gian thực hiện`,
				},
			}));

			return;
		}

		if (!form?.team?.value) {
			setForm((prevForm) => ({
				...prevForm,
				team: {
					...prevForm?.team,
					errorMessage: `Vui lòng chọn team`,
				},
			}));

			return;
		}

		if (!form?.performers?.value?.length) {
			setForm((prevForm) => ({
				...prevForm,
				performers: {
					...prevForm?.performers,
					errorMessage: `Vui lòng chọn người thực hiện!`,
				},
			}));

			return;
		}

		const performers = form?.performers?.value?.map((user) => user?._id);
		const teams = form?.team?.value?.map((team) => team?.value);

		try {
			const status = [...form?.status?.value].join("");

			dispatch(
				UpdateProject({
					id: project?._id,
					body: {
						name: form?.name?.value,
						status,

						dateStart:
							typeof form?.executionTime?.value?.dateStart !== "string"
								? moment(
										form?.executionTime?.value?.dateStart?.toDate()
									)
									?.startOf("day")
									?.toISOString()
								: form?.executionTime?.value?.dateStart,
						dateEnd:
							typeof form?.executionTime?.value?.dateStart !== "string"
								? moment(
										form?.executionTime?.value?.dateEnd?.toDate()
									)
									?.endOf("day")
									?.toISOString()
								: form?.executionTime?.value?.dateEnd,
						performers,
						team: teams,
					},
				})
			);

			dispatch(onClose());
		} catch (error) {
			console.log("error: ", error);
		}
	};

	const onFocusChange = (value) => {
		dispatch(setModal({ isFocused: value }));
	};

	return (
		<>
			{Object.keys(form)?.map((key) => {
				switch (form[key]?.type) {
					case "input":
						return (
							<Input
								key={key}
								size="sm"
								fullWidth
								radius="sm"
								variant="bordered"
								labelPlacement="outside"
								label={form[key]?.label}
								placeholder={form[key]?.placeholder}
								classNames={{
									base: "mb-1",
									inputWrapper: "py-2 !h-auto data-[hover=true]:border-primary-400 group-data-[focus=true]:border-primary-400 group-data-[focus=true]:border-2 group-data-[focus=true]:border-primary-400",
									label: "text-base text-task-title mb-3",
									input: "text-sm text-task-title tracking-wider",
								}}
								value={form[key]?.value}
								onChange={(event) =>
									handleOnChangeInput(event, key)
								}
								onKeyDown={(event) =>
									event.key === "Enter" && onSubmit()
								}
								isInvalid={Boolean(form[key]?.errorMessage)}
								errorMessage={form[key]?.errorMessage}
							/>
						);

					case "status":
						return (
							<Select
								key={key}
								fullWidth
								radius="sm"
								variant="bordered"
								labelPlacement="outside"
								label={form[key]?.label}
								placeholder={form[key]?.placeholder}
								classNames={{
									trigger: "data-[open=true]:border-primary data-[hover=true]:border-primary data-[focus=true]:border-primary",
									label: "text-base text-task-title mb-1",
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
								selectedKeys={new Set([form[key]?.value])}
								onSelectionChange={(value) =>
									handleOnChangeInput(value, key)
								}
								isInvalid={Boolean(form[key]?.errorMessage)}
								errorMessage={form[key]?.errorMessage}
							>
								{projectStatus.map(
									(option, index) =>
										index > 0 && (
											<SelectItem
												key={option.value}
												value={option.value}
											>
												{option.label}
											</SelectItem>
										)
								)}
							</Select>
						);

					case "select":
						return (
							<div key={key}>
								<p className="mb-1 text-base font-normal text-black">
									{form[key]?.label}
								</p>
								<SelectUsers
									light={false}
									fullWidth
									selectionMode={form[key]?.selectionMode}
									title={form[key]?.label}
									isInvalid={Boolean(form[key]?.errorMessage)}
									usersSelected={form[key]?.value}
									setUsersSelected={(value) =>
										handleOnChangeInput(value, key)
									}
								/>
								{form[key]?.errorMessage && (
									<p className="mt-1 ml-1 text-tiny text-danger">
										{form[key]?.errorMessage}
									</p>
								)}
							</div>
						);

					case "time":
						return (
							<p key={key}>
								<p className="mb-1 text-base font-normal text-black">
									{form[key]?.label}
								</p>
								<I18nProvider locale="en-GB">
									<DateRangePicker
										popoverProps={{
											className:
												"min-w-[300px] w-[300px]",
										}}
										calendarProps={{
											className: "!w-full !max-w-full",
											content: "!w-full !max-w-full",
										}}
										className="w-full"
										variant="bordered"
										defaultValue={{
											start: form[key]?.value?.dateStart,
											end: form[key]?.value?.dateEnd,
										}}
										onChange={(date) =>
											handleOnChangeInput(date, key)
										}
										isInvalid={Boolean(
											form[key]?.errorMessage
										)}
										errorMessage={form[key]?.errorMessage}
										onOpenChange={onFocusChange}
									/>
								</I18nProvider>
								{form[key]?.errorMessage && (
									<p className="mt-1 ml-1 text-tiny text-danger">
										{form[key]?.errorMessage}
									</p>
								)}
							</p>
						);

					case "autocomplete":
						return (
							<p key={key}>
								<p className="mb-1 text-base font-normal text-black">
									{form[key]?.label}
								</p>
								<ReactSelect
									defaultValue={form[key]?.value}
									placeholder={form[key]?.placeholder}
									menuPosition="fixed"
									isMulti={true}
									options={form[key]?.dataOptions}
									className="basic-multi-select text-sm z-20 text-task-title"
									classNamePrefix="select"
									onChange={(event) =>
										handleOnChangeInput(event, key)
									}
								/>
								{form[key]?.errorMessage && (
									<p className="text-tiny text-danger mt-1 ml-1">
										{form[key]?.errorMessage}
									</p>
								)}
							</p>
						);
				}
			})}

			<ModalFooter className="px-0">
				<Button
					radius="sm"
					color="danger"
					variant="solid"
					className="bg-danger-400"
					onPress={onSubmit}
					isLoading={isLoading}
				>
					Xác nhận
				</Button>
				<Button
					radius="sm"
					color="primary"
					onPress={() => dispatch(onClose())}
				>
					Hủy
				</Button>
			</ModalFooter>
		</>
	);
};

export default FormEditProject;
