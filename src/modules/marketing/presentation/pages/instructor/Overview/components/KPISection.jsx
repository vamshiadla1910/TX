import React, { useMemo } from "react";
import { CheckCircle2, IndianRupee, MessageSquareQuote, Star, Users } from "lucide-react";
import { Metric } from "../../common/Metric";

export function KPISection({ instructorProfile }) {
  // Memoized canonical KPI list with stable IDs to prevent duplicate metrics rendering
  const kpiCards = useMemo(() => {
    return [
      {
        id: "kpi-active-learners",
        label: "ACTIVE LEARNERS",
        value: Number(instructorProfile.activeLearners || 1428).toLocaleString("en-IN"),
        foot: "▲ 12.4% this month",
        tone: "positive",
        icon: Users
      },
      {
        id: "kpi-completion-rate",
        label: "COMPLETION RATE",
        value: `${instructorProfile.completionRate || 87.6}%`,
        foot: "▲ 3.2% vs target",
        tone: "positive",
        icon: CheckCircle2
      },
      {
        id: "kpi-average-rating",
        label: "AVERAGE RATING",
        value: `${instructorProfile.averageRating || 4.92} / 5.0`,
        foot: "342 reviews",
        tone: "positive",
        icon: Star
      },
      {
        id: "kpi-net-earnings",
        label: "NET EARNINGS",
        value: `₹${Number(instructorProfile.netEarningsMonth || 284500).toLocaleString("en-IN")}`,
        foot: "▲ 18.5% growth",
        tone: "positive",
        icon: IndianRupee
      },
      {
        id: "kpi-open-questions",
        label: "OPEN QUESTIONS",
        value: String(instructorProfile.openQuestionsCount || 7),
        foot: "3 pending reply",
        tone: "warning",
        icon: MessageSquareQuote
      }
    ];
  }, [instructorProfile]);

  return (
    <section className="kpi-grid-container" aria-label="Key Performance Indicators">
      <div className="metrics-grid">
        {kpiCards.map((card) => (
          <Metric
            key={card.id}
            id={card.id}
            label={card.label}
            value={card.value}
            foot={card.foot}
            tone={card.tone}
            icon={card.icon}
            subtitle={card.subtitle}
          />
        ))}
      </div>
    </section>
  );
}
