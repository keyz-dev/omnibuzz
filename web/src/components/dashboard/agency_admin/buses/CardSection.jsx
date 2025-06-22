import React from 'react';
import { StatCard } from '../../../ui';
import { BusFront, Bus, Hand, Wrench } from 'lucide-react';

const CardSection = ({ busStats }) => {

    const statCards = [
        { title: 'Total Buses', value: busStats.total, colorTheme: 'blue', icon: BusFront, description: 'Total number of buses in the agency' },
        { title: 'Active Buses', value: busStats.active, colorTheme: 'green', icon: Bus, description: 'Number of active buses' },
        { title: 'Available Buses', value: busStats.available, colorTheme: 'yellow', icon: Hand, description: 'Number of available buses' },
        { title: 'Under Maintenance', value: busStats.maintenance, colorTheme: 'red', icon: Wrench, description: 'Number of buses under maintenance' },
    ];
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
            {statCards.map(card => (
                <StatCard
                    key={card.title}
                    {...card}
                />
            ))}
        </div>
    );
};

export default CardSection;