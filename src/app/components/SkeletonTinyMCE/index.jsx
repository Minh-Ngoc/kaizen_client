import { Card, Skeleton } from "@nextui-org/react";

function SkeletonTinyMCE() {
	return (
		<div className="absolute top-0 bottom-0 left-0 right-0 h-full">
			<Card className="absolute top-0 bottom-0 left-0 right-0 h-full space-y-5 p-4" radius="lg">
				<Skeleton isLoaded={false} className="rounded-lg absolute top-2 bottom-2 left-2 right-2">
					<div className="absolute top-2 bottom-2 left-2 right-2 rounded-lg bg-secondary"></div>
				</Skeleton>
			</Card>
		</div>
	);
}

export default SkeletonTinyMCE;
