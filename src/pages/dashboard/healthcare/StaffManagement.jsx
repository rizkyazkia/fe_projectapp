import React from "react";
import FormAddDouble from "../../../components/FormAddDouble";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { HSStaticMethods, HSOverlay } from "preline/preline";
import { useFormik } from "formik";
import useSWR from "swr";
import { getClasses } from "../../../lib/classesAPI";
import { useTeachers } from "../../../hooks/useTeachers";
import { useAuth } from "../../../hooks/auth/useAuth";
import FormEditStaff from "./FormEditStaff";
import {
  createStaff,
  deleteStaff,
  getStaffs,
  updateStaff,
} from "../../../lib/admin/healthcare/staffApi";
import { toast } from "react-toastify";
import StaffTable from "./StaffTable";

const StaffManagement = () => {
  React.useEffect(() => {
    HSStaticMethods.autoInit();
  }, []);

  const { deleteTeacher } = useTeachers();
  const { accessToken } = useAuth();

  const [showPassword, setShowPassword] = React.useState(false);
  const [staffsData, setStaffsData] = React.useState(null);
  const [selectedStaff, setSelectedStaff] = React.useState(null);

  const classes = async () => {
    const response = await getClasses();
    return response.data;
  };

  const { data } = useSWR("classes", classes);

  const getAllStaffHandler = async () => {
    const data = await getStaffs(accessToken);
    return data.data;
  };

  const deleteStaffHandler = async (id) => {
    try {
      const data = await deleteStaff(id, accessToken);
      toast.success("Staff berhasil dihapus", {
        autoClose: 1000,
        onClose: () => window.location.reload(),
      });
    } catch (err) {
      console.log({ err });
      toast.error(err.message, { autoClose: 500 });
    }
  };

  const addStaffHandler = async (values) => {
    try {
      const data = await createStaff(values, accessToken);
      toast.success("Berhasil menambahkan staff", {
        onClose: () => window.location.reload(),
      });
    } catch (err) {
      console.log({ err });
      toast.error(err.message);
    }
  };

  const { handleChange, handleBlur, handleSubmit, setFieldValue } = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      role_id: 6,
      fullName: "",
      role: "",
      address: "",
      phone: "",
    },
    onSubmit: async (values) => {
      await addStaffHandler(values, accessToken);
    },
  });

  if (!data) {
    return (
      <div className="max-w-lg w-full bg-gray-300 animate-pulse h-[44px]"></div>
    );
  }

  const handleEdit = async (id) => {
    const selectedStaff = staffsData?.find((item) => item.id === id);
    setSelectedStaff(selectedStaff);
    HSOverlay.open("#modal-edit-staff");
  };

  return (
    <div>
      <FormEditStaff selectedStaff={selectedStaff} />
      <StaffTable
        handleDelete={deleteStaffHandler}
        handleEdit={handleEdit}
        setStaffsData={setStaffsData}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-4 flex flex-col space-y-4">
            <div className="max-w-lg w-full">
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="py-2.5 sm:py-3 px-4 block w-full border border-obito-grey rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                placeholder="contoh"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div className="flex flex-col space-y-3">
              <FormAddDouble
                htmlFor1={"email"}
                htmlFor2={"password"}
                id1={"email"}
                id2={"password"}
                label1={"Email"}
                label2={"Password"}
                type1={"email"}
                type2={showPassword ? "text" : "password"}
                name1={"email"}
                name2={"password"}
                placeholder1={"contoh@example.com"}
                placeholder2={"katasandi123"}
                onChange1={handleChange}
                onChange2={handleChange}
                onBlur1={handleBlur}
                onBlur2={handleBlur}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <IoEyeOutline
                    size={16}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  />
                ) : (
                  <IoEyeOffOutline
                    size={16}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  />
                )}
              </FormAddDouble>
            </div>
            <div className="flex items-center gap-5">
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
                  placeholder="contoh lengkap"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="max-w-lg w-full">
                <label
                  htmlFor="address-add"
                  className="block text-sm font-medium mb-2"
                >
                  Alamat
                </label>
                <textarea
                  id="address-add"
                  name="address"
                  className="py-2 px-3 sm:py-3 sm:px-4 block w-full border border-obito-grey rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                  rows="3"
                  placeholder="Jl. Contoh No. 123"
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></textarea>
              </div>
              <div className="max-w-lg w-full">
                <label
                  htmlFor="phone-add"
                  className="block text-sm font-medium mb-2"
                >
                  No HP
                </label>
                <input
                  type="text"
                  id="phone-add"
                  name="phone"
                  className="py-2.5 sm:py-3 px-4 block w-full border border-obito-grey rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder="0822787878"
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
              Tambah
            </button>
          </div>
        </form>
      </StaffTable>
    </div>
  );
};

export default StaffManagement;
