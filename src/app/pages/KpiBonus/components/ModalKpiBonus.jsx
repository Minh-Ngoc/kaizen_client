import React, {useEffect, useState} from "react";
import {yupResolver} from "@hookform/resolvers/yup";

import {kpiBonusSchema} from "_utils/validation";
import {useFieldArray, useForm} from "react-hook-form";
import {addKpiBonus} from "services/api.service";

import NotifyMessage from "_utils/notify";
import {getKpiBonusById} from "services/api.service";

import {updateKpiBonus} from "services/api.service";
import MyInput from "app/components/MyInput/MyInput";
import {IoMdAdd} from "react-icons/io";
import {Button} from "@nextui-org/react";
import {BiTrash} from "react-icons/bi";
import CustomModal from "app/components/Modal/CustomModal";
import {addCommas} from "_utils";
import MySelect from "app/components/MySelect/MySelect";

const ModalKpiBonus = ({
	isOpen,
	onClose,
	itemId,
	onOpenChange,
	onGetPaging,
}) => {
	useEffect(() => {
		if (itemId) {
			getKpiBonusData(itemId);
		}
	}, [itemId]);

	const emptyLevel = {
		levelName: "",
		volume: "",
		top: "",
		customer: "",
		totalDeposit: "",
		award: "",
	};

	const {
		handleSubmit,
		control,
		setValue,
		watch,
		formState: {errors, isSubmitting},
	} = useForm({
		defaultValues: {
			name: "",
			level: itemId ? [] : [emptyLevel],
		},
		resolver: yupResolver(kpiBonusSchema),
	});
	const {fields, append, remove, update} = useFieldArray({
		control,
		name: "level",
	});

	const getKpiBonusData = async (id) => {
		const res = await getKpiBonusById(id);
		const data = res.data?.result;
		setValue("name", data?.name);
		data?.level.map((item) => {
			append({
				levelName: item.name,
				volume: addCommas(item.condition.volume.replace(/000$/, "")),
				top: item.condition.top,
				customer: item.condition.customer,
				totalDeposit: addCommas(
					item.condition.totalDeposit.replace(/000$/, "")
				),
				award: addCommas(item.award.replace(/000$/, "")),
			});
		});
	};
	const onSubmit = handleSubmit(async (values) => {
		const newData = {
			name: values.name,
			level: values?.level.map((item) => ({
				name: item.levelName,
				condition: {
					volume: item.volume.split(",").join("").concat("000"),
					top: item.top,
					customer: item.customer,
					totalDeposit: item.totalDeposit.split(",").join("").concat("000"),
				},
				award: item.award.split(",").join("").concat("000"),
			})),
		};

		if (itemId) {
			const data = await updateKpiBonus(itemId, newData);
			if (data?.data?.status === 1) {
				NotifyMessage("Cập nhật kpi bonus thành công", "success");
				onClose();
				onGetPaging("");
			} else {
				NotifyMessage("Cập nhật kpi bonus thất bại", "error");
			}
		} else {
			const data = await addKpiBonus(newData);
			if (data?.data?.status === 1) {
				NotifyMessage("Thêm kpi bonus thành công", "success");
				onClose();
				onGetPaging("");
			} else {
				NotifyMessage("Thêm kpi bonus thất bại", "error");
			}
		}
	});
	const arrFields = {
		levelName: {
			label: "Level",
			name: "levelName",
			kind: "input",
			placeholder: "Nhập tên cấp độ",
			type: "number",
		},
		volume: {
			label: "Volume (x1000)",
			name: "volume",
			kind: "input",
			formatNumber: true,
			placeholder: "Nhập số lượng",
		},
		top: {
			label: "top",
			name: "top",
			// kind: "input",
			kind: "select",

			placeholder: "Nhập số top",
			children: (
				<>
					<option value="1-2">1-2</option>,<option value="3-5">3-5</option>,
					<option value="6-10">6-10</option>,
				</>
			),
			// type: "number",
		},
		customer: {
			label: "Khách hàng",
			name: "customer",
			kind: "input",
			type: "number",

			placeholder: "Nhập số khách hàng",
		},
		totalDeposit: {
			label: "Tổng nạp (x1000)",
			name: "totalDeposit",
			kind: "input",

			placeholder: "Nhập tổng nạp",
			formatNumber: true,
		},
		award: {
			label: "Thưởng (x1000)",
			name: "award",
			kind: "input",
			formatNumber: true,
			placeholder: "Nhập tiền thưởng",
		},
	};
	return (
		<CustomModal
			title={itemId ? "Cập nhật kpi bonus" : "Thêm kpi bonus"}
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			onSubmit={onSubmit}
		>
			<MyInput
				control={control}
				name="name"
				type="text"
				label="Tên KPI bonus"
				placeholder="Nhập tên KPI bonus..."
				errorMessage={errors?.name ? errors?.name?.message : undefined}
			/>

			{fields.map((field, index) => (
				<div className="flex items-end gap-5" key={index}>
					<div className="flex-1 grid grid-cols-12 gap-4">
						{Object.keys(field)?.map((item, idex) => (
							<>
								{arrFields[item]?.name && (
									<div className="col-span-2">
										{arrFields[item]?.kind === "select" ? (
											<MySelect
												control={control}
												formatNumber={arrFields[item]?.formatNumber}
												name={`level.${index}.${arrFields[item]?.name}`}
												type={arrFields[item]?.type || "text"}
												placeholder={arrFields[item]?.placeholder}
												label={arrFields[item]?.label}
												errorMessage={
													errors?.level?.[index]?.[arrFields[item]?.name]
														? errors?.level?.[index]?.[arrFields[item]?.name]
																?.message
														: undefined
												}
											>
												{arrFields[item]?.children}
											</MySelect>
										) : (
											<MyInput
												control={control}
												formatNumber={arrFields[item]?.formatNumber}
												name={`level.${index}.${arrFields[item]?.name}`}
												type={arrFields[item]?.type || "text"}
												placeholder={arrFields[item]?.placeholder}
												label={arrFields[item]?.label}
												errorMessage={
													errors?.level?.[index]?.[arrFields[item]?.name]
														? errors?.level?.[index]?.[arrFields[item]?.name]
																?.message
														: undefined
												}
											/>
										)}
									</div>
								)}
							</>
						))}
					</div>
					<Button
						isIconOnly
						color="danger"
						aria-label="Like"
						className={`${watch("level").length <= 1 ? "hidden" : ""}`}
						onClick={() => remove(index)}
					>
						<BiTrash size={20} />
					</Button>
				</div>
			))}
			<Button
				color="primary"
				variant="bordered"
				startContent={<IoMdAdd />}
				onClick={() => append(emptyLevel)}
				type="button"
				className="w-fit flex-shrink-0"
			>
				Thêm
			</Button>
		</CustomModal>
	);
};

export default ModalKpiBonus;
