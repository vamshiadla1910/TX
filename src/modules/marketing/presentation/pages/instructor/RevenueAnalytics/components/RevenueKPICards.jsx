/**
 * RevenueKPICards Component
 * Reuses the canonical TX-Pathwing Metric card primitive to render
 * Total Revenue, Monthly Revenue, Total Transactions, and Avg Revenue per Enrollment.
 */

import { IndianRupee, TrendingUp, Receipt, Wallet } from "lucide-react";
import { Metric } from "../../common/Metric.jsx";

export function RevenueKPICards({ kpis }) {
  if (!kpis) return null;

  const cards = [
    {
      id: "rev-kpi-total",
      label: "TOTAL REVENUE",
      value: kpis.totalRevenue.formattedValue,
      subtitle: kpis.totalRevenue.subtitle,
      foot: kpis.totalRevenue.delta.label,
      tone: kpis.totalRevenue.delta.tone,
      icon: IndianRupee
    },
    {
      id: "rev-kpi-monthly",
      label: "MONTHLY REVENUE",
      value: kpis.monthlyRevenue.formattedValue,
      subtitle: kpis.monthlyRevenue.subtitle,
      foot: kpis.monthlyRevenue.delta.label,
      tone: kpis.monthlyRevenue.delta.tone,
      icon: TrendingUp
    },
    {
      id: "rev-kpi-transactions",
      label: "TOTAL TRANSACTIONS",
      value: kpis.totalTransactions.formattedValue,
      subtitle: kpis.totalTransactions.subtitle,
      foot: kpis.totalTransactions.delta.label,
      tone: kpis.totalTransactions.delta.tone,
      icon: Receipt
    },
    {
      id: "rev-kpi-average",
      label: "AVG REVENUE / ENROLLMENT",
      value: kpis.avgRevenuePerEnrollment.formattedValue,
      subtitle: kpis.avgRevenuePerEnrollment.subtitle,
      foot: kpis.avgRevenuePerEnrollment.delta.label,
      tone: kpis.avgRevenuePerEnrollment.delta.tone,
      icon: Wallet
    }
  ];

  return (
    <section className="inst-rev-kpi-grid" aria-label="Revenue Key Performance Indicators">
      {cards.map((card) => (
        <Metric
          key={card.id}
          id={card.id}
          label={card.label}
          value={card.value}
          subtitle={card.subtitle}
          foot={card.foot}
          tone={card.tone}
          icon={card.icon}
        />
      ))}
    </section>
  );
}

export default RevenueKPICards;
