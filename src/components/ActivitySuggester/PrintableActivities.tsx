"use client";

import { Activity, CATEGORY_INFO } from '@/data/activity-types';

interface PrintableActivitiesProps {
  activities: Activity[];
}

export function PrintableActivities({ activities }: PrintableActivitiesProps) {
  if (activities.length === 0) return null;

  return (
    <div className="hidden print:block print:bg-white print:text-black">
      <style jsx>{`
        @media print {
          @page {
            size: portrait;
            margin: 0.5in;
          }
        }
      `}</style>

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-1">Toddler Activity Cards</h1>
        <p className="text-gray-600">Fun activities for ages 1-3</p>
      </div>

      {/* Activity Cards Grid */}
      <div className="grid grid-cols-1 gap-6">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="border-2 border-gray-300 rounded-lg p-4 break-inside-avoid"
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
              <span className="text-2xl">{activity.emoji}</span>
              <h2 className="text-lg font-bold">{activity.name}</h2>
              <span className="ml-auto text-sm text-gray-500 px-2 py-0.5 bg-gray-100 rounded">
                {CATEGORY_INFO[activity.category].emoji} {CATEGORY_INFO[activity.category].label}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3">{activity.description}</p>

            {/* Two columns for materials and steps */}
            <div className="grid grid-cols-2 gap-4">
              {/* Materials */}
              <div>
                <h3 className="text-sm font-semibold mb-1">📦 Materials</h3>
                <ul className="text-sm text-gray-700 space-y-0.5">
                  {activity.materials.map((material, index) => (
                    <li key={index}>• {material}</li>
                  ))}
                </ul>
              </div>

              {/* Steps */}
              <div>
                <h3 className="text-sm font-semibold mb-1">📝 Steps</h3>
                <ol className="text-sm text-gray-700 space-y-0.5">
                  {activity.steps.map((step, index) => (
                    <li key={index}>{index + 1}. {step}</li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Time */}
            <div className="mt-3 pt-2 border-t border-gray-200 text-sm text-gray-500">
              ⏱️ {activity.timeMinutes < 10
                ? `${activity.timeMinutes} min`
                : `${activity.timeMinutes - 5}-${activity.timeMinutes} min`}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 text-xs text-gray-500 text-center">
        Generated from vaidy.ai/projects/activity-suggester
      </div>
    </div>
  );
}
