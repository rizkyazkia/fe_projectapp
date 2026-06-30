import React from "react";
import TableTeacher from "../../../components/dashboard/school/TableTeacher";
import FormAddDouble from "../../../components/FormAddDouble";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { HSStaticMethods, HSOverlay } from "preline/preline";
import { useFormik } from "formik";
import useSWR from "swr";
import { getClasses } from "../../../lib/classesAPI";
import { useTeachers } from "../../../hooks/useTeachers";
import { useAuth } from "../../../hooks/auth/useAuth";
import FormEditTeacher from "../../../components/dashboard/school/FormEditTeacher";

const Teachers = () => {
  React.useEffect(() => {
    HSStaticMethods.autoInit();
  }, []);

  const { addTeacher, deleteTeacher } = useTeachers();
  const { accessToken } = useAuth();

  const [showPassword, setShowPassword] = React.useState(false);
  const [dataTeacher, setDataTeacher] = React.useState(null);
  const [selectedTeacher, setSelectedTeacher] = React.useState(null);

  const classes = async () => {
    const response = await getClasses(accessToken);
    return response.data;
  };

  const { data } = useSWR("classes", classes);

  const { handleChange, handleBlur, handleSubmit, setFieldValue } = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      role_id: 4,
      fullName: "",
      role: "",
      classId: 0,
      address: "",
      phone: "",
    },
    onSubmit: async (values) => {
      await addTeacher(values, accessToken);
    },
  });

  if (!data) {
    return (
      <div className="max-w-lg w-full bg-gray-300 animate-pulse h-[44px]"></div>
    );
  }

  const handleDelete = async (id) => {
    await deleteTeacher(id);
  };

  const handleEdit = async (id) => {
    const selectTeacher = dataTeacher?.find((item) => item.id === id);
    setSelectedTeacher(selectTeacher);
    HSOverlay.open("#modal-edit-teachers");
  };

  return (
    <div>
      <FormEditTeacher selectedTeacher={selectedTeacher} classes={data} />
      <TableTeacher
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        setDataTeacher={setDataTeacher}
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
              <div className="max-w-lg w-full">
                <label
                  htmlFor="role-add"
                  className="block text-sm font-medium mb-2"
                >
                  Wali Kelas
                </label>

                <select
                  id="role-add"
                  name="role"
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
                  className="hidden"
                  onChange={(e) => {
                    setFieldValue("role", e.target.value);
                    const selectedClass = data?.classes?.find(
                      (item) => item.name === e.target.value
                    );
                    setFieldValue("classId", parseInt(selectedClass?.id));
                  }}
                >
                  <option value="">Pilih Kelas</option>
                  {data &&
                    data?.classes?.length > 0 &&
                    data?.classes?.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                </select>
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
      </TableTeacher>
    </div>
  );
};

export default Teachers;
