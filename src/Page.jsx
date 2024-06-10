import { Suspense } from "react";
import Loading from "./Loading";

function Page({ children }) {
    return (
		<Suspense fallback={<Loading />}>
            {children}
        </Suspense>
    )
}

export default Page;