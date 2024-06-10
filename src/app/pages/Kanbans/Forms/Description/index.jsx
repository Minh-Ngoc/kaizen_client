import { useMemo, useState } from "react";
import { GrTextAlignFull } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { setTask, UpdateTask, setDescription } from "_redux/slice/taskSlice";
import BtnMoreDetail from "app/components/BtnMoreDetail";
import FormConfirm from "app/components/FormConfirm";
import TinyMCE from "app/components/TinyMCE";

function Description() {
	const dispatch = useDispatch();
	const { task, isLoading } = useSelector((state) => state.tasks);
	const [visible, setVisible] = useState(false);

	const handleSetVisible = () => {
		setVisible(!visible);
	};

	const onSubmit = async () => {		
		if (!task?.description) {
			return handleSetVisible();
		}
        // Create a new Date object
        dispatch(UpdateTask({
            id: task?._id, 
            body: {
                description: task?.description
            }
        }));

		dispatch(setTask({ 
            ...task,
			description: task?.description
        }));

		if(!isLoading) {
			handleSetVisible();
		}

    };

	const createMarkup = useMemo(() => {
		if(task?.description) {
			return <div dangerouslySetInnerHTML={{ __html: task?.description }} />
		}
		return "Thêm mô tả chi tiết hơn…";
	}, [task]);

	return (
		<div className="relative mb-6 mt-2">
			<div className="mb-3">
				<div className="absolute left-0 top-0 p-1">
					<GrTextAlignFull className="text-xl text-task-icon" />
				</div>

				<p className="ml-12 mt-1 text-base text-task-title leading-7 font-semibold select-none">
					Mô tả
				</p>
			</div>

			<div className="ml-12">
				{!visible ? (
					<BtnMoreDetail
						label={createMarkup}
						bg="bg-btn-detail"
						height="h-14"
						onClick={handleSetVisible}
					/>
				) : (
					<FormConfirm
						isDismissable={true}
						textConfirm={"Lưu"}
						textCancel={
							<p className="text-task-title font-semibold px-2">
								Hủy
							</p>
						}
						onClose={handleSetVisible}
						isLoading={isLoading}
						form={
							<TinyMCE
								placeholder={
									"Nhập mô tả chi tiết của bạn tại đây..."
								}
								value={task?.description}
								onEditorChange={(value) =>
									dispatch(setDescription(value))
								}
							/>
						}
						onConfirm={onSubmit}
					/>
				)}
			</div>
		</div>
	);
}

export default Description;
