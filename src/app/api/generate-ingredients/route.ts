import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic();

export async function POST(request: Request) {
  try {
    const { mealName } = await request.json();

    if (!mealName || typeof mealName !== 'string') {
      return NextResponse.json(
        { error: 'mealName is required' },
        { status: 400 }
      );
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `List the common ingredients needed to make "${mealName}".
Return ONLY a JSON array of ingredient strings, with no additional text or explanation.
Be concise - just ingredient names, no quantities or measurements.
Example format: ["chicken breast", "olive oil", "garlic", "onion"]`,
        },
      ],
    });

    const textContent = message.content.find((c) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      return NextResponse.json(
        { error: 'No text response from AI' },
        { status: 500 }
      );
    }

    // Parse the JSON response
    const responseText = textContent.text.trim();
    // Handle potential markdown code blocks
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: 'Invalid response format' },
        { status: 500 }
      );
    }

    const ingredients = JSON.parse(jsonMatch[0]) as string[];

    return NextResponse.json({ ingredients });
  } catch (error) {
    console.error('Error generating ingredients:', error);
    return NextResponse.json(
      { error: 'Failed to generate ingredients' },
      { status: 500 }
    );
  }
}
