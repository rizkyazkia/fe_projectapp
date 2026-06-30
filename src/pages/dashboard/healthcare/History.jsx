import React from "react";
import InterventionTable from "../../../components/dashboard/healthcare/InterventionTable";

const History = ({ forWho = "INSTITUTION" }) => {
  return (
    <div>
      <InterventionTable forWho={forWho} />
    </div>
  );
};

export default History;
