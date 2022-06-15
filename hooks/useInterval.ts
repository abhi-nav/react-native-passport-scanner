import { useRef, useEffect } from "react";

export const useInterval = (callback: Function, delay: number) => {
	const savedCallback = useRef<Function>();

	useEffect(() => {
		savedCallback.current = callback;
	}, [savedCallback, callback]);

	useEffect(() => {
		function tick() {
			savedCallback.current!();
		}
		const id = setInterval(tick, delay);

		return () => clearInterval(id);
	}, [savedCallback, callback, delay]);
};
