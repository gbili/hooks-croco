import { useCallback, useRef, useState } from "react";

type EventCallback<T extends Element> = (event: React.MouseEvent<T> | React.TouchEvent<T>) => void;
type UseLongPressConfig = {
  shouldPreventDefault: boolean;
  delay: number;
};

type BasicMouseEventProps<T extends Element> = { target: T; preventDefault(): void; stopPropagation(): void; button: number; clientX: number; clientY: number; };
type BasicTouchEventProps<T extends Element> = { target: T; preventDefault(): void; stopPropagation(): void; touches: TouchList | React.TouchList; changedTouches: TouchList | React.TouchList; };

type MouseEventHandler<T extends Element> = (this: T | Window, e: React.MouseEvent<T> | React.TouchEvent<T>) => void;
type TouchEventHandler<T extends Element> = (this: T | Window, e: React.MouseEvent<T> | React.TouchEvent<T>) => void;

type UseLongPressEventHandlersObject<T extends Element> = {
    onMouseDown: MouseEventHandler<T>;
    onTouchStart: TouchEventHandler<T>;
    onMouseUp: MouseEventHandler<T>;
    onMouseLeave: MouseEventHandler<T>;
    onTouchEnd: TouchEventHandler<T>;
    onTouchCancel: TouchEventHandler<T>;
};

type UseLongPressRet<T extends Element> = UseLongPressEventHandlersObject<T> & {
  ref: React.Ref<T>
};

const isTouchEvent = <T extends Element>(event: BasicTouchEventProps<T> | BasicMouseEventProps<T> | null): event is BasicTouchEventProps<T> => {
  return event !== null && "touches" in event;
};

const preventDefault = (event: any | null) => {
  if (isTouchEvent(event) && event.touches.length < 2) {
    event.preventDefault();
  }
};

const useLongPress = <T extends Element>(
  targetRef: React.MutableRefObject<T | null>,
  onLongPress: EventCallback<T>,
  onClick: EventCallback<T> | null,
  options: UseLongPressConfig = { shouldPreventDefault: true, delay: 300 }
): UseLongPressRet<T> => {
  const { shouldPreventDefault, delay } = options;
  const [longPressTriggered, setLongPressTriggered] = useState<boolean>(false);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(
    (event: React.MouseEvent<T> | React.TouchEvent<T>) => {
      if (shouldPreventDefault && event.target) {
        event.target.addEventListener("touchend", preventDefault, {
          passive: false
        });
      }
      timeout.current = setTimeout(() => {
        onLongPress(event);
        setLongPressTriggered(true);
      }, delay);
    },
    [onLongPress, delay, shouldPreventDefault, timeout]
  );

  const clear = useCallback(
    (event: React.MouseEvent<T> | React.TouchEvent<T>, shouldTriggerClick: boolean = true) => {
      timeout.current && clearTimeout(timeout.current);
      shouldTriggerClick && !longPressTriggered && onClick !== null && onClick(event);
      setLongPressTriggered(false);
      if (shouldPreventDefault && targetRef.current) {
        targetRef.current.removeEventListener("touchend", preventDefault);
      }
    },
    [shouldPreventDefault, onClick, longPressTriggered, targetRef]
  );

  return {
    ref: targetRef,
    onMouseDown: start,
    onTouchStart: start,
    onMouseUp: clear,
    onMouseLeave: e => clear(e, false),
    onTouchEnd: clear,
    onTouchCancel: clear,
  };
};

export default useLongPress;