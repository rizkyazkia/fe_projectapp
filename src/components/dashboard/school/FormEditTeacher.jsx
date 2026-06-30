import { useFormik } from "formik";
import React from "react";
import { useTeachers } from "../../../hooks/useTeachers";
import { HSStaticMethods } from "preline/preline";

const FormEditTeacher = ({ selectedTeacher, classes }) => {
  const { updateTeacher } = useTeachers();

  const { values, handleChange, handleBlur, handleSubmit, setFieldValue } =
    useFormik({
      initialValues: {
        role: selectedTeacher?.role || "",
        address: selectedTeacher?.address || "",
        phone: selectedTeacher?.phone || "",
      },
      onSubmit: async (values) => {
        await updateTeacher(selectedTeacher?.id, values);
      },
      enableReinitialize: true,
    });

  React.useEffect(() => {
    const selectInstance = HSSelect.getInstance("#role", true);
    if (selectInstance) {
      selectInstance.element.setValue(values.role);
    }

    HSStaticMethods.autoInit();
  }, [values.role]);

  return (
    <div
      id="modal-edit-teachers"
      className="hs-overlay [--overlay-backdrop:static] hidden size-full fixed top-0 start-0 z-100 overflow-x-hidden overflow-y-auto pointer-events-none bg-gray-900/50"
      tabIndex="-1"
      aria-labelledby="modal-edit-teachers-label"
      data-hs-overlay-keyboard="false"
    >
      <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg lg:max-w-2xl sm:w-full m-3 sm:mx-auto min-h-[calc(100%-56px)] flex items-center">
        <div className="flex flex-col bg-white border border-obito-grey shadow-2xs rounded-xl pointer-events-auto lg:w-lg">
          <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200">
            <h3 id="modal-edit-teachers" className="font-bold text-gray-800">
              Edit Guru
            </h3>
            <button
              type="button"
              className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
              aria-label="Close"
              data-hs-overlay="#modal-edit-teachers"
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
          {/* Form Edit Start */}
          {!selectedTeacher ? (
            <div className="space-y-4 p-4">
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="p-4 flex flex-col space-y-4">
                <div className="max-w-lg w-full">
                  <label
                    id="label-role"
                    htmlFor="role"
                    className="block text-sm font-medium mb-2"
                  >
                    Wali Kelas
                  </label>

                  <select
                    name="role"
                    id="role"
                    data-hs-select='{
                    "hasSearch": true,
                    "searchPlaceholder": "Cari...",
                    "searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 py-1.5 sm:py-2 px-3",
                    "searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0",
                    "placeholder": "Pilh Kelas",
                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                    "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800",
                    "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                    "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                    "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                    "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                  }'
                    className="block"
                    value={values.role}
                    onChange={(e) => setFieldValue("role", e.target.value)}
                  >
                    <option value="">Pilih Kelas</option>
                    {classes?.classes?.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-5">
                  <div className="max-w-lg w-full">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium mb-2"
                    >
                      Alamat
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      className="py-2 px-3 sm:py-3 sm:px-4 block w-full border border-obito-grey rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                      rows="3"
                      placeholder="Jl. Contoh No. 123"
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    ></textarea>
                  </div>
                  <div className="max-w-lg w-full">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium mb-2"
                    >
                      No HP
                    </label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      className="py-2.5 sm:py-3 px-4 block w-full border border-obito-grey rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                      placeholder="0822787878"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full h-[1px] bg-gray-200 mb-3"></div>
              <div className="px-4 pb-4 flex justify-end">
                <button
                  type="submit"
                  className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                  Edit
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormEditTeacher;
