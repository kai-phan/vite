import { useState } from 'react';

const App = (props: any) => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>+</button>
      <h1>React {count}</h1>
    </div>
  );
};

export default App;
