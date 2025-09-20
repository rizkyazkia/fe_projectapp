import React from "react";
import TableClasses from "../../../components/dashboard/school/TableClasses";
import { HiTrash } from "react-icons/hi";
import { FaPlus } from "react-icons/fa6";
import { useFormik } from "formik";
import { useClasses } from "../../../hooks/useClasses";
import { HSOverlay } from "preline/preline";
import FormEditClasses from "../../../components/dashboard/school/FormEditClasses";

const Classes = () => {
  const { addClass, deleteClass } = useClasses();

  const [selectedId, setSelectedId] = React.useState(null);

  const { values, handleChange, handleBlur, handleSubmit, setFieldValue } =
    useFormik({
      initialValues: {
        classes: [{ name: "" }],
      },
      onSubmit: async (values) => {
        await addClass(values);
      },
    });

  const handleAddClassInput = () => {
    setFieldValue("classes", [...values.classes, { name: "" }]);
  };

  const handleRemoveClassInput = (index) => {
    const updatedClasses = values.classes.filter((_, i) => i !== index);
    setFieldValue("classes", updatedClasses);
  };

  const handleDelete = async (id) => {
    await deleteClass(id);
  };

  const handleEdit = async (id) => {
    HSOverlay.open("#modal-edit-classes");
    setSelectedId(id);
  };
  console.log({ values });

  return (
    <div>
      <FormEditClasses selectedId={selectedId} />
      <TableClasses handleDelete={handleDelete} handleEdit={handleEdit}>
        <form onSubmit={handleSubmit}>
          {values.classes.map((input, index) => (
            <div key={index} className="max-w-lg p-4">
              <label
                htmlFor={`classes.${index}.name`}
                className="block text-sm font-medium mb-2"
              >
                Kelas ke {index + 1}
              </label>
              <div className="flex items-center gap-x-5">
                <input
                  type="text"
                  id={`classes.${index}.name`}
                  name={`classes.${index}.name`}
                  className="py-2.5 sm:py-3 px-4 block w-full border border-obito-grey rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder="5A"
                  value={input.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div>
                  <button
                    type="button"
                    onClick={() => handleRemoveClassInput(index)}
                    className="inline-flex justify-center items-center size-11 rounded-full border-4 border-red-100 bg-red-200 text-red-800"
                  >
                    <HiTrash size={16} className="text-red-800" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <hr className="border-obito-grey"></hr>
          <div className="p-4 flex items-center justify-between">
            <button
              type="button"
              onClick={handleAddClassInput}
              className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-blue-600 hover:border-blue-600 focus:outline-hidden focus:border-blue-600 focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none"
            >
              <FaPlus size={16} className="text-blue-600" />
              Kelas
            </button>
            <button
              type="submit"
              className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            >
              Tambah
            </button>
          </div>
        </form>
      </TableClasses>
    </div>
  );
};

export default Classes;
