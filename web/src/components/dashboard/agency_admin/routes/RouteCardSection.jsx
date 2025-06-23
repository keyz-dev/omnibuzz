import React from "react";
import { StatCard } from "../../../ui";
import { BusFront, Bus, Hand } from "lucide-react";

const RouteCardSection = ({ routeStats }) => {
  const statCards = [
    {
      title: "Total Routes",
      value: routeStats.total,
      colorTheme: "blue",
      icon: BusFront,
      description: "Total number of routes in the agency",
    },
    {
      title: "Active Routes",
      value: routeStats.active,
      colorTheme: "green",
      icon: Bus,
      description: "Number of active routes",
    },
    {
      title: "Inactive Routes",
      value: routeStats.inactive,
      colorTheme: "red",
      icon: Hand,
      description: "Number of inactive routes",
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

export default RouteCardSection;
