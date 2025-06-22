import React, { useState } from 'react';
import { MainView, BulkInsertView } from '../../../components/dashboard/agency_admin/buses';

const AgencyBuses = () => {
  const [view, setView] = useState('main');
  return (
    <section className=''>
      {view == 'bulk' ?
        <BulkInsertView setView={() => setView('main')} />
        :
        <MainView setView={() => setView('bulk')} />
      }
    </section>
  );

};

export default AgencyBuses;
