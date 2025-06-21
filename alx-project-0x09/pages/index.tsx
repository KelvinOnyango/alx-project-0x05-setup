import ImageCard from "@/components/common/ImageCard";
import { useState } from "react";

const Home: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [generatedImages, setGeneratedImages] = useState<ImageProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const resp = await fetch("/api/generate-image", {
        method: "POST",
        body: JSON.stringify({ prompt }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!resp.ok) {
        throw new Error(await resp.text());
      }

      const { imageUrl } = await resp.json();
      setImageUrl(imageUrl);
      setGeneratedImages((prev) => [...prev, { imageUrl, prompt }]);
    } catch (err) {
      console.error("Generation failed:", err);
      setError("Failed to generate image. Please try again.");
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
            onChange={(e) => {
              setPrompt(e.target.value);
              setError(null);
            }}
            placeholder="Enter your prompt here..."
            className="w-full p-3 border border-gray-300 rounded-lg mb-2"
            disabled={isLoading}
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button
            onClick={handleGenerateImage}
            disabled={isLoading}
            className={`w-full p-3 text-white rounded-lg transition ${
              isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Generating..." : "Generate Image"}
          </button>
        </div>

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
