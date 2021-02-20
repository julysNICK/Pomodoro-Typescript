import React from 'react';
import PomodoroTimer from './components/PomodoroTimer';
function App(): JSX.Element {
  return (
    <div className="container">
      <PomodoroTimer
        defaultPomodoroTime={1500}
        shortRestime={300}
        longRestTime={9}
        cycle={4}
      />
    </div>
  );
}

export default App;
