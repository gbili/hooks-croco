import { useMemo } from "react";

export default function useMemoDeps<R, D extends any[] = any[]>(generator: (...deps: D) => R, deps: D): R {
  // eslint-disable-next-line
  const generatedValue = useMemo(() => generator(...deps), [...deps]);
  return generatedValue;
}