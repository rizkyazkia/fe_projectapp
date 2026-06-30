import { useFormik } from "formik";
import React from "react";
import { HSStaticMethods } from "preline/preline";
import { toast } from "react-toastify";
import { updateStaff } from "../../../lib/admin/healthcare/staffApi";
import { useAuth } from "../../../hooks/auth/useAuth";
import { token } from "../../../lib/auth/authAPI";
import { jwtDecode } from "jwt-decode";

const FormEditStaff = ({ selectedStaff }) => {
  const { accessToken, setAccessToken, user, setUser } = useAuth();

  const getActiveToken = async () => {
    const currentTime = new Date().getTime();
    if (user?.exp * 1000 < currentTime) {
      const response = await token();
      setAccessToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setUser(decoded);
      return response.data.accessToken;
    }
    return accessToken;
  };

  const editStaffHandler = async (id) => {
    try {
      const t = await getActiveToken();
      const data = await updateStaff(id, values, t);
      toast.success("Berhasil mengubah staff", {
        onClose: () => window.location.reload(),
        autoClose: 500,
      });
    } catch (err) {
      console.log({ err });
      toast.error(err.message);
    }
  };
  const { values, handleChange, handleBlur, handleSubmit, setFieldValue } =
    useFormik({
      initialValues: {
        role: selectedStaff?.role || "",
        address: selectedStaff?.address || "",
        phone: selectedStaff?.phone || "",
        fullName: selectedStaff?.fullName || "",
      },
      onSubmit: async (values) => {
        await editStaffHandler(selectedStaff?.id, values);
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

  console.log({ selectedStaff });

  return (
    <div
      id="modal-edit-staff"
      className="hs-overlay [--overlay-backdrop:static] hidden size-full fixed top-0 start-0 z-100 overflow-x-hidden overflow-y-auto pointer-events-none bg-gray-900/50"
      tabIndex="-1"
      aria-labelledby="modal-edit-staff-label"
      data-hs-overlay-keyboard="false"
    >
      <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg lg:max-w-2xl sm:w-full m-3 sm:mx-auto min-h-[calc(100%-56px)] flex items-center">
        <div className="flex flex-col bg-white border border-obito-grey shadow-2xs rounded-xl pointer-events-auto lg:w-lg">
          <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200">
            <h3 id="modal-edit-staff" className="font-bold text-gray-800">
              Edit Staff
            </h3>
            <button
              type="button"
              className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
              aria-label="Close"
              data-hs-overlay="#modal-edit-staff"
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
          {!selectedStaff ? (
            <div className="space-y-4 p-4">
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="p-4 flex flex-col space-y-4">
                <div className="flex flex-col items-center gap-5">
                  <div className="max-w-lg w-full">
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium mb-2"
                    >
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      className="py-2.5 sm:py-3 px-4 block w-full border border-obito-grey rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                      placeholder="0822787878"
                      value={values.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
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

export default FormEditStaff;
