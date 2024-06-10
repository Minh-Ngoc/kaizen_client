import { useCallback, useState } from "react";
import { Image, Skeleton, Card, Button } from "@nextui-org/react";
import { IoClose, IoDocumentTextOutline } from "react-icons/io5";
import FileUpload from "app/components/FileUpload";
import { useDispatch, useSelector } from "react-redux";
import { UploadAttachmentsTask } from "_redux/slice/taskSlice";

function Attachments() {
    const dispatch = useDispatch();
    const { task, isLoading: isLoadingSubmit } = useSelector(state => state.tasks);
	const [files, setFiles] = useState([]);
	const [imageSources, setImageSources] = useState({});
	const [isLoading, setIsLoading] = useState(false);

	const handleUploadFile = (event) => {
		setFiles(event?.target?.files || event);
	};

	const renderImage = useCallback(
		(file, index) => {
			const imgsType = ["jpeg", "jpg", "png", "gif", "tiff", "psd"];

			const fileExtension = file?.name?.split(".").pop()?.toLowerCase();

			if (imgsType.includes(fileExtension)) {
				if (!imageSources[file.name]) {
					const reader = new FileReader();
					reader.onloadstart = () => setIsLoading(true); // Set loading state when loading starts
					reader.onloadend = () => setIsLoading(false); // Set loading state when loading ends
					reader.onload = () => {
						setImageSources((prevState) => ({
							...prevState,
							[file.name]: reader.result,
						}));
					};
					reader.readAsDataURL(file);
				}

				return (
					<Image
						key={index}
						alt={`Preview ${index}`}
						src={imageSources[file.name] || ""}
						radius="sm"
						className="w-16 min-w-16 h-auto max-h-14 object-cover"
					/>
				);
			}

			return (
				<div className="w-16 min-w-16 flex justify-center items-center">
					<IoDocumentTextOutline
						key={index}
						size={"46px"}
						color="dark"
					/>
				</div>
			);
		},
		[files, imageSources]
	);

    const removeFiles = (index) => {
        const fileListArr = [...files];
        fileListArr.splice(index, 1);

        if(index >= 0) {
            setFiles(fileListArr);
        }
    }

	const filesSize =
		files?.length && files?.length < 10
			? `0${files?.length}`
			: files?.length || 0;

    const onSubmit = async () => {
        dispatch(UploadAttachmentsTask({
            id: task?._id,
            body: files
        }));
    }


	return (
		<div className="mt-2 px-1 flex flex-col gap-2 w-full">
			<FileUpload
				light
				label={"Đính kèm tệp từ máy tính của bạn"}
				onChange={handleUploadFile}
			/>

            {!!files?.length && (
                <div className="my-2">
                    <p className="text-sm text-task-title font-medium mb-3">
                        Đính kèm hiện tại: {`(${filesSize} tệp)`}   
                    </p>

                    <div className="flex flex-col gap-y-4">
                        {[...files]?.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between"
                            >
                                {isLoading ? (
                                    <Card
                                        className="w-full space-y-5 p-0 bg-btn-detail-hover flex-row items-center gap-x-5"
                                        radius="sm"
                                    >
                                        {/* Image */}
                                        <Skeleton
                                            isLoaded={false}
                                            className="rounded-md !mt-0"
                                            classNames={{
                                                base: "bg-btn-detail-hover",
                                                content: "bg-btn-detail-hover",
                                            }}
                                        >
                                            <div className="w-16 h-11 rounded-md shadow-btn-detail-hover"></div>
                                        </Skeleton>

                                        <div className="flex flex-col gap-1 item-center !mt-0">
                                            {/* Name */}
                                            <Skeleton
                                                isLoaded={false}
                                                className="rounded-md !mt-0"
                                                classNames={{
                                                    base: "bg-btn-detail-hover",
                                                    content: "bg-btn-detail-hover",
                                                }}
                                            >
                                                <div className="w-40 h-3 rounded-sm shadow-btn-detail-hover"></div>
                                            </Skeleton>

                                            {/* Size */}
                                            <Skeleton
                                                isLoaded={false}
                                                className="rounded-md !mt-0"
                                                classNames={{
                                                    base: "bg-btn-detail-hover w-10",
                                                    content: "bg-btn-detail-hover",
                                                }}
                                            >
                                                <div className="w-10 h-3 rounded-sm shadow-btn-detail-hover"></div>
                                            </Skeleton>
                                        </div>
                                    </Card>
                                ) : (
                                    <div className="flex gap-x-2 items-center overflow-hidden">
                                        {renderImage(file, index)}

                                        <div className="flex flex-col gap-y-1 py-2">
                                            <p className="line-clamp-1 break-all text-left text-sm text-task-label align-middle">
                                                {file?.name}
                                            </p>
                                            <p>
                                                {(
                                                    Number(file?.size) /
                                                    (1024 * 1024)
                                                ).toFixed(2)}{" "}
                                                MB
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <div
                                    className="ml-1 shadow-[rgba(255_255_255_0.27)_0px_0px_0.25em_rgba(255_255_255_0.05)_0px_0.25em_1em] bg-btn-detail hover:bg-btn-detail-hover rounded-full p-1 cursor-pointer"
                                    onClick={() => removeFiles(index)}
                                >
                                    <IoClose className="text-sm text-red-700" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Button
				fullWidth
				variant="light"
				className={`z-10 mt-3 sticky bottom-0 bg-primary hover:data-[hover=true]:bg-primary-400 items-center rounded-sm py-1 px-2`}
                isLoading={isLoadingSubmit}
                onClick={onSubmit}
			>
				<span className="font-semibold text-white">Lưu</span>
			</Button>
		</div>
	);
}

export default Attachments;
