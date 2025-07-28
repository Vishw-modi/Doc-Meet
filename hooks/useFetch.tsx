import { useState } from "react";

const useFetch = (cb: unknown) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState<string | null>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fn = async (...args: any[]) => {
    setLoading(true);
    setError(null);
    try {
      const result = await cb(...args);
      setData(result);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
      setError("An unknown Error Occured in useFetch");
    } finally {
      setLoading(false);
    }
  };
  return { fn, data, error, loading, setData };
};

export default useFetch;
