import React, { useState } from 'react';
import { useAgency } from '../../../stateManagement/contexts/dashboard';
import { StationsMainView, Details } from '../../../components/dashboard/agency_admin/stations';
import { StationProvider } from '../../../stateManagement/contexts/StationContext';

const Stations = () => {
  const { stations } = useAgency();
  const [view, setView] = useState('main');
  const [station, setStation] = useState(null);

  return (
    <StationProvider>
      <section>
        {view == 'main' ? (
          <StationsMainView setView={() => setView('details')} stations={stations} setStation={setStation} />
        ) : (
          <Details setView={() => setView('main')} station={station} />
        )}
      </section>
    </StationProvider>
  );
};

export default Stations;