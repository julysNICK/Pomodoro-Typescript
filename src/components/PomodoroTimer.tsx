import React, { useEffect, useState, useCallback } from 'react';
import { useInterval } from '../hooks/use-interval';
import { secondsToTimes } from '../ultils/seconds-to-time';
import Button from './Button';
import Timer from './Timer';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bellStart = require('../sounds/Alarm-clock-bell-ringing-sound-effect.mp3');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bellFinish = require('../sounds/Shining-sound-effect.mp3');
const audioStartWorking = new Audio(bellStart);
const audioStartStopWorking = new Audio(bellFinish);
interface Props {
  defaultPomodoroTime: number;
  shortRestime: number;
  longRestTime: number;
  cycle: number;
}
function PomodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = useState(props.defaultPomodoroTime);
  const [timeCouting, setTimeCouting] = useState(false);
  const [working, setWorking] = useState(false);
  const [resting, setResting] = useState(false);
  const [cyclesQtdManager, setCyclesQtdManager] = useState(
    new Array(props.cycle - 1).fill(true),
  );
  const [completedCycles, setCompleteCycles] = useState(0);
  const [fullWorkingTime, setFullWorkingTimes] = useState(0);
  const [numberOfPomodoro, setNumberOfPomodoro] = useState(0);

  useInterval(
    () => {
      setMainTime(mainTime - 1);
      if (working) setFullWorkingTimes(fullWorkingTime + 1);
    },
    timeCouting ? 1000 : null,
  );
  const configureWork = useCallback(() => {
    setTimeCouting(true);
    setWorking(true);
    setResting(false);
    setMainTime(props.defaultPomodoroTime);
    audioStartWorking.play();
  }, [setTimeCouting, setWorking, setResting, setMainTime]);

  const configureRest = useCallback(
    (Long: boolean) => {
      setTimeCouting(true);
      setWorking(false);
      setResting(true);
      if (Long) {
        setMainTime(props.longRestTime);
      } else {
        setMainTime(props.shortRestime);
      }
      audioStartStopWorking.play();
    },
    [setTimeCouting, setWorking, setResting, setMainTime],
  );

  useEffect(() => {
    if (working) document.body.classList.add('working');
    if (resting) document.body.classList.remove('working');
    if (mainTime > 0) return;

    if (working && cyclesQtdManager.length > 0) {
      configureRest(false);
      cyclesQtdManager.pop();
    } else if (working && cyclesQtdManager.length <= 0) {
      configureRest(true);
      setCyclesQtdManager(new Array(props.cycle - 1).fill(true));
      setCompleteCycles(completedCycles + 1);
    }
    if (working) setNumberOfPomodoro(numberOfPomodoro + 1);
    if (resting) configureWork();
  }, [
    working,
    resting,
    mainTime,
    cyclesQtdManager,
    completedCycles,
    configureRest,
    setCyclesQtdManager,
    configureWork,
    numberOfPomodoro,
    props.cycle,
  ]);
  return (
    <div className="pomodoro">
      <h2>Voce está {working ? 'Trabalhando' : 'Descansando'}</h2>
      <Timer mainTime={mainTime} />
      <div className="controls">
        <Button text="work" onclick={() => configureWork()}></Button>
        <Button text="stop" onclick={() => configureRest(false)}></Button>
        <Button
          className={!working && !resting ? 'hidden' : ''}
          text={timeCouting ? 'Pause' : 'Play'}
          onclick={() => setTimeCouting(!timeCouting)}
        ></Button>
      </div>
      <div className="details">
        <p>ciclos concluidos: {completedCycles}</p>
        <p>horas trabalhadas: {secondsToTimes(fullWorkingTime)}</p>
        <p>Pomodoros concluidos: {numberOfPomodoro}</p>
      </div>
    </div>
  );
}

export default PomodoroTimer;
