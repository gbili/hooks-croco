import { useEffect, useState } from "react";
import useInterval from "./useInterval";

type UseCountdownProps = {}
& { shouldStartCountdown: boolean; }
& { totalSeconds: number; }
& { cancelCountdown?: boolean; }

type AnnounceCountdownForXSecondsMore = number | null;
type CountdownElapsed = boolean;

export default function useCountdown({ shouldStartCountdown, totalSeconds, cancelCountdown }: UseCountdownProps): [
  AnnounceCountdownForXSecondsMore,
  CountdownElapsed
] {
  const [secondsRemaining, setSecondsRemaining] = useState<AnnounceCountdownForXSecondsMore>(null);

  useEffect(() => {
    if (secondsRemaining !== null) return;
    if (shouldStartCountdown) {
      setSecondsRemaining(totalSeconds);
    }
  }, [shouldStartCountdown, totalSeconds, secondsRemaining, setSecondsRemaining])

  useInterval(() => {
    if (secondsRemaining === null) return;
    setSecondsRemaining(secondsRemaining -1);
  }, !cancelCountdown && secondsRemaining !== null && secondsRemaining >= 0 ? 1000 : null);

  useEffect(() => {
    if (!cancelCountdown) return;
    setSecondsRemaining(null);
  }, [cancelCountdown])

  const countdownElapsed = Boolean(secondsRemaining !== null && secondsRemaining <= -1);

  return [
    secondsRemaining,
    countdownElapsed,
  ];
}