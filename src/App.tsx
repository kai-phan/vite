import React from 'react';

const App = (props) => {
  const [count, setCount] = React.useState(0);

  const a = import.meta.env.VITE_APP_TITLE;

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>+</button>
      <h1>React {count}</h1>
    </div>
  );
}

export default App;