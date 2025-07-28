import { useState } from "react";

const useFetch = <TData = unknown, TArgs extends any[] = any[]>(
  cb: (...args: TArgs) => Promise<TData>
) => {
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<string | null>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fn = async (...args: TArgs) => {
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
