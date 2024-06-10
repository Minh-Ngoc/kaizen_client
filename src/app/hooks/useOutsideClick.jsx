import {useEffect, useRef} from "react";

const useClickOutside = (handler) => {
	const ref = useRef();
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (ref.current && !ref.current.contains(event.target)) {
				handler && handler();
			}
		};
		document.addEventListener("click", handleClickOutside, true);
		return () => {
			document.removeEventListener("click", handleClickOutside, true);
		};
	}, [handler]);

	return ref;
};

export default useClickOutside;
