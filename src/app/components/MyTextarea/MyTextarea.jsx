import {useController} from "react-hook-form";
import {Textarea} from "@nextui-org/react";

const MyTextarea = ({control, errorMessage, className, ...props}) => {
	const {field} = useController({
		name: props.name || "",
		control,
		defaultValue: "",
	});
	return (
		<div className="">
			<label
				className="block capitalize mb-2 text-sm font-semibold text-gray-900"
				htmlFor=""
			>
				{props.label}
			</label>
			<Textarea
				// label={props.label}

				{...field}
				{...props}
				placeholder={props.placeholder}
				label=""
				className="max-w-full w-full"
				classNames={{
					inputWrapper:
						"bg-transparent data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent group-data-[focus-visible=true]:bg-transparent border ",
					input: "!text-black",
					label: "!text-black",
				}}
			/>
			{errorMessage && (
				<div className="text-sm text-red-500">{errorMessage}</div>
			)}
		</div>
	);
};

export default MyTextarea;
