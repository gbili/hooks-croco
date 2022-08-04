import { useRef, useEffect } from "react";

type Callback = () => any;

const isRequestToClearInterval = (delay: number | null): delay is null => delay === null;

/**
 * @param callback to be called at interval times
 * @param delay number | null : when null clears interval
 */
export default function useInterval(callback: () => any, delay: number | null) {
  const savedCallback = useRef<Callback | null>(null);
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  // remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // setup the interval
  useEffect(() => {
    function tick() {
      savedCallback.current && savedCallback.current();
    }
    if (isRequestToClearInterval(delay)) {
      if (intervalId === null) {
        throw new Error('Cannot cal clear interval on a null intervalId');
      }
      clearInterval(intervalId.current!);
      return;
    }
    intervalId.current = setInterval(tick, delay);
    return () => clearInterval(intervalId.current!);
  }, [delay, intervalId]);
}