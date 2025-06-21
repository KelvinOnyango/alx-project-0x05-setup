import { HEIGHT, WIDTH } from "@/constants";
import { RequestProps } from "@/interfaces";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const gptApiKey = process.env.NEXT_PUBLIC_GPT_API_KEY;
  const gptUrl = "https://chatgpt-42.p.rapidapi.com/texttoimage";

  if (!gptApiKey) {
    return response.status(500).json({
      error: "API key is missing in environment variables",
    });
  }

  try {
    const { prompt }: RequestProps = request.body;

    const res = await fetch(gptUrl, {
      method: "POST",
      body: JSON.stringify({
        text: prompt,
        width: WIDTH,
        height: HEIGHT,
      }),
      headers: {
        "x-rapidapi-key": gptApiKey.trim(),
        "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const data = await res.json();
    const imageUrl =
      data?.generated_image ||
      `https://via.placeholder.com/${WIDTH}x${HEIGHT}?text=Image+Not+Generated`;

    return response.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Error in API route:", error);
    return response.status(500).json({
      error: "Failed to generate image",
      details: error.message,
    });
  }
};

export default handler;
