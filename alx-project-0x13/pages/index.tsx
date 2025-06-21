import ImageCard from "@/components/common/ImageCard";
import useFetchData from "@/hooks/useFetchData";
import { useState } from "react";

interface ApiResponse {
  message: string;
}

const Home: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [activeImage, setActiveImage] = useState<string>("");
  const { data, error, isLoading, generatedImages, fetchData, clearError } =
    useFetchData<ApiResponse>();

  const handleGenerateImage = () => {
    if (!prompt.trim()) {
      clearError();
      return;
    }
    fetchData("/api/generate-image", { prompt });
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
            onChange={(e) => {
              setPrompt(e.target.value);
              clearError();
            }}
            placeholder="Enter your prompt here..."
            className="w-full p-3 border border-gray-300 rounded-lg mb-2"
            disabled={isLoading}
            onKeyDown={(e) => e.key === "Enter" && handleGenerateImage()}
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button
            onClick={handleGenerateImage}
            disabled={isLoading || !prompt.trim()}
            className={`w-full p-3 text-white rounded-lg transition ${
              isLoading || !prompt.trim()
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Generating..." : "Generate Image"}
          </button>
        </div>

        {/* Active Image Display */}
        {(data?.message || activeImage) && (
          <div className="w-full mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {activeImage ? "Selected Image" : "Latest Result"}
            </h2>
            <ImageCard
              action={() => {}}
              imageUrl={activeImage || data?.message || ""}
              prompt={
                generatedImages.find(
                  (img) => img.imageUrl === (activeImage || data?.message)
                )?.prompt || ""
              }
            />
          </div>
        )}

        {/* Generated Images Gallery */}
        {generatedImages.length > 0 && (
          <div className="w-full">
            <h2 className="text-2xl font-semibold mb-4">
              Your Gallery ({generatedImages.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {generatedImages.map((img, index) => (
                <ImageCard
                  key={`${index}-${img.imageUrl}`}
                  action={() => setActiveImage(img.imageUrl)}
                  imageUrl={img.imageUrl}
                  prompt={img.prompt}
                  width="w-full"
                  height="h-40"
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
