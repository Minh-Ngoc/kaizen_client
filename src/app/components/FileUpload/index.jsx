import { FormControl, FormLabel } from "@chakra-ui/react";
import { VscCloudUpload } from "react-icons/vsc";
import { Button } from "@nextui-org/react";
import { useRef } from "react";

function FileUpload({ light, label, onChange, multiple, accept, ...rest }) {
	const ref = useRef(null);

	const handleRefInput = () => {
		ref.current.click();
	};

	const handleDragOver = (e) => {
		e.preventDefault();
	  };
	
	  const handleDrop = (e) => {
		e.preventDefault();

		const files = e.dataTransfer.files;

		if (files && Object.keys(files).length > 0) {
		  onChange(files);
		}
	};

	return (
		<FormControl mb={6} onDragOver={handleDragOver} onDrop={handleDrop}>
			<FormLabel mb={5} fontSize="14px" fontWeight="500" color={light ? "dark" : "white"} textAlign={"left"}>
				{label}
			</FormLabel>
			<Button
				fullWidth
				radius="sm"
				variant="light"
				className={`border gap-1 border-dashed ${light ? "border-none bg-btn-detail data-[hover=true]:bg-btn-detail-hover" : "border-white"}`}
				onClick={handleRefInput}
			>
				<VscCloudUpload
					size={"22px"}
					className={`cursor-pointer min-w-max ${light ? "text-task-icon" : "text-white"}`}
				/>
				<FormLabel
					fontSize="14px"
					fontWeight="400"
					color={light ? "dark" : "white"}
					cursor={"pointer"}
					mb={0}
				>
					Thả file vào đây hoặc click để tải lên
				</FormLabel>
			</Button>

			<input
				ref={ref}
				hidden
				multiple={multiple || true}
				accept={accept}
				type="file"
				onChange={onChange}
				{...rest}
			/>
		</FormControl>
	);
}

export default FileUpload;
