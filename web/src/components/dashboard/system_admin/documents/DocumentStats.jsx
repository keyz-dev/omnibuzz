import React from "react";
import { StatCard } from "../../../ui";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";

const DocumentStats = ({ stats }) => {
  const statCards = [
    {
      title: "All Documents",
      value: stats.all,
      colorTheme: "blue",
      icon: FileText,
      description: "Total number of documents submitted",
    },
    {
      title: "Approved",
      value: stats.approved,
      colorTheme: "green",
      icon: CheckCircle,
      description: "Number of approved documents",
    },
    {
      title: "Pending Review",
      value: stats.pending,
      colorTheme: "purple",
      icon: Clock,
      description: "Number of documents pending review",
    },
    {
      title: "Rejected",
      value: stats.rejected,
      colorTheme: "red",
      icon: XCircle,
      description: "Number of rejected documents",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
      {statCards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
};

export default DocumentStats;
