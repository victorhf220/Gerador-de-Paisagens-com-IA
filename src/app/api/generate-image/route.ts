import { generateImage } from '@/lib/generateImage';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const options = await req.json();
    const result = await generateImage(options);

    return Response.json(result);
  } catch (error: any) {
    console.error('[API_GENERATE_IMAGE_ERROR]', error);
    return Response.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}
