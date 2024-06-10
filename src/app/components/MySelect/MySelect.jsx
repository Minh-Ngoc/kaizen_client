import {twMerge} from "tailwind-merge";
import {useController} from "react-hook-form";

const MySelect = ({control, errorMessage, className, children, ...props}) => {
	const {field} = useController({
		name: props.name || "",
		control,
		defaultValue: "",
	});
	return (
		<div className="">
			<label
				htmlFor={props.id || props.name}
				className="block capitalize mb-2 text-sm font-semibold text-gray-900"
			>
				{props.label}
			</label>
			<select
				className={twMerge(
					"bg-white  border-gray-300 w-full p-2 text-xs lg:text-sm  font-light border rounded-lg text-black ",
					className
				)}
				{...field}
				{...props}
			>
				<option value="">---chọn---</option>

				{children}
			</select>

			{errorMessage && (
				<div className="text-sm text-red-500">{errorMessage}</div>
			)}
		</div>
	);
};

export default MySelect;
