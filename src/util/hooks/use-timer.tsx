import {useEffect, useRef, useState} from 'react';

interface ITimer {
  timer: number;
  startTimer: (time: number) => void;
  stopTimer: () => void;
}

interface IProps {
  start?: number;
  fps?: number;
}
  
/**
 * @param start start value of timer 
 * @param fps ticker will tick after every n seconds
 */
const useCountDown = ({start, fps}: IProps): ITimer => {
  const [timer, setTimer] = useState(start || 0);
  const intervalRef = useRef<NodeJS.Timeout>();

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const startTimer = (time: number) => {
    setTimer(time);
  };

  useEffect(() => {
    if (timer <= 0) {
      return stopTimer();
    }
    intervalRef.current = setInterval(() => {
      setTimer(t => t - 1 / (fps || 1));
    }, 1000 / (fps || 1));
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer]);

  return {timer, startTimer, stopTimer};
};

export default useCountDown;
