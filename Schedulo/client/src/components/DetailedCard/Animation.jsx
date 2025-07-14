import { useEffect, useState } from 'react';

function CountUp({ target ,title}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setCount(current);
      if (current >= target) clearInterval(interval);
    }, 30); // Adjust for speed

    return () => clearInterval(interval);
  }, [target]);

  return (
    <div className=" text-3xl font-bold text-indigo-600  flex justify-center items-center h-24">
      {count}+ {title}
    </div>
  );
}

export default CountUp;