import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/ai/flows/image-generation';
import type { GenerationOptions } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const options = (await request.json()) as GenerationOptions;

    if (!options.prompt || !options.style || !options.aspectRatio) {
      return NextResponse.json(
        { error: 'Missing required generation options.' },
        { status: 400 }
      );
    }

    // Call the backend function to generate the image
    const result = await generateImage(options);

    if (!result || !result.imageUrl) {
      console.error("AI response did not contain imageUrl:", result);
      return NextResponse.json(
        { error: 'Image generation failed on the server.' },
        { status: 500 }
      );
    }

    // Return the successful response in the correct format
    return NextResponse.json({ imageUrl: result.imageUrl });

  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to generate image.', details: errorMessage },
      { status: 500 }
    );
  }
}
