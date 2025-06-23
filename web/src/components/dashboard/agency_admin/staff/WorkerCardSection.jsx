import React from "react";
import { StatCard } from "../../../ui";
import { Users, UserCheck, UserCog } from "lucide-react";

const WorkerCardSection = ({ stats }) => {
  if (!stats) {
    return null; // Or a loading state
  }

  const statCards = [
    {
      title: "All Staff",
      value: stats.total,
      colorTheme: "blue",
      icon: Users,
      description: "All staff members in the agency",
    },
    {
      title: "Station Managers",
      value: stats.stationManagers,
      colorTheme: "green",
      icon: UserCheck,
      description: "Number of active station managers",
    },
    {
      title: "Ticket Agents",
      value: stats.ticketAgents,
      colorTheme: "purple",
      icon: UserCog,
      description: "Number of active ticket agents",
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

export default WorkerCardSection;
