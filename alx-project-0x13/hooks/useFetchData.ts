import { useState } from "react";
import { ImageProps } from "@/interfaces";

interface FetchDataResponse<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  generatedImages: ImageProps[];
  fetchData: (endpoint: string, body: any) => Promise<void>;
  clearError: () => void;
}

const useFetchData = <T>(): FetchDataResponse<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedImages, setGeneratedImages] = useState<ImageProps[]>([]);

  const fetchData = async (endpoint: string, body: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);

      if (result?.message) {
        setGeneratedImages((prev) => [
          { imageUrl: result.message, prompt: body.prompt },
          ...prev,
        ]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    data,
    error,
    isLoading,
    generatedImages,
    fetchData,
    clearError,
  };
};

export default useFetchData;
