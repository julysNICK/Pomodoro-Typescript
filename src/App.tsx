import React from 'react';
import PomodoroTimer from './components/PomodoroTimer';
function App(): JSX.Element {
  return (
    <div className="container">
      <PomodoroTimer
        defaultPomodoroTime={10}
        shortRestime={3}
        longRestTime={9}
        cycle={3}
      />
    </div>
  );
}

export default App;
