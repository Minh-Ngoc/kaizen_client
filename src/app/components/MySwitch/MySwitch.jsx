import { useController } from "react-hook-form";
import { Switch } from "@nextui-org/react";
const MySwitch = ({
	control,
	errorMessage,
	className,
	children,
	...props
}) => {
	const { field } = useController({
		name: props.name || "",
		control,
		defaultValue: "",
	});

	return (
		<div>
			<label
				htmlFor={props.id || props.name}
				className="block capitalize mb-2 text-sm font-semibold text-gray-900"
			>
				{props.label}
			</label>

			<Switch
				size="lg"
				{...field}
				{...props}
				classNames={{
					label: "text-black",
				}}
				isSelected={field?.value}
			>
				{children}
			</Switch>
		</div>
	);
};
export default MySwitch;
