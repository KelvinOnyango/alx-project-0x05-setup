import ImageCard from "@/components/common/ImageCard";
import { ImageProps } from "@/interfaces";
import { useState } from "react";

const Home: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [generatedImages, setGeneratedImages] = useState<ImageProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerateImage = async () => {
    setIsLoading(true);
    console.log("Generating Image");

    try {
      // Log the API key (for verification only - remove in production)
      console.log("API Key:", process.env.NEXT_PUBLIC_GPT_API_KEY);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock response - will be replaced with actual API call
      const mockImageUrl = `https://source.unsplash.com/random/800x600/?${encodeURIComponent(
        prompt
      )}`;
      setImageUrl(mockImageUrl);
      setGeneratedImages((prev) => [
        ...prev,
        { imageUrl: mockImageUrl, prompt },
      ]);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      {/* ... (keep existing JSX structure) ... */}
    </div>
  );
};

export default Home;
