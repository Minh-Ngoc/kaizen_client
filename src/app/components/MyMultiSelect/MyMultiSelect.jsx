import {useController} from "react-hook-form";
import Select from "react-select";
const MyMultiSelect = ({
	control,
	errorMessage,
	className,
	isMulti = true,
	children = [],
	...props
}) => {
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
			<div>
				<Select
					{...field}
					{...props}
					menuPosition="fixed"
					defaultValue={""}
					// onInputChange={(value) => {
					// 	field.onChange(value);
					// }}
					isMulti={isMulti}
					name="colors"
					options={children}
					className="basic-multi-select text-sm"
					classNamePrefix="select"
				/>
			</div>

			{errorMessage && (
				<div className="text-sm text-red-500">{errorMessage}</div>
			)}
		</div>
	);
};

export default MyMultiSelect;
