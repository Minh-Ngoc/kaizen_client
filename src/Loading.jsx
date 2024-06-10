import { Divider, Skeleton } from "@nextui-org/react";

function Loading() {
    const sidebarRoutes = Array.from({ length: 13 }, (_) => _);
    
    return (  
        <div className="flex gap-4 p-2 bg-admin">
            <div className="w-[275px] h-skeleton-sidebar">
                <Skeleton className="rounded-md w-full h-16 bg-table shadow-wrapper mt-6">
                    <div className="h-full rounded-md"></div>
                </Skeleton>

                <Divider className={"my-10 bg-gray-400"} />

                <div className="flex flex-col gap-3">
                    {sidebarRoutes?.map(
                        (_, index) => (
                            <Skeleton key={index} className="rounded-md w-full h-10 bg-table shadow-wrapper">
                                <div className="h-full rounded-md"></div>
                            </Skeleton>
                        )
                    )}
                </div>
            </div>
            <div className="flex-1 flex flex-col gap-4 mt-4">
                <div className="flex justify-between pr-[50px] py-2">
                    <Skeleton className="rounded-md w-1/2 h-[72px] bg-table shadow-wrapper">
                        <div className="h-full rounded-md"></div>
                    </Skeleton>

                    <div className="flex gap-8 h-[72px] items-center">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-end">
                                <Skeleton className="h-5 w-20 rounded-lg bg-table shadow-wrapper"/>
                            </div>
                            <Skeleton className="h-5 w-40 rounded-lg bg-table shadow-wrapper"/>
                        </div>
                        <div className="flex items-center gap-4">
                            <Skeleton className="flex rounded-full w-10 h-10 bg-table shadow-wrapper"/>
                            <Skeleton className="h-5 w-20 rounded-lg bg-table shadow-wrapper"/>
                        </div>
                    </div>
                </div>
                <Skeleton className="rounded-md h-skeleton-content bg-table shadow-wrapper">
                    <div className="h-full rounded-md"></div>
                </Skeleton>
            </div>
        </div>
    );
}

export default Loading;