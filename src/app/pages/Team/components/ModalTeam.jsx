import React, {useEffect, useState} from "react";
import {yupResolver} from "@hookform/resolvers/yup";
import RenderFormData from "app/components/RenderFormData/RenderFormData";
import {useForm} from "react-hook-form";
import Select from "react-select";

import NotifyMessage from "_utils/notify";
import CustomModal from "app/components/Modal/CustomModal";
import {teamSchema} from "_utils/validation";

import {useDispatch} from "react-redux";

import {useSelector} from "react-redux";
import {userAction} from "_redux/slice/user.slice";
import {departmentAction} from "_redux/slice/departmentSlice";
import {updateTeam} from "services/api.service";
import {addTeam} from "services/api.service";
import {getTeamById} from "services/api.service";

const ModalTeam = ({isOpen, onClose, itemId, onOpenChange, onGetPaging}) => {
	const dispatch = useDispatch();
	const getTeamData = async (id) => {
		const res = await getTeamById(id);
		const data = res.data?.result[0];
		setValue("name", data?.name);
		setValue(
			"leaders",
			data?.leaders
				? data?.leaders.map((leader) => ({
						value: leader._id,
						label: `${leader.lastName} ${leader.firstName}`,
				  }))
				: []
		);
	};
	const {listUser} = useSelector((state) => state?.user || []);

	const [searchUser, setSearchUser] = useState("");
	const userOptions = listUser.map((user) => ({
		value: user._id,
		label: user.fullName,
	}));

	useEffect(() => {
		if (itemId) {
			getTeamData(itemId);
		}
	}, [itemId]);

	useEffect(() => {
		dispatch(
			userAction.getPagination({
				pageIndex: 1,
				pageSize: 100,
				search: searchUser || "",
			})
		);
	}, [searchUser]);
	const {
		handleSubmit,
		watch,
		control,
		setValue,
		formState: {errors, isSubmitting},
	} = useForm({
		defaultValues: {
			name: "",
			leaders: [],
		},
		resolver: yupResolver(teamSchema),
	});

	const listData = [
		{
			label: "Tên đội",
			name: "name",
			kind: "input",
			placeholder: "Nhập tiêu đề",
			width: "col-span-12",
		},
		{
			label: "Trưởng nhóm",
			name: "leaders",
			kind: "multiSelect",
			placeholder: "Nhập trưởng nhóm",
			width: "col-span-12",
			children: userOptions,
		},
	];

	const onSubmit = handleSubmit(async (values) => {
		const newValues = {
			name: values.name,
			leaders: values.leaders.map((leader) => leader.value),
		};
		try {
			if (itemId) {
				const data = await updateTeam(itemId, newValues);
				if (data?.data?.status === 1) {
					NotifyMessage("Cập nhật nhóm thành công", "success");
					onClose();
					onGetPaging("");
				} else {
					NotifyMessage("Cập nhật nhóm thất bại", "error");
				}
			} else {
				const data = await addTeam(newValues);
				if (data?.data?.status === 1) {
					NotifyMessage("Thêm nhóm thành công", "success");
					onClose();

					onGetPaging("");
				} else {
					NotifyMessage("Thêm nhóm thất bại", "error");
				}
			}
		} catch (error) {
			NotifyMessage("Có lỗi xảy ra", "error");
		}
	});

	return (
		<CustomModal
			title={itemId ? "Cập nhật nhóm" : "Thêm nhóm"}
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			onSubmit={onSubmit}
		>
			<div className="grid grid-cols-12 gap-4">
				{listData?.map((item) => {
					return (
						<>
							<div className={item?.width}>
								<RenderFormData item={item} control={control} errors={errors} />
							</div>
						</>
					);
				})}
			</div>
		</CustomModal>
	);
};

export default ModalTeam;
