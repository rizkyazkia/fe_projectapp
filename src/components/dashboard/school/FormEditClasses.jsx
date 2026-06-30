import React from "react";
import { getClasses } from "../../../lib/classesAPI";
import useSWR from "swr";
import { useFormik } from "formik";
import { useClasses } from "../../../hooks/useClasses";
import { useAuth } from "../../../hooks/auth/useAuth";

const FormEditClasses = ({ selectedId }) => {
  const { updateClass } = useClasses();
  const {accessToken } = useAuth();

  const classes = async () => {
    const response = await getClasses(accessToken);
    return response.data;
  };

  const { data } = useSWR("classes", classes);

  const selectedClass = data?.classes?.find((item) => item.id === selectedId);

  const { values, handleChange, handleBlur, handleSubmit } = useFormik({
    initialValues: {
      name: selectedClass?.name || "",
    },
    onSubmit: async (values) => {
      await updateClass(selectedId, values);
    },
    enableReinitialize: true,
  });

  return (
    <div
      id="modal-edit-classes"
      className="hs-overlay [--overlay-backdrop:static] hidden size-full fixed top-0 start-0 z-100 overflow-x-hidden overflow-y-auto pointer-events-none bg-gray-900/50"
      tabIndex="-1"
      aria-labelledby="modal-edit-classes-label"
      data-hs-overlay-keyboard="false"
    >
      <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg lg:max-w-2xl sm:w-full m-3 sm:mx-auto min-h-[calc(100%-56px)] flex items-center">
        <div className="flex flex-col bg-white border border-obito-grey shadow-2xs rounded-xl pointer-events-auto lg:w-lg">
          <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200">
            <h3 id="modal-edit-classes" className="font-bold text-gray-800">
              Edit Kelas
            </h3>
            <button
              type="button"
              className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
              aria-label="Close"
              data-hs-overlay="#modal-edit-classes"
            >
              <span className="sr-only">Close</span>
              <svg
                className="shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>
          <div>
            {data && data?.classes?.length > 0 ? (
              <form onSubmit={handleSubmit}>
                <div className="max-w-lg w-full p-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Kelas
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="py-2.5 sm:py-3 px-4 block w-full border border-obito-grey rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="7A"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <hr className="border border-obito-grey"></hr>
                <div className="p-4 flex justify-end">
                  <button
                    type="submit"
                    className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Edit
                  </button>
                </div>
              </form>
            ) : (
              <p className="h-4 bg-gray-200 rounded-full w-full"></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormEditClasses;
