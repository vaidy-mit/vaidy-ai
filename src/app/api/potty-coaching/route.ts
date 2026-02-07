import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { CoachingRequest, CoachingResponse } from '@/data/potty-tracker-types';

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `You are a supportive, knowledgeable potty training coach helping parents navigate their child's potty training journey.

Your responses should be:
- Warm, encouraging, and non-judgmental
- Practical and actionable
- Based on modern, child-centered potty training approaches
- Sensitive to the emotional aspects of this milestone for both parent and child
- Age-appropriate (typically for toddlers 18 months to 4 years)

Key principles you follow:
- Every child develops at their own pace
- Positive reinforcement works better than punishment or shame
- Consistency and patience are key
- Setbacks are normal and not failures
- The child's readiness matters more than age
- Celebrate small wins

Always return your response as a valid JSON object with this structure:
{
  "message": "Your main advice or response (2-4 paragraphs)",
  "actionItems": ["Specific action 1", "Specific action 2", "Specific action 3"],
  "encouragement": "A short encouraging statement for the parent",
  "suggestedNextStep": "One specific next step they can take (optional)"
}`;

function buildPrompt(request: CoachingRequest): string {
  const {
    context,
    childName,
    currentPhase,
    recentStats,
    specificQuestion,
    recentEvents,
    readinessScore,
    milestonesUnlocked,
  } = request;

  let prompt = `I'm helping with potty training for ${childName}.\n\n`;

  prompt += `Current situation:\n`;
  prompt += `- Training phase: ${currentPhase.replace(/_/g, ' ')}\n`;
  prompt += `- Success rate: ${recentStats.successRate.toFixed(0)}%\n`;
  prompt += `- Current streak: ${recentStats.currentStreak} successes\n`;
  prompt += `- Total successes: ${recentStats.totalSuccesses}\n`;
  prompt += `- Recent trend: ${recentStats.recentTrend}\n`;

  if (readinessScore !== undefined) {
    prompt += `- Readiness score: ${readinessScore}%\n`;
  }

  if (milestonesUnlocked && milestonesUnlocked.length > 0) {
    prompt += `- Milestones achieved: ${milestonesUnlocked.join(', ')}\n`;
  }

  if (recentEvents && recentEvents.length > 0) {
    const successCount = recentEvents.filter((e) => e.type === 'success').length;
    const accidentCount = recentEvents.filter((e) => e.type === 'accident').length;
    const selfInitiated = recentEvents.filter(
      (e) => e.type === 'success' && !e.promptedByParent
    ).length;

    prompt += `\nRecent activity (last ${recentEvents.length} events):\n`;
    prompt += `- ${successCount} successes, ${accidentCount} accidents\n`;
    prompt += `- ${selfInitiated} were self-initiated\n`;
  }

  prompt += '\n';

  switch (context) {
    case 'encouragement':
      prompt += `I'm looking for encouragement and motivation. Please provide supportive words based on our progress so far.`;
      break;
    case 'strategy':
      prompt += `I'd like strategic advice on potty training. What approaches should I consider given our current situation?`;
      break;
    case 'regression':
      prompt += `We seem to be experiencing some setbacks or regression. How should I handle this? What might be causing it?`;
      break;
    case 'milestone':
      prompt += `We've achieved a new milestone! How can I build on this success and keep the momentum going?`;
      break;
    case 'transition':
      prompt += `I'm wondering if we're ready to move to the next phase of training. What signs should I look for? What's the best way to transition?`;
      break;
    case 'readiness':
      prompt += `I want to understand potty training readiness better. Based on our readiness score, what should I focus on?`;
      break;
    case 'question':
      if (specificQuestion) {
        prompt += `I have a specific question: ${specificQuestion}`;
      } else {
        prompt += `I have a question about potty training.`;
      }
      break;
  }

  prompt += '\n\nPlease provide helpful, practical advice in JSON format.';

  return prompt;
}

export async function POST(request: Request) {
  try {
    const body: CoachingRequest = await request.json();

    // Validate required fields
    if (!body.context || !body.childName || !body.currentPhase || !body.recentStats) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const userPrompt = buildPrompt(body);

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      system: SYSTEM_PROMPT,
    });

    // Extract text content
    const textContent = message.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response received');
    }

    // Parse JSON response
    const responseText = textContent.text.trim();

    // Try to extract JSON from the response
    let jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // If no JSON found, create a structured response from the text
      const response: CoachingResponse = {
        message: responseText,
        actionItems: [],
        encouragement: "Keep up the great work!",
      };
      return NextResponse.json(response);
    }

    const parsed = JSON.parse(jsonMatch[0]) as CoachingResponse;

    // Validate response structure
    const response: CoachingResponse = {
      message: parsed.message || responseText,
      actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [],
      encouragement: parsed.encouragement || "You're doing great!",
      suggestedNextStep: parsed.suggestedNextStep,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in potty coaching API:', error);

    // Return a helpful fallback response
    const fallbackResponse: CoachingResponse = {
      message: "I'm having trouble connecting right now, but here's some general advice: Stay consistent with your routine, celebrate every success (no matter how small), and remember that setbacks are a normal part of the journey. Your patience and encouragement make all the difference.",
      actionItems: [
        "Keep a consistent potty routine",
        "Celebrate successes with praise",
        "Stay calm during accidents",
      ],
      encouragement: "Every step forward is progress, even the small ones!",
    };

    return NextResponse.json(fallbackResponse);
  }
}
