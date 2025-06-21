import ImageCard from "@/components/common/ImageCard";
import { ImageProps } from "@/interfaces";
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
      const resp = await fetch('/api/generate-image', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!resp.ok) {
        throw new Error(await resp.text());
      }

      const { imageUrl } = await resp.json();
      setImageUrl(imageUrl);
      setGeneratedImages(prev => [
        { imageUrl, prompt },
        ...prev // Newest images first
      ]);
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
            onKeyDown={(e) => e.key === 'Enter' && handleGenerateImage()}
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button
            onClick={handleGenerateImage}
            disabled={isLoading}
            className={`w-full p-3 text-white rounded-lg transition ${
              isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : "Generate Image"}
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
            <h2 className="text-2xl font-semibold mb-4">Your Gallery ({generatedImages.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {generatedImages.map((img, index) => (
                <ImageCard
                  key={`${index}-${img.imageUrl}`}
                  action={() => setImageUrl(img.imageUrl)}
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