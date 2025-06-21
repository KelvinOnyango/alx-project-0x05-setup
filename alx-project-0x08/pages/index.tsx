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

    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock image URL - will be replaced with real API call later
      const mockImageUrl = `https://source.unsplash.com/random/800x600/?${encodeURIComponent(
        prompt
      )}`;

      setImageUrl(mockImageUrl);
      setGeneratedImages((prev) => [
        ...prev,
        { imageUrl: mockImageUrl, prompt },
      ]);
    } catch (error) {
      console.error("Image generation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col items-center w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">Image Generation App</h1>
        <p className="text-lg text-gray-700 mb-4">
          Generate stunning images based on your prompts!
        </p>

        <div className="w-full max-w-md mb-8">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            disabled={isLoading}
          />
          <button
            onClick={handleGenerateImage}
            disabled={isLoading || !prompt.trim()}
            className={`w-full p-3 text-white rounded-lg transition duration-200 ${
              isLoading || !prompt.trim()
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Generating..." : "Generate Image"}
          </button>
        </div>

        {/* Latest Generated Image */}
        {imageUrl && (
          <div className="w-full mb-8">
            <h2 className="text-2xl font-semibold mb-4">Latest Result</h2>
            <ImageCard
              action={() => setImageUrl(imageUrl)}
              imageUrl={imageUrl}
              prompt={prompt}
            />
          </div>
        )}

        {/* Generated Images Gallery */}
        {generatedImages.length > 0 && (
          <div className="w-full">
            <h2 className="text-2xl font-semibold mb-4">Your Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedImages.map((img, index) => (
                <ImageCard
                  key={index}
                  action={() => setImageUrl(img.imageUrl)}
                  imageUrl={img.imageUrl}
                  prompt={img.prompt}
                  width="100%"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
