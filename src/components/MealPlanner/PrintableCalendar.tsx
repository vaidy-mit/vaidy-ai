"use client";

import { Meal, DayPlan } from '@/data/meal-planner-types';
import {
  getWeekDates,
  getMonthName,
  getDayName,
  formatDate,
  getMealSlots,
  getSlotLabel,
} from '@/lib/meal-planner-utils';

interface PrintableCalendarProps {
  date: Date;
  plans: DayPlan[];
  meals: Meal[];
}

export function PrintableCalendar({ date, plans, meals }: PrintableCalendarProps) {
  const weekDates = getWeekDates(date);
  const slots = getMealSlots();
  const mealMap = new Map(meals.map(m => [m.id, m]));

  const getPlanForDate = (d: Date): DayPlan | undefined => {
    const dateStr = formatDate(d);
    return plans.find(p => p.date === dateStr);
  };

  const getWeekRange = () => {
    const start = weekDates[0];
    const end = weekDates[6];
    return `${getMonthName(start)} ${start.getDate()} - ${getMonthName(end)} ${end.getDate()}, ${end.getFullYear()}`;
  };

  return (
    <div className="hidden print:block print:bg-white print:text-black">
      <style jsx>{`
        @media print {
          @page {
            size: landscape;
            margin: 0.5in;
          }
        }
      `}</style>

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-1">Weekly Meal Plan</h1>
        <p className="text-gray-600">{getWeekRange()}</p>
      </div>

      {/* Calendar Grid */}
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2 bg-gray-100 w-20"></th>
            {weekDates.map((d, i) => (
              <th key={i} className="border border-gray-400 p-2 bg-gray-100 text-center">
                <div className="font-bold">{getDayName(d, true)}</div>
                <div className="text-sm text-gray-600">
                  {getMonthName(d, true)} {d.getDate()}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slots.map((slot) => (
            <tr key={slot}>
              <td className="border border-gray-400 p-2 bg-gray-50 font-medium text-sm">
                {getSlotLabel(slot)}
              </td>
              {weekDates.map((d, i) => {
                const plan = getPlanForDate(d);
                const mealId = plan?.[slot];
                const meal = mealId ? mealMap.get(mealId) : undefined;

                return (
                  <td key={i} className="border border-gray-400 p-2 align-top min-h-[60px]">
                    {meal ? (
                      <div className="text-sm">{meal.name}</div>
                    ) : (
                      <div className="text-gray-300 text-sm italic">-</div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Generated from vaidy.ai/projects/meal-planner
      </div>
    </div>
  );
}
