import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { CategoryType } from '@/data/activity-types';

const anthropic = new Anthropic();

export async function POST(request: Request) {
  try {
    const { category } = await request.json();

    if (!category || !['learning', 'physical', 'creative'].includes(category)) {
      return NextResponse.json(
        { error: 'Valid category is required (learning, physical, or creative)' },
        { status: 400 }
      );
    }

    const categoryDescriptions: Record<CategoryType, string> = {
      learning: 'educational activities that develop cognitive skills like counting, colors, shapes, letters, or problem-solving',
      physical: 'active play activities that develop gross or fine motor skills, coordination, and physical fitness',
      creative: 'artistic activities that encourage creativity and self-expression through art, music, or imaginative play',
    };

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `Generate 3 unique, engaging activities for toddlers (ages 1-3 years) in the "${category}" category.
These should be ${categoryDescriptions[category as CategoryType]}.

Requirements:
- Activities must be safe for toddlers (no small parts, sharp objects, or toxic materials)
- Use only common household items as materials
- Steps should be simple and toddler-friendly
- Each activity should take 5-20 minutes
- Include a fun, descriptive name and relevant emoji

Return ONLY a JSON array with this exact structure, no additional text:
[
  {
    "name": "Activity Name",
    "emoji": "🎯",
    "description": "A brief 1-2 sentence description of the activity and what toddlers will enjoy about it.",
    "materials": ["item 1", "item 2", "item 3"],
    "steps": ["Step 1 written simply", "Step 2 for toddler activity", "Step 3"],
    "timeMinutes": 10
  }
]`,
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

    const activities = JSON.parse(jsonMatch[0]).map((activity: {
      name: string;
      emoji: string;
      description: string;
      materials: string[];
      steps: string[];
      timeMinutes: number;
    }, index: number) => ({
      ...activity,
      id: `${category}-${Date.now()}-${index}`,
      category,
    }));

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Error generating activities:', error);
    return NextResponse.json(
      { error: 'Failed to generate activities' },
      { status: 500 }
    );
  }
}
