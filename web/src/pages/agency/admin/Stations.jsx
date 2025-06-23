import React, { useState } from "react";
import {
  StationsMainView,
  Details,
} from "../../../components/dashboard/agency_admin/stations";
import { StationProvider } from "../../../stateManagement/contexts/StationContext";

const Stations = () => {
  const [view, setView] = useState("main");
  const [station, setStation] = useState(null);

  return (
    <StationProvider>
      <section>
        {view == "main" ? (
          <StationsMainView
            setView={() => setView("details")}
            setStation={setStation}
          />
        ) : (
          <Details setView={() => setView("main")} station={station} />
        )}
      </section>
    </StationProvider>
  );
};

export default Stations;
