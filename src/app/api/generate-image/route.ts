
import { NextRequest, NextResponse } from 'next/server';
import { generateImageFlow } from '@/ai/flows/image-generation';
import { GenerationOptions } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const options = (await request.json()) as GenerationOptions;

    if (!options.prompt || !options.style || !options.aspectRatio) {
      return NextResponse.json(
        { error: 'Missing required generation options.' },
        { status: 400 }
      );
    }

    const result = await generateImageFlow(options);

    if (!result || !result.imageUrl) {
      return NextResponse.json(
        { error: 'Image generation failed.' },
        { status: 500 }
      );
    }

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
