import { twMerge } from "tailwind-merge";
import { useController } from "react-hook-form";
import { addCommas } from "_utils";

const MyInput = ({
	control,
	errorMessage,
	className,
	isRequired = false,
	...props
}) => {
	const { field } = useController({
		name: props.name || "",
		control,
		defaultValue: "",
	});

	return (
		<div className="">
			<label
				htmlFor={props.id || props.name}
				className=" mb-2 text-sm font-semibold text-black flex items-center gap-1"
			>
				{props.label}
				{isRequired && (
					<span className="text-red-500 font-normal">(*)</span>
				)}
			</label>
			<div>
				<input
					{...field}
					{...props}
					onChange={
						props.formatNumber
							? (e) => {
									let formattedValue = addCommas(
										e.target.value
									);
									field.onChange(formattedValue);
							  }
							: field.onChange
					}
					className={twMerge(
						"bg-white rounded-lg  border-gray-300 w-full p-2 text-xs lg:text-sm  font-light border  focus:border-none",
						className
					)}
				/>
			</div>

			{errorMessage && (
				<div className="text-sm text-red-500">{errorMessage}</div>
			)}
		</div>
	);
};

export default MyInput;
