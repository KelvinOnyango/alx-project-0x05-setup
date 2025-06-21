import { GeneratedImageProps } from "@/interfaces";

const ImageCard: React.FC<GeneratedImageProps> = ({
  imageUrl,
  prompt,
  width,
  action,
}) => {
  return (
    <div
      onClick={() => action(imageUrl)}
      className="mt-6 border hover:cursor-pointer hover:shadow-md transition-shadow rounded-lg p-4"
    >
      <img
        src={imageUrl}
        alt={prompt}
        className={`w-full ${width || "max-w-md"} rounded-lg`}
      />
      <h2 className={`${width ? "text-sm" : "text-xl"} font-semibold mt-2`}>
        Your Prompt:
      </h2>
      <p className={`${width ? "text-xs" : "text-lg"} text-gray-700 mb-2`}>
        {prompt}
      </p>
    </div>
  );
};

export default ImageCard;
