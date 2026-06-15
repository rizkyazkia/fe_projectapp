import React, { useEffect, useState } from "react";
import Table from "../../../components/dashboard/admin/Table";
import FormAddUser from "../../../components/FormAddDouble";
import useSWR from "swr";
import { useFormik } from "formik";
import {
  addCity,
  addProvince,
  getCitiesByProvince,
} from "../../../lib/cityAPI";
import { getProvinces } from "../../../lib/provinceAPI";
import { getInstitutionType } from "../../../lib/institutionsAPI";
import { useAuth } from "../../../hooks/auth/useAuth";
import { HSSelect, HSStaticMethods } from "preline/preline";
import { FaPlus } from "react-icons/fa";
import ModalContainer from "../../../components/Modal";
import { capitalizeText } from "../../../lib/utility";
import { toast } from "react-toastify";
const Users = () => {
  const { registerInstitution } = useAuth();

  const province = async () => {
    const response = await getProvinces();
    return response.data;
  };

  const institution = async () => {
    const response = await getInstitutionType();
    return response.data;
  };

  const [isAddProvince, setIsAddProvince] = useState(false);
  const [isAddCity, setIsAddCity] = useState(false);

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    resetForm,
    getFieldProps,
  } = useFormik({
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

  const institutionProvince = getFieldProps("institutionProvince");

  const { data: provinces, mutate: mutateProvinces } = useSWR(
    "provinces",
    province,
  );
  const { data: cities, mutate: mutateCities } = useSWR(
    institutionProvince.value > 0
      ? `cities-${institutionProvince.value}`
      : null,
    async () => {
      const res = await getCitiesByProvince(institutionProvince.value);
      return res.data;
    },
    { fallbackData: [] },
  );
  const { data: institutions } = useSWR("institutionType", institution);
  const [newProvince, setNewProvince] = useState("");
  const [newCity, setNewCity] = useState("");
  const { accessToken } = useAuth();
  const [selectedProvinceId, setSelectedProvinceId] = useState(null);

  const handleProvinceChange = (event) => {
    const provinceId = event.target.value;
    setFieldValue("institutionProvince", provinceId);
    setFieldValue("institutionCity", 0);
  };

  const addNewProvince = async (newProvince) => {
    try {
      if (!newProvince) {
        throw new Error("Isi provinsi terlebih dahulu");
      }
      const capitalizeProvince = capitalizeText(newProvince);
      if (provinces?.some((p) => p.name === capitalizeProvince)) {
        toast.error("Provinsi sudah ada");
        return;
      }
      await addProvince(capitalizeProvince, accessToken);
      setNewProvince("");
      setIsAddProvince(false);
      await mutateProvinces();
      toast.success("Provinsi berhasil ditambahkan");
    } catch (err) {
      console.log({ err });
      toast.error(`Gagal menambahkan provinsi: ${err.messsage}`);
    }
  };

  const addNewCity = async (provinceId, newCity) => {
    try {
      if (!newCity) {
        throw new Error("Isi kota terlebih dahulu");
      }

      const capitalizeCity = capitalizeText(newCity);
      if (cities) {
        const isDuplicate = cities.some((city) => city.name === capitalizeText);
        if (isDuplicate) {
          toast.error(`Kota sudah ada`);
          return;
        }
        const isExists = cities.some(
          (city) =>
            city.name === capitalizeCity && city.province_id === provinceId,
        );
        if (isExists) {
          toast.error(`Kota sudah ada`);
          return;
        }
      }
      await addCity(provinceId, capitalizeCity, accessToken);
      setNewCity("");
      setIsAddCity(false);
      await mutateCities();
      toast.success("Kota berhasil ditambahkan");
    } catch (err) {
      console.log({ err });
      toast.error(`Gagal menambahkan Kota: ${err.message}`);
    }
  };

  useEffect(() => {
    if (isAddCity) {
      const el = document.querySelector("#addCityProvince");
      if (el) {
        HSSelect.getInstance(el)?.destroy();
      }
    }
    HSStaticMethods.autoInit();
  }, [isAddCity, isAddProvince, institutionProvince.value]);

  useEffect(() => {
    document.querySelectorAll("#institutionProvince, #addCityProvince").forEach((el) => {
      HSSelect.getInstance(el)?.destroy();
    });
    HSStaticMethods.autoInit();
  }, [provinces]);

  useEffect(() => {
    const citySelectElement = document.querySelector("#institutionCity");

    if (citySelectElement) {
      HSSelect.getInstance(citySelectElement).destroy();
      HSStaticMethods.autoInit();
    }
  }, [cities]);

  if (!provinces) return <div>Loading...</div>;
  if (!institutions) return <div>Loading...</div>;

  return (
    <div>
      <ModalContainer
        title={"Tambah Provinsi"}
        isOpen={isAddProvince}
        onClose={() => setIsAddProvince(false)}
      >
        <div className="max-w-full">
          <label
            htmlFor="input-province"
            className="block text-sm font-medium mb-2 dark:text-white"
          >
            Nama Provinsi
          </label>
          <input
            type="text"
            id="input-province"
            className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            placeholder="Jawa Barat"
            value={newProvince}
            onChange={(e) => setNewProvince(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none justify-center"
          onClick={() => addNewProvince(newProvince)}
        >
          Submit
        </button>
      </ModalContainer>

      <ModalContainer
        title={"Tambah Kota"}
        isOpen={isAddCity}
        onClose={() => setIsAddCity(false)}
      >
        <div>
          <label
            htmlFor="addCityProvince"
            className="block text-sm font-medium mb-2 dark:text-white"
          >
            Pilih Provinsi
          </label>
          <select
            id="addCityProvince"
            name="addCityProvince"
            value={selectedProvinceId || ""}
            onChange={(event) =>
              setSelectedProvinceId(Number(event.target.value))
            }
            data-hs-select='{
                    "placeholder": "Pilih Provinsi...",
                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                    "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800",
                    "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                    "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                    "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                    "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>",
                    "hasSearch": true
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
        <div className="">
          <label
            htmlFor="input-city"
            className="block text-sm font-medium mb-2 dark:text-white"
          >
            Nama Kota
          </label>
          <input
            type="text"
            id="input-city"
            className="py-2.5 sm:py-3 px-4 block border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 w-full "
            placeholder="Bandung"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none justify-center"
          onClick={() => addNewCity(selectedProvinceId, newCity)}
        >
          Submit
        </button>
      </ModalContainer>

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
                    className="py-2 px-3 sm:py-3 sm:px-4 block w-full border border-obito-grey rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
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
                  <div className="flex justify-between gap-2">
                    <div className="flex-1">
                      <select
                        id="institutionProvince"
                        name="institutionProvince"
                        onChange={handleProvinceChange}
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
                    <button
                      type="button"
                      className="px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => setIsAddProvince(true)}
                    >
                      <FaPlus />
                    </button>
                  </div>
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
                  <div className="flex justify-between gap-2 ">
                    <div className=" w-full">
                      <select
                        id="institutionCity"
                        name="institutionCity"
                        onChange={(event) =>
                          setFieldValue("institutionCity", event.target.value)
                        }
                        data-hs-select='{
                    "hasSearch": true,
                    "searchPlaceholder": "Cari...",
                    "searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-800 focus:ring-blue-800 before:absolute before:inset-0 before:z-1 py-1.5 sm:py-2 px-3",
                    "searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0",
                    "placeholder": "Pilh Kota...",
                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                    "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800",
                    "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                    "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                    "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                    "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                  }'
                        className="hidden"
                      >
                        <option value="">Pilih Kota</option>
                        {cities.map((c) => {
                          return (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <button
                      type="button"
                      className="px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => {
                        setSelectedProvinceId(Number(institutionProvince.value) || null);
                        setIsAddCity(true)
                      }}
                    >
                      <FaPlus />
                    </button>
                  </div>
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
                    "searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-800 focus:ring-blue-800 before:absolute before:inset-0 before:z-1 py-1.5 sm:py-2 px-3",
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
