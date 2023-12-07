export default function Counter() {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>+</button>
      <h1>React {count}</h1>
    </div>
  );
}
