import React from "react";
import Table from "../../../components/dashboard/admin/Table";
import FormAddUser from "../../../components/dashboard/admin/FormAddUser";
import useSWR from "swr";
import { useFormik } from "formik";
import { getCities } from "../../../lib/cityAPI";
import { getProvinces } from "../../../lib/provinceAPI";
import { getInstitutionType } from "../../../lib/institutionsAPI";
import { useAuth } from "../../../hooks/auth/useAuth";

const Users = () => {
  const { registerInstitution } = useAuth();

  const province = async () => {
    const response = await getProvinces();
    return response.data;
  };

  const city = async () => {
    const response = await getCities();
    return response.data;
  };

  const institution = async () => {
    const response = await getInstitutionType();
    return response.data;
  };

  const { handleChange, handleBlur, handleSubmit, setFieldValue, resetForm } =
    useFormik({
      initialValues: {
        username: "",
        email: "",
        password: "",
        role_id: 0,
        institutionName: "",
        institutionEmail: "",
        institutionPhone: "",
        institutionAddress: "",
        institutionProvince: 0,
        institutionCity: 0,
        institutionType: 0,
      },
      onSubmit: async (values) => {
        let role_id = 0;
        const institutionType = parseInt(values.institutionType, 10);

        if (institutionType === 1) {
          role_id = 3;
        } else if (institutionType === 2) {
          role_id = 5;
        }

        const modifiedValues = {
          ...values,
          institutionProvince: parseInt(values.institutionProvince, 10),
          institutionCity: parseInt(values.institutionCity, 10),
          institutionType,
          role_id,
        };

        await registerInstitution(modifiedValues);
      },
    });

  const { data: provinces } = useSWR("provinces", province);
  const { data: cities } = useSWR("cities", city);
  const { data: institutions } = useSWR("institutionType", institution);

  if (!provinces) return <div>Loading...</div>;
  if (!cities) return <div>Loading...</div>;
  if (!institutions) return <div>Loading...</div>;

  return (
    <div>
      <Table>
        <form onSubmit={handleSubmit}>
          <div className="p-4">
            <div className="flex flex-col space-y-3">
              <FormAddUser
                htmlFor1="username"
                htmlFor2="email"
                label1="Username"
                label2="Email"
                type1="text"
                type2="email"
                id1="username"
                id2="email"
                name1="username"
                name2="email"
                placeholder1="Contoh"
                placeholder2="Contoh@example.com"
                onChange1={handleChange}
                onChange2={handleChange}
                onBlur1={handleBlur}
                onBlur2={handleBlur}
              />
              <FormAddUser
                htmlFor1="password"
                htmlFor2="institutionName"
                label1="Password"
                label2="Nama Instansi"
                type1="password"
                type2="text"
                id1="password"
                id2="institutionName"
                name1="password"
                name2="institutionName"
                placeholder1="katasandi123"
                placeholder2="SD Negri 1 Bandung"
                onChange1={handleChange}
                onChange2={handleChange}
                onBlur1={handleBlur}
                onBlur2={handleBlur}
              />
              <FormAddUser
                htmlFor1="institutionEmail"
                htmlFor2="institutionPhone"
                label1="Email Instansi"
                label2="No. Telepon Instansi"
                type1="email"
                type2="text"
                id1="institutionEmail"
                id2="institutionPhone"
                name1="institutionEmail"
                name2="institutionPhone"
                placeholder1="sdnegri1bandung@example.com"
                placeholder2="08123456789"
                onChange1={handleChange}
                onChange2={handleChange}
                onBlur1={handleBlur}
                onBlur2={handleBlur}
              />
              <div className="flex gap-5">
                <div className="max-w-lg w-full">
                  <label
                    htmlFor="institutionAddress"
                    className="block text-sm font-medium mb-2"
                  >
                    Alamat Instansi
                  </label>
                  <textarea
                    id="institutionAddress"
                    name="institutionAddress"
                    className="py-2 px-3 sm:py-3 sm:px-4 block w-full border border-obito-grey rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    rows="1"
                    placeholder="Jl. Telekomunikasi No. 1, Bandung"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  ></textarea>
                </div>
                <div className="max-w-lg w-full">
                  <label
                    htmlFor="institutionProvince"
                    className="block text-sm font-medium mb-2"
                  >
                    Provinsi Instansi
                  </label>
                  <select
                    id="institutionProvince"
                    name="institutionProvince"
                    onChange={(event) =>
                      setFieldValue("institutionProvince", event.target.value)
                    }
                    data-hs-select='{
                    "placeholder": "Pilih Provinsi...",
                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                    "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800",
                    "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                    "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                    "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                    "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                  }'
                    className="hidden"
                  >
                    <option value="">Pilih Provinsi</option>
                    {provinces.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="max-w-lg w-full">
                  <label
                    htmlFor="institutionCity"
                    className="block text-sm font-medium mb-2"
                  >
                    Kota Instansi
                  </label>
                  <select
                    id="institutionCity"
                    name="institutionCity"
                    onChange={(event) =>
                      setFieldValue("institutionCity", event.target.value)
                    }
                    data-hs-select='{
                    "hasSearch": true,
                    "searchPlaceholder": "Cari...",
                    "searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 py-1.5 sm:py-2 px-3",
                    "searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0",
                    "placeholder": "Pilh Kota...",
                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                    "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800",
                    "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                    "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                    "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                    "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                  }'
                    className="hidden"
                  >
                    <option value="">Pilih Kota</option>
                    {cities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="max-w-lg w-full">
                  <label
                    htmlFor="institutionType"
                    className="block text-sm font-medium mb-2"
                  >
                    Tipe Instansi
                  </label>
                  <select
                    id="institutionType"
                    name="institutionType"
                    onChange={(event) =>
                      setFieldValue("institutionType", event.target.value)
                    }
                    data-hs-select='{
                    "hasSearch": true,
                    "searchPlaceholder": "Cari...",
                    "searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 py-1.5 sm:py-2 px-3",
                    "searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0",
                    "placeholder": "Pilh Tipe Instansi...",
                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                    "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800",
                    "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                    "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                    "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                    "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                  }'
                    className="hidden"
                  >
                    <option value="">Pilih Tipe Instansi</option>
                    {institutions.map((i) => {
                      let institutionType = "";
                      switch (i.name) {
                        case "School":
                          institutionType = "Sekolah";
                          break;
                        case "HealthCare":
                          institutionType = "Puskesmas";
                          break;
                        default:
                          institutionType = "Lainnya";
                          break;
                      }
                      return (
                        <option key={i.id} value={i.id}>
                          {institutionType}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t border-obito-grey">
            <button
              type="submit"
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            >
              Tambah
            </button>
          </div>
        </form>
      </Table>
    </div>
  );
};

export default Users;
