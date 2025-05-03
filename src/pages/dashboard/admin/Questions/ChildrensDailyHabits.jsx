import React from "react";
import TableQuestion from "../../../../components/dashboard/admin/TableQuestion";
import FormEditQuestion from "../../../../components/dashboard/admin/FormEditQuestion";

const ChildrensDailyHabits = () => {
  return (
    <div>
      <TableQuestion id={3}>
        <FormEditQuestion />
      </TableQuestion>
    </div>
  );
};

export default ChildrensDailyHabits;
