import React, { useState } from "react";
import {
  StationsMainView,
  Details,
} from "../../../components/dashboard/agency_admin/stations";

const Stations = () => {
  const [view, setView] = useState("main");
  const [station, setStation] = useState(null);

  return (
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
  );
};

export default Stations;
