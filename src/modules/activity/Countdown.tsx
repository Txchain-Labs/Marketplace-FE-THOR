import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
// import { formatCountDown } from './helper';
interface Props {
  timestamp: string | number;
}

const formatCountDown = (secsElapsed: number) => {
  const minutes = Math.floor(secsElapsed / 60) % 60;
  const hours = Math.floor(secsElapsed / 3600) % 24;
  const days = Math.floor(secsElapsed / 86400);

  if (days > 0) return '' + days + ' day(s) ago';
  if (hours > 0) return '' + hours + ' hour(s) ago';
  if (minutes > 0) return '' + minutes + ' min(s) ago';

  if (days < 0) {
    if (days < -30) {
      const months = Math.floor(-days / 30);

      return ' in ' + months + ' month(s)';
    }

    return ' in ' + -days + ' day(s)';
  }
  if (hours < 0) return ' in ' + -hours + ' hour(s)';
  if (minutes < 0) return ' in ' + -minutes + ' min(s)';

  if (secsElapsed > 0) return '' + Math.round(secsElapsed) + ' second(s) ago';

  return ' in ' + Math.round(secsElapsed) + ' second(s)';
};

const Countdown = ({ timestamp }: Props) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let seconds = Date.now() / 1000 - Number(timestamp);
    if (Number.isNaN(seconds)) {
      seconds = 0;
    }
    setCount(seconds);

    const timer = setInterval(() => {
      setCount((prevCount) => (prevCount >= 0 ? prevCount + 1 : 0));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [timestamp]);

  return (
    <Typography variant="body1" sx={{ fontWeight: 700 }}>
      {formatCountDown(count)}
    </Typography>
  );
};

export default Countdown;
