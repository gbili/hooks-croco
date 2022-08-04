import { Dispatch, SetStateAction, useMemo, useState } from "react";

type StateTuple<R> = [R, Dispatch<SetStateAction<R>>];

export default function useDependentState<R, D extends any[] = any[]>(generator: (...deps: D) => R, deps: D): StateTuple<R> {
  const [state, setState] = useState<R>(generator(...deps));
  useMemo(() => {
    setState(generator(...deps));
    // eslint-disable-next-line
  }, [...deps]);
  return [state, setState];
}