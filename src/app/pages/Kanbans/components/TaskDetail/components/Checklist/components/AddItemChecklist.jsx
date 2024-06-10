import { useMemo, useState } from "react";
import { Button, Input, Textarea } from "@nextui-org/react";
import { useSelector, useDispatch } from "react-redux";
import { cloneDeep } from "lodash";
import { addChecklist, setTask } from "_redux/slice/taskSlice";
import NotifyMessage from "_utils/notify";
import { addItemChecklist } from "services/api.service";


function AddItemChecklist({ checklist }) {
    const dispatch = useDispatch();
    const { task } = useSelector(state => state.tasks);
    const [title, setTitle] = useState('');
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const chst = useMemo(() => {
        const getChecklist = task?.checklist?.find(el => el?._id === checklist?._id);

        return getChecklist;
    }, [task]);

    const handleAddItemChecklist = async () => {
        if (!title) {
			return setVisible(false);
		}

        const items = chst?.items.length ? cloneDeep(chst.items) : [];

		try {
			setIsLoading(true);

			const { data } = await addItemChecklist(chst?._id, {
				title,
			});

			if (data.status === 1) {
                items.push(data?.data);

				const newChecklist = task?.checklist?.map((ck) => {
					if (ck._id === checklist?._id) {
						return { ...ck, items };
					}

					return ck;
				});

				dispatch(
					addChecklist({ taskId: task?._id, checklist: newChecklist })
				);

				dispatch(setTask({ ...task, checklist: newChecklist }));

                setVisible(false);
			}
		} catch (error) {
			console.log("error: ", error);
			NotifyMessage("Cập nhật tên việc làm thất bại. Vui lòng thử lại!", "error");
		} finally {
			setIsLoading(false);
		}
	};

    const onKeyDown = (event) => {
        if(event.key === "Enter") {
            // Ngăn không cho giá trị xuống dòng
            event.preventDefault();
            handleAddItemChecklist()
        }
    };

    if(visible) {
        return (
            <div className="ml-12 mb-3 max-w-item-checklist">
                <Input
                    size="sm"
                    variant="bordered"
                    placeholder={`Thêm chỉ mục...`}
                    classNames={{
                        inputWrapper:
                            `rounded-md py-2 !h-auto data-[hover=true]:border-primary-400 group-data-[focus=true]:border-primary-400 group-data-[focus=true]:border-2 group-data-[focus=true]:border-primary-400 ${visible ? "border-primary-400" : ""}`,
                        label: "hidden",
                        input: "text-sm text-task-title",
                    }}
                    onValueChange={setTitle}
                    onKeyDown={onKeyDown}
                />
                <div className="mt-3 flex flex-row gap-2 items-center justify-start">
                    <Button
                        color="primary"
                        variant="solid"
                        isLoading={isLoading}
                        onPress={handleAddItemChecklist}
                        className="font-medium w-max px-3 min-w-0 min-h-0 h-8 rounded-md"
                    >
                        Lưu
                    </Button>
                    <Button
                        color="primary"
                        variant="solid"
                        onPress={() => setVisible(false)}
                        className="font-medium w-max px-3 min-w-0 min-h-0 rounded-md h-8 bg-btn-detail text-task-title hover:bg-slate-200"
                    >
                        Hủy
                    </Button>
                </div>
            </div>
        )
    } else {
        return (
            <Button
                variant="light"
                className={`ml-12 bg-btn-detail w-max h-8 relative data-[hover=true]:bg-btn-detail-hover items-center rounded-sm justify-center py-1 px-2`}
                onPress={() => setVisible(true)}
            >
                <span className="font-semibold text-[#505f79]">
                    Thêm một mục
                </span>
            </Button>
        )
    } 
}

export default AddItemChecklist;