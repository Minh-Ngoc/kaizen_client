import MyInput from "../MyInput/MyInput";
import MySelect from "../MySelect/MySelect";
import MySwitch from "../MySwitch/MySwitch";
import MyMultiSelect from "../MyMultiSelect/MyMultiSelect";
import MyTextarea from "../MyTextarea/MyTextarea";
const RenderFormData = ({item, control, errors}) => {
	const componentMap = {
		input: MyInput,
		switch: MySwitch,
		select: MySelect,
		multiSelect: MyMultiSelect,
		textarea: MyTextarea,
	};

	const Component = componentMap[item?.kind];
	const children =
		(item?.kind === "switch" ||
			item?.kind === "select" ||
			item?.kind === "multiSelect") &&
		item.children;
	return (
		<Component
			{...item}
			control={control}
			name={item.name}
			type={item.type}
			isRequired={item?.isRequired}
			placeholder={item.placeholder}
			label={item.label}
			errorMessage={errors[item.name] ? errors[item.name].message : undefined}
			{...(children ? {children} : {})}
		/>
	);
};
export default RenderFormData;
