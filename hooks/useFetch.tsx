import { useState } from "react";
import { toast } from "sonner";

const useFetch = (cb) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>("");

  const fn = async (...args: any[]) => {
    setLoading(true);
    setError(null);
    try {
      const result = await cb(...args);
      setData(result);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        toast.error(error.message);
      }
      setError("An unknown Error Occured in useFetch");
      toast.error("Error occured in useFetch");
    } finally {
      setLoading(false);
    }
  };
  return { fn, data, error, loading, setData };
};

export default useFetch;
