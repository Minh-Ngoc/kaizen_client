import { useEffect, useState } from "react";
import {
	Input,
	ModalFooter,
	Button,
	DateRangePicker,
} from "@nextui-org/react";
import { addNewProject } from "services/api.service";
import NotifyMessage from "_utils/notify";
import { setProjects } from "_redux/slice/projectSlice";
import { onClose } from "_redux/slice/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import SelectUsers from "app/components/SelectUsers";
import { getAllTeams } from "_redux/slice/teamSlice";
import moment from "moment";
import Select from "react-select";
import { I18nProvider } from "@react-aria/i18n";
import { setModal } from "_redux/slice/modalSlice";

const FormNewProject = () => {
	const dispatch = useDispatch();
	const { listTeam } = useSelector((state) => state.team);

	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		dispatch(getAllTeams());
	}, []);

	const [form, setForm] = useState({
		name: {
			label: "Tên dự án",
			type: "input",
			errorMessage: "",
			placeholder: "Dự án 1...",
			value: "",
		},
		executionTime: {
			label: "Thời gian thực hiện",
			type: "time",
			errorMessage: "",
			value: {
				dateStart: "",
				dateEnd: "",
			},
		},
		team: {
			label: "Team",
			type: "autocomplete",
			dataOptions: listTeam?.map(item => ({ label: item?.name, value: item?._id })),
			errorMessage: "",
			placeholder: "Chọn Team...",
			value: "",
		},
		performers: {
			label: "Người thực hiện",
			type: "select",
			selectionMode: "multiple",
			errorMessage: "",
			placeholder: "Chọn người theo dõi...",
			value: [],
		},
	});

	const handleOnChangeInput = (event, key) => {
		let value;

		switch (key) {
			case "name":
				value = event?.target?.value;
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
			setIsLoading(true);

			const { data } = await addNewProject({
				name: form?.name?.value,
				dateStart: moment(form?.executionTime?.value.dateStart.toDate())
					.startOf("day")
					.toISOString(),
				dateEnd: moment(form?.executionTime?.value.dateEnd.toDate())
					.endOf("day")
					.toISOString(),
				performers,
				team: teams,
			});

			if (data?.status === 1) {
				dispatch(setProjects(data.project));
				dispatch(onClose());

				NotifyMessage("Tạo dự án thành công!", "success");

				return {
					status: 1,
					project: data.project,
				};
			}
		} catch (error) {
			console.log("error: ", error);
			NotifyMessage("Tạo dự án thất bại. Vui lòng thử lại!", "error");

			return 0;
		} finally {
			setIsLoading(false);
		}
	};

	const onFocusChange = (value) => {
		dispatch(setModal({ isFocused: value }))
	}

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
									inputWrapper:
										"py-2 !h-auto data-[hover=true]:border-primary-400 group-data-[focus=true]:border-primary-400 group-data-[focus=true]:border-2 group-data-[focus=true]:border-primary-400",
									label:
										"text-base text-task-title mb-3",
									input:
										"text-sm text-task-title tracking-wider",
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

					case "select":
						return (
							<div key={key}>
								<p className="mb-1 text-base font-normal text-black">
									{form[key]?.label}
								</p>
								<SelectUsers
									light={false}
									fullWidth
									variant="bordered"
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
							<div key={key}>
								<p className="mb-1 text-base font-normal text-black">
									{form[key]?.label}
								</p>
								<I18nProvider locale="en-GB">
									<DateRangePicker
										popoverProps={{
											className: "min-w-[300px] w-[300px]"
										}}
										calendarProps={{
											className: '!w-full !max-w-full',
											content: '!w-full !max-w-full',
										}}
										radius="sm"
										className="w-full"
										variant="bordered"
										onChange={(date) =>
											handleOnChangeInput(date, key)
										}
										isInvalid={Boolean(form[key]?.errorMessage)}
										errorMessage={form[key]?.errorMessage}
										onFocusChange={onFocusChange}
									/>
								</I18nProvider>
							</div>
						);

					case "autocomplete":
						return (
							<div key={key}>
								<p className="mb-1 text-base font-normal text-black">
									{form[key]?.label}
								</p>
								<Select
									placeholder={form[key]?.placeholder}
									menuPosition="fixed"
									isMulti={true}
									options={form[key]?.dataOptions}
									className={`basic-multi-select text-sm z-20 text-task-title`}
									classNamePrefix="select"
									onChange={event => handleOnChangeInput(event, key)}
								/>
								{form[key]?.errorMessage && (
									<p className="text-tiny text-danger mt-1 ml-1">
										{form[key]?.errorMessage}
									</p>
								)}
							</div>
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

export default FormNewProject;
