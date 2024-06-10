import { Skeleton } from "@nextui-org/react";

function SkeletonUsersSelect() {
	return (
		<div className="w-full flex items-center gap-3 mt-1 px-2 py-1">
			<div>
				<Skeleton className="flex rounded-full w-10 h-10" />
			</div>
			<div className="w-full flex flex-col gap-2">
				<Skeleton className="h-3 w-3/5 rounded-lg" />
				<Skeleton className="h-3 w-4/5 rounded-lg" />
			</div>
		</div>
	);
}

export default SkeletonUsersSelect;
