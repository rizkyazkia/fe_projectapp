import { useFormik } from "formik";
import React, { useState } from "react";
import { FaChild, FaChildDress, FaChildReaching } from "react-icons/fa6";
import { getJobTypes } from "../../../lib/jobAPI";
import useSWR from "swr";
import { HSSelect, HSStaticMethods } from "preline/preline";
import {
  createFamilyMember,
  getFamilyMember,
} from "../../../lib/parent/familiesAPI";
import { useAuth } from "../../../hooks/auth/useAuth";
import { toast } from "react-toastify";
import { token } from "../../../lib/auth/authAPI";
import api from "../../../lib/api";
import TableFamilyMember from "../../../components/dashboard/parent/TableFamilyMember";
import { jwtDecode } from "jwt-decode";
import { getAllClass } from "../../../lib/classesAPI";
import { generateSchoolYears } from "../../../lib/utility";

const Family = () => {
  const { accessToken, setAccessToken, user, setUser } = useAuth();

  const dateInputRef = React.useRef(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isComplete, setIsComplete] = React.useState(false);
  const [selectedMembers, setSelectedMembers] = React.useState(["ANAK"]);

  const socioRefs = {
    residenceStatus: React.useRef(null),
    childrenCount: React.useRef(null),
    underFiveCount: React.useRef(null),
    familyIncomeLevel: React.useRef(null),
  };

  const memberLabels = {
    IBU: "Data Ibu",
    AYAH: "Data Ayah",
    ANAK: "Data Anak",
  };

  const memberIcons = {
    IBU: FaChildDress,
    AYAH: FaChild,
    ANAK: FaChildReaching,
  };

  const getTypeByIndex = (index) => {
    const relation = selectedMembers[index - 1];
    if (relation === "IBU") return "ibu";
    if (relation === "AYAH") return "ayah";
    return "anak";
  };

  const getInitialValues = (relation) => {
    if (relation === "IBU" || relation === "AYAH") {
      return {
        type: relation === "IBU" ? "ibu" : "ayah",
        fullName: "",
        age: "",
        education: "",
        relation: relation,
        phone: "",
        jobTypeId: "",
        residenceStatus: "",
        address: "",
        childrenCount: "",
        underFiveCount: "",
        familyIncomeLevel: "",
        ...(relation === "AYAH" && { sameSocioEconomic: false }),
      };
    }
    if (relation === "ANAK") {
      return {
        type: "anak",
        fullName: "",
        birthDate: "",
        education: "",
        gender: "",
        relation: "ANAK",
        nis: "",
        schoolYear: "",
        semester: "",
        schoolId: 0,
        weight: "",
        height: "",
        classId: 0,
      };
    }
  };

  // const handleMemberToggle = (relation) => {
  //   if (relation === "ANAK") return;
  //   setSelectedMembers((prev) => {
  //     if (prev.includes(relation)) {
  //       return prev.filter((r) => r !== relation);
  //     }
  //     return [...prev, relation];
  //   });
  // };

  const handleMemberToggle = (relation) => {
    if (relation === "ANAK") return;
    setSelectedMembers((prev) => {
      let next;
      if (prev.includes(relation)) {
        next = prev.filter((r) => r !== relation);
      } else {
        next = [...prev, relation];
      }
      const order = { IBU: 0, AYAH: 1, ANAK: 2 };
      return next.sort((a, b) => order[a] - order[b]);
    });
  };

  const onSubmit = async (values) => {
    const saved = localStorage.getItem("familyMember");
    const members = saved ? JSON.parse(saved) : [];
    const type = getTypeByIndex(currentIndex);
    const idx = members.findIndex((item) => item.type === type);

    const parsedValues = {
      ...values,
      weight: values.weight ? parseFloat(values.weight) : undefined,
      height: values.height ? parseFloat(values.height) : undefined,
      classId: values.classId ? parseInt(values.classId) : undefined,
      schoolId: values.schoolId ? parseInt(values.schoolId) : undefined,
      jobTypeId: values.jobTypeId ? parseInt(values.jobTypeId) : undefined,
    };

    let updated;
    if (idx !== -1) {
      updated = [...members];
      updated[idx] = { ...parsedValues, type };
    } else {
      updated = [...members, { ...parsedValues, type }];
    }
    localStorage.setItem("familyMember", JSON.stringify(updated));

    setCurrentIndex((prev) => Math.min(prev + 1, selectedMembers.length));
  };

  const handleFinish = async (tokenArg) => {
    const activeToken = await getActiveToken();
    const saved = localStorage.getItem("familyMember");
    const members = saved ? JSON.parse(saved) : [];
    if (members.length === 0) {
      toast.error("Data anggota keluarga kosong!");
      return;
    }

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const handleLoading = delay(1000);

    toast.promise(
      handleLoading.then(() =>
        createFamilyMember(members, tokenArg || activeToken),
      ),
      {
        pending: "Loading...",
        success: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            localStorage.removeItem("familyMember");
            setIsComplete(true);
          },
        },
        error: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            localStorage.removeItem("familyMember");
          },
        },
      },
    );
  };

  const handleStartStepper = () => {
    setCurrentIndex(1);
  };

  const {
    values,
    handleChange,
    handleBlur,
    setFieldValue,
    handleSubmit,
    getFieldProps,
    setValues,
  } = useFormik({
    initialValues: getInitialValues("ANAK"),
    onSubmit,
    enableReinitialize: false,
  });

  const getIdsForStep = () => {
    const relation = selectedMembers[currentIndex - 1];
    if (!relation) return [];
    if (relation === "IBU") {
      return [
        "educationIbu",
        "relationIbu",
        "jobTypeIdIbu",
        "residenceStatusIbu",
        "childrenCountIbu",
        "underFiveCountIbu",
        "familyIncomeLevelIbu",
      ];
    }
    if (relation === "AYAH") {
      return [
        "educationAyah",
        "relationAyah",
        "jobTypeIdAyah",
        "residenceStatusAyah",
        "childrenCountAyah",
        "underFiveCountAyah",
        "familyIncomeLevelAyah",
      ];
    }
    if (relation === "ANAK") {
      return [
        "educationAnak",
        "genderAnak",
        "relationAnak",
        "schoolYear",
        "semester",
        "schoolId",
        "classId",
      ];
    }
    return [];
  };

  const fixLabelPosition = (selectEl) => {
    const label = selectEl.parentElement.querySelector(
      `label[for="${selectEl.id}"]`,
    );
    if (label && label.nextElementSibling !== selectEl) {
      label.after(selectEl);
    }
  };

  React.useEffect(() => {
    if (currentIndex === 0) return;
    const relation = selectedMembers[currentIndex - 1];
    if (!relation) return;
    const type = getTypeByIndex(currentIndex);
    const saved = localStorage.getItem("familyMember");
    const members = saved ? JSON.parse(saved) : [];
    const existing = members.find((item) => item.type === type);
    const initial = getInitialValues(relation);
    const merged = existing
      ? { ...initial, ...existing, type }
      : { ...initial, type };
    setValues(merged);

    const ids = getIdsForStep();
    ids.forEach((id) => {
      const inst = HSSelect.getInstance(`#${id}`);
      if (inst) {
        inst.destroy();
        const el = document.getElementById(id);
        if (el) fixLabelPosition(el);
      }
    });

    setTimeout(() => {
      HSStaticMethods.autoInit();
    }, 0);
  }, [currentIndex]);

  const jobtype = async () => {
    const response = await getJobTypes();
    return response.data;
  };

  const institutions = async () => {
    const response = await api.get(import.meta.env.VITE_API_GET_INSTITUTIONS);
    return response.data?.data;
  };

  const familyMembers = async () => {
    const activeToken = await getActiveToken();
    const response = await getFamilyMember(activeToken);
    return response.data?.familyMembers;
  };

  const { data: jobData } = useSWR("jobtypes", jobtype);
  const { data: institutionData } = useSWR("institutions", institutions);
  const { data: familyMembersData } = useSWR("familyMembers", familyMembers);

  const [classData, setClassData] = useState([]);

  React.useEffect(() => {
    if (
      !isComplete &&
      currentIndex > 0 &&
      Array.isArray(familyMembersData) &&
      familyMembersData.length > 0
    ) {
      const relation = selectedMembers[currentIndex - 1];
      if (!relation) return;
      const type = getTypeByIndex(currentIndex);
      const dbData = familyMembersData.find(
        (item) => item.relation === relation,
      );

      if (dbData) {
        const saved = localStorage.getItem("familyMember");
        const members = saved ? JSON.parse(saved) : [];
        const localData = members.find((item) => item.type === type);

        const initial = getInitialValues(relation);
        Object.keys(initial).forEach((key) => {
          if (key === "type") {
            setFieldValue("type", type);
            return;
          }

          const localVal = localData?.[key];
          if (localVal !== undefined && localVal !== null && localVal !== "") {
            return;
          }

          switch (key) {
            case "fullName":
              setFieldValue("fullName", dbData.fullName ?? "");
              break;
            case "age":
              setFieldValue("age", dbData.age?.toString() ?? "");
              break;
            case "education":
              setFieldValue("education", dbData.education ?? "");
              break;
            case "relation":
              setFieldValue("relation", dbData.relation ?? "");
              break;
            case "phone":
              setFieldValue("phone", dbData.phone ?? "");
              break;
            case "jobTypeId":
              setFieldValue(
                "jobTypeId",
                dbData.job?.jobType?.id.toString() ?? "",
              );
              break;
            case "residenceStatus":
              setFieldValue(
                "residenceStatus",
                dbData.SocioEconomic?.residenceStatus ?? "",
              );
              break;
            case "address":
              setFieldValue("address", dbData.SocioEconomic?.address ?? "");
              break;
            case "childrenCount":
              setFieldValue(
                "childrenCount",
                dbData.SocioEconomic?.childrenCount ?? "",
              );
              break;
            case "underFiveCount":
              setFieldValue(
                "underFiveCount",
                dbData.SocioEconomic?.underFiveCount ?? "",
              );
              break;
            case "familyIncomeLevel":
              setFieldValue(
                "familyIncomeLevel",
                dbData.SocioEconomic?.familyIncomeLevel ?? "",
              );
              break;
            case "birthDate":
              setFieldValue(
                "birthDate",
                dbData.birthDate ? dbData.birthDate.slice(0, 10) : "",
              );
              break;
            case "gender":
              setFieldValue("gender", dbData.gender ?? "");
              break;
            case "height":
              setFieldValue("height", dbData.nutrition?.[0]?.height ?? "");
              break;
            case "weight":
              setFieldValue("weight", dbData.nutrition?.[0]?.weight ?? "");
              break;
            case "nis":
              setFieldValue("nis", dbData.student?.nis ?? "");
              break;
            case "schoolYear":
              setFieldValue("schoolYear", dbData.student?.schoolYear ?? "");
              break;
            case "semester":
              setFieldValue("semester", dbData.student?.semester ?? "");
              break;
            case "schoolId":
              setFieldValue(
                "schoolId",
                dbData.student?.institution?.id?.toString() ?? "",
              );
              break;
            case "classId":
              setFieldValue(
                "classId",
                dbData.student?.class?.id?.toString() ?? "",
              );
              break;
            default:
          }
        });

        if (relation === "AYAH") {
          const ibuData = familyMembersData.find(
            (item) => item.relation === "IBU",
          );
          if (ibuData && dbData) {
            const sameSocioEconomic =
              dbData.SocioEconomic?.id === ibuData.SocioEconomic?.id;
            setFieldValue("sameSocioEconomic", sameSocioEconomic);
          }
        }
      }
    }
  }, [currentIndex, familyMembersData, setFieldValue]);

  React.useEffect(() => {
    if (isComplete || currentIndex === 0) return;
    if (jobData) {
      HSStaticMethods.autoInit();
      window.HSDatepicker?.autoInit();

      if (dateInputRef.current) {
        const instance = window.HSDatepicker.getInstance(dateInputRef.current, true);
        if (instance && instance.element) {
          instance.element.on("change", (date) => {
            const selectedDate = date.selectedDates[0];
            setFieldValue("birthDate", selectedDate);
          });
        }
      }
    }
  }, [jobData, setFieldValue]);

  React.useEffect(() => {
    if (isComplete || currentIndex === 0) return;
    if (institutionData || classData) {
      HSStaticMethods.autoInit();
      window.HSDatepicker?.autoInit();

      if (dateInputRef.current) {
        const instance = window.HSDatepicker.getInstance(dateInputRef.current, true);
        if (instance && instance.element) {
          instance.element.on("change", (date) => {
            const selectedDate = date.selectedDates[0];
            setFieldValue("birthDate", selectedDate);
          });
        }
      }
    }
  }, [institutionData, classData, setFieldValue, isComplete]);

  React.useEffect(() => {
    const relation = selectedMembers[currentIndex - 1];
    if (relation !== "AYAH") return;

    const disableSelect = (ref, disabled) => {
      if (!ref.current) return;
      const selectInstance = HSSelect.getInstance(ref.current, true);
      if (selectInstance) {
        if (disabled) {
          selectInstance.element.toggle.setAttribute("disabled", true);
          selectInstance.element.toggle.classList.add(
            "disabled:opacity-50",
            "disabled:pointer-events-none",
          );
          selectInstance.element.wrapper.children[3].setAttribute(
            "disabled",
            true,
          );
          selectInstance.element.wrapper.children[3].classList.add(
            "opacity-50",
            "pointer-events-none",
          );
        } else {
          selectInstance.element.toggle.removeAttribute("disabled");
          selectInstance.element.toggle.classList.remove(
            "disabled:opacity-50",
            "disabled:pointer-events-none",
          );
          selectInstance.element.wrapper.children[3].removeAttribute(
            "disabled",
          );
          selectInstance.element.wrapper.children[3].classList.remove(
            "opacity-50",
            "pointer-events-none",
          );
        }
      }
    };

    setTimeout(() => {
      Object.values(socioRefs).forEach((ref) =>
        disableSelect(ref, values.sameSocioEconomic),
      );
      HSStaticMethods.autoInit();
    }, 100);
  }, [values.sameSocioEconomic, currentIndex]);

  React.useEffect(() => {
    const relation = selectedMembers[currentIndex - 1];
    if (relation !== "ANAK") {
      setClassData([]);
      return;
    }

    const schoolId = values.schoolId ? +values.schoolId : 0;

    const fetchClasses = async () => {
      try {
        const { data } = await getAllClass(schoolId);
        setClassData(data);
      } catch (err) {
        setClassData([]);
      }
    };

    if (schoolId !== 0) {
      fetchClasses();
    } else {
      setClassData([]);
    }
  }, [currentIndex, values.schoolId]);

  React.useEffect(() => {
    const relation = selectedMembers[currentIndex - 1];
    if (relation !== "ANAK") return;
    if (classData.length === 0) return;

    const id = "classId";
    const instance = HSSelect.getInstance(`#${id}`);
    if (instance) {
      instance.destroy();
      const el = document.getElementById(id);
      if (el) {
        const label = el.parentElement.querySelector(`label[for="${id}"]`);
        if (label) label.after(el);
      }
    }

    setTimeout(() => {
      HSStaticMethods.autoInit();
    }, 0);
  }, [classData, currentIndex]);

  const handleSameSocioEconomic = (e) => {
    const checked = e.target.checked;
    const saved = localStorage.getItem("familyMember");
    const members = saved ? JSON.parse(saved) : [];
    const data = members.find((item) => item.type === "ibu");
    if (checked && data) {
      setFieldValue("residenceStatus", data.residenceStatus);
      setFieldValue("address", data.address);
      setFieldValue("childrenCount", data.childrenCount);
      setFieldValue("underFiveCount", data.underFiveCount);
      setFieldValue("familyIncomeLevel", data.familyIncomeLevel);
      setFieldValue("sameSocioEconomic", true);
    } else {
      setFieldValue("residenceStatus", "");
      setFieldValue("address", "");
      setFieldValue("childrenCount", "");
      setFieldValue("underFiveCount", "");
      setFieldValue("familyIncomeLevel", "");
      setFieldValue("sameSocioEconomic", false);
    }

    const ids = getIdsForStep();
    setTimeout(() => {
      ids.forEach((id) => {
        const inst = HSSelect.getInstance(`#${id}`);
        if (inst) {
          inst.destroy();
          const el = document.getElementById(id);
          if (el) fixLabelPosition(el);
        }
      });
      HSStaticMethods.autoInit();
    }, 0);
  };

  React.useEffect(() => {
    if (Array.isArray(familyMembersData) && familyMembersData.length > 0) {
      const hasParent = familyMembersData.some(
        (item) =>
          (item.relation === "IBU" || item.relation === "AYAH") &&
          item.isCompleted === true,
      );
      const hasAnak = familyMembersData.some(
        (item) => item.relation === "ANAK" && item.isCompleted === true,
      );
      const allCompleted = familyMembersData.every(
        (item) => item.isCompleted === true,
      );

      setIsComplete(hasParent && hasAnak && allCompleted);
    } else {
      setIsComplete(false);
    }
  }, [familyMembersData]);

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

  React.useEffect(() => {
    if (
      Array.isArray(familyMembersData) &&
      familyMembersData.length > 0 &&
      currentIndex === 0
    ) {
      const relations = [];
      if (familyMembersData.some((m) => m.relation === "IBU"))
        relations.push("IBU");
      if (familyMembersData.some((m) => m.relation === "AYAH"))
        relations.push("AYAH");
      if (familyMembersData.some((m) => m.relation === "ANAK"))
        relations.push("ANAK");
      relations.sort(
        (a, b) =>
          ({ IBU: 0, AYAH: 1, ANAK: 2 })[a] - { IBU: 0, AYAH: 1, ANAK: 2 }[b],
      );
      setSelectedMembers(relations);
      setCurrentIndex(1);
    }
  }, [familyMembersData]);

  // ====== FORM RENDERERS ======

  const renderIbuForm = () => (
    <form onSubmit={handleSubmit}>
      {!jobData ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-2 gap-x-5">
          <div className="flex flex-col space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h1 className="font-semibold tracking-wide text-lg mb-4">
                Biodata
              </h1>
              <div className="flex flex-col space-y-4">
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
                    className="py-2.5 sm:py-3 px-4 block w-full border border-gray-200 rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="contoh saja"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.fullName ?? ""}
                    required
                  />
                </div>
                <div className="max-w-lg w-full">
                  <label
                    htmlFor="age"
                    className="block text-sm font-medium mb-2"
                  >
                    Umur
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    className="py-2.5 sm:py-3 px-4 block w-full border border-gray-200 rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="35"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.age ?? ""}
                    required
                  />
                </div>
                <div className="max-w-lg w-full">
                  <label
                    htmlFor="educationIbu"
                    className="block text-sm font-medium mb-2"
                  >
                    Pendidikan
                  </label>
                  <select
                    required
                    name="education"
                    id="educationIbu"
                    onChange={(e) => setFieldValue("education", e.target.value)}
                    value={values.education ?? ""}
                    data-hs-select='{"hasSearch": true,"searchPlaceholder": "Cari...","searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 py-1.5 sm:py-2 px-3","searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0","placeholder": "Pilh Pendidikan...","toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>","toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800","dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300","optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50","optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>","extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"}'
                    className="hidden"
                  >
                    <option value="">Pilih Pendidikan</option>
                    <option value="SD">SD</option>
                    <option value="SMP">SMP</option>
                    <option value="SMA">SMA</option>
                    <option value="D1">D1</option>
                    <option value="D2">D2</option>
                    <option value="D3">D3</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                  </select>
                </div>
                <div className="max-w-lg w-full">
                  <label
                    htmlFor="relationIbu"
                    className="block text-sm font-medium mb-2"
                  >
                    Hubungan
                  </label>
                  <select
                    required
                    id="relationIbu"
                    name="relation"
                    onChange={(e) => setFieldValue("relation", e.target.value)}
                    value={values.relation ?? ""}
                    data-hs-select='{"placeholder": "Pilih Hubungan...","toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>","toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800","dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300","optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50","optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>","extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"}'
                    className="hidden"
                  >
                    <option value="">Pilih Hubungan</option>
                    <option value="IBU">Ibu</option>
                    <option value="AYAH">Ayah</option>
                    <option value="ANAK">Anak</option>
                    <option value="LAINNYA">Lainnya</option>
                  </select>
                </div>
                <div className="max-w-lg w-full">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium mb-2"
                  >
                    Nomor Telepon
                  </label>
                  <input
                    required
                    type="text"
                    id="phone"
                    name="phone"
                    className="py-2.5 sm:py-3 px-4 block w-full border border-gray-200 rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="087898766456"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.phone ?? ""}
                  />
                </div>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 h-max">
              <h1 className="font-semibold tracking-wide text-lg mb-4">
                Data Pekerjaan
              </h1>
              <div className="flex flex-col space-y-4">
                <div className="max-w-lg w-full">
                  <label
                    htmlFor="jobTypeIdIbu"
                    className="block text-sm font-medium mb-2"
                  >
                    Pekerjaan
                  </label>
                  <select
                    required
                    name="jobTypeId"
                    id="jobTypeIdIbu"
                    onChange={(e) => setFieldValue("jobTypeId", e.target.value)}
                    value={values.jobTypeId ?? ""}
                    data-hs-select='{"hasSearch": true,"searchPlaceholder": "Cari...","searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 py-1.5 sm:py-2 px-3","searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0","placeholder": "Pilh Pekerjaan...","toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>","toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800","dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300","optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50","optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>","extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"}'
                    className="hidden"
                  >
                    <option value="">Pilih Pekerjaan</option>
                    {jobData &&
                      jobData.length > 0 &&
                      jobData.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h1 className="font-semibold tracking-wide text-lg mb-4">
                Data Sosial Ekonomi
              </h1>
              <div className="flex flex-col space-y-4">
                <div className="max-w-lg w-full">
                  <label
                    htmlFor="residenceStatusIbu"
                    className="block text-sm font-medium mb-2"
                  >
                    Status Tempat Tinggal
                  </label>
                  <select
                    required
                    id="residenceStatusIbu"
                    name="residenceStatus"
                    onChange={(e) =>
                      setFieldValue("residenceStatus", e.target.value)
                    }
                    value={values.residenceStatus ?? ""}
                    data-hs-select='{"placeholder": "Pilih Status Tempat Tinggal...","toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>","toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800","dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300","optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50","optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>","extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"}'
                    className="hidden"
                  >
                    <option value="">Pilih Status Tempat Tinggal</option>
                    <option value="MILIK_SENDIRI">Milik Sendiri</option>
                    <option value="MENYEWA">Menyewa</option>
                    <option value="BERSAMA_ORANG_TUA">Bersama Orang Tua</option>
                  </select>
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
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="py-2 px-3 sm:py-3 sm:px-4 block w-full border border-obito-grey rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                    rows="2"
                    placeholder="Jl. Telekomunikasi No. 1, Bandung"
                    required
                    value={values.address ?? ""}
                  />
                </div>
                <div className="max-w-lg w-full">
                  <label
                    htmlFor="childrenCountIbu"
                    className="block text-sm font-medium mb-2"
                  >
                    Jumlah Anak
                  </label>
                  <select
                    required
                    id="childrenCountIbu"
                    name="childrenCount"
                    onChange={(e) =>
                      setFieldValue("childrenCount", e.target.value)
                    }
                    value={values.childrenCount ?? ""}
                    data-hs-select='{"placeholder": "Pilih Jumlah Anak...","toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>","toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800","dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300","optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50","optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>","extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"}'
                    className="hidden"
                  >
                    <option value="">Pilih Jumlah Anak</option>
                    <option value="SATU">1</option>
                    <option value="DUA_SAMPAI_TIGA">2-3</option>
                    <option value="EMPAT_ATAU_LEBIH">≥4</option>
                  </select>
                </div>
                <div className="max-w-lg w-full">
                  <label
                    htmlFor="underFiveCountIbu"
                    className="block text-sm font-medium mb-2"
                  >
                    Jumlah Balita
                  </label>
                  <select
                    required
                    id="underFiveCountIbu"
                    name="underFiveCount"
                    onChange={(e) =>
                      setFieldValue("underFiveCount", e.target.value)
                    }
                    value={values.underFiveCount ?? ""}
                    data-hs-select='{"placeholder": "Pilih Jumlah Balita...","toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>","toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800","dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300","optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50","optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>","extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"}'
                    className="hidden"
                  >
                    <option value="">Pilih Jumlah Balita</option>
                    <option value="TIDAK_ADA">Tidak Ada</option>
                    <option value="SATU">1</option>
                    <option value="DUA_SAMPAI_TIGA">2-3</option>
                    <option value="EMPAT_ATAU_LEBIH">≥4</option>
                  </select>
                </div>
                <div className="max-w-lg w-full">
                  <label
                    htmlFor="familyIncomeLevelIbu"
                    className="block text-sm font-medium mb-2"
                  >
                    Tingkat Pendapatan Keluarga
                  </label>
                  <select
                    required
                    id="familyIncomeLevelIbu"
                    name="familyIncomeLevel"
                    onChange={(e) =>
                      setFieldValue("familyIncomeLevel", e.target.value)
                    }
                    value={values.familyIncomeLevel ?? ""}
                    data-hs-select='{"placeholder": "Pilih Pendapatan...","toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>","toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800","dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300","optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50","optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>","extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"}'
                    className="hidden"
                  >
                    <option value="">Pilih Pendapatan</option>
                    <option value="KURANG_DARI_LIMA_JUTA">
                      &lt; 5 Juta
                    </option>
                    <option value="LIMA_JUTA_SAMPAI_SEPULUH_JUTA">5 - 10 Juta</option>
                    <option value="LEBIH_DARI_SEPULUH_JUTA">&gt; 10 Juta</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );

  const renderAyahForm = () => (
    <form onSubmit={handleSubmit}>
      {!jobData ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-2 gap-x-5">
          <div className="flex flex-col space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h1 className="font-semibold tracking-wide text-lg mb-4">
                Biodata
              </h1>
              <div className="flex flex-col space-y-4">
                <div className="max-w-lg w-full">
                  <label
                    htmlFor="fullNameAyah"
                    className="block text-sm font-medium mb-2"
                  >
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="fullNameAyah"
                    name="fullName"
                    className="py-2.5 sm:py-3 px-4 block w-full border border-gray-200 rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="contoh saja"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    value={values.fullName ?? ""}
                  />
                </div>
                <div className="max-w-lg w-full">
                  <label
                    htmlFor="ageAyah"
                    className="block text-sm font-medium mb-2"
                  >
                    Umur
                  </label>
                  <input
                    type="number"
                    id="ageAyah"
                    name="age"
                    className="py-2.5 sm:py-3 px-4 block w-full border border-gray-200 rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="40"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.age ?? ""}
                    required
                  />
                </div>
                <div className="max-w-lg w-full">
                  <label
                    htmlFor="educationAyah"
                    className="block text-sm font-medium mb-2"
                  >
                    Pendidikan
                  </label>
                  <select
                    required
                    name="education"
                    id="educationAyah"
                    onChange={(e) => setFieldValue("education", e.target.value)}
                    value={values.education ?? ""}
                    data-hs-select='{"hasSearch": true,"searchPlaceholder": "Cari...","searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 py-1.5 sm:py-2 px-3","searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0","placeholder": "Pilh Pendidikan...","toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>","toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800","dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300","optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50","optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>","extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"}'
                    className="hidden"
                  >
                    <option value="">Pilih Pendidikan</option>
                    <option value="SD">SD</option>
                    <option value="SMP">SMP</option>
                    <option value="SMA">SMA</option>
                    <option value="D1">D1</option>
                    <option value="D2">D2</option>
                    <option value="D3">D3</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                  </select>
                </div>
                <div className="max-w-lg w-full">
                  <label
                    htmlFor="relationAyah"
                    className="block text-sm font-medium mb-2"
                  >
                    Hubungan
                  </label>
                  <select
                    required
                    id="relationAyah"
                    name="relation"
                    onChange={(e) => setFieldValue("relation", e.target.value)}
                    value={values.relation ?? ""}
                    data-hs-select='{"placeholder": "Pilih Hubungan...","toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>","toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800","dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300","optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50","optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>","extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"}'
                    className="hidden"
                  >
                    <option value="">Pilih Hubungan</option>
                    <option value="IBU">Ibu</option>
                    <option value="AYAH">Ayah</option>
                    <option value="ANAK">Anak</option>
                    <option value="LAINNYA">Lainnya</option>
                  </select>
                </div>
                <div className="max-w-lg w-full">
                  <label
                    htmlFor="phoneAyah"
                    className="block text-sm font-medium mb-2"
                  >
                    Nomor Telepon
                  </label>
                  <input
                    required
                    type="text"
                    id="phoneAyah"
                    name="phone"
                    className="py-2.5 sm:py-3 px-4 block w-full border border-gray-200 rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="087898766456"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.phone ?? ""}
                  />
                </div>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 h-max">
              <h1 className="font-semibold tracking-wide text-lg mb-4">
                Data Pekerjaan
              </h1>
              <div className="flex flex-col space-y-4">
                <div className="max-w-lg w-full">
                  <label
                    htmlFor="jobTypeIdAyah"
                    className="block text-sm font-medium mb-2"
                  >
                    Pekerjaan
                  </label>
                  <select
                    required
                    name="jobTypeId"
                    id="jobTypeIdAyah"
                    onChange={(e) => setFieldValue("jobTypeId", e.target.value)}
                    value={values.jobTypeId ?? ""}
                    data-hs-select='{"hasSearch": true,"searchPlaceholder": "Cari...","searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 py-1.5 sm:py-2 px-3","searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0","placeholder": "Pilh Pekerjaan...","toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>","toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800","dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300","optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50","optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>","extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"}'
                    className="hidden"
                  >
                    <option value="">Pilih Pekerjaan</option>
                    {jobData &&
                      jobData.length > 0 &&
                      jobData.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h1 className="font-semibold tracking-wide text-lg mb-4">
                Data Sosial Ekonomi
              </h1>
              <div className="flex flex-col space-y-4">
                <div className="max-w-lg w-full">
                  <label
                    htmlFor="residenceStatusAyah"
                    className="block text-sm font-medium mb-2"
                  >
                    Status Tempat Tinggal
                  </label>
                  <select
                    ref={socioRefs.residenceStatus}
                    required
                    id="residenceStatusAyah"
                    name="residenceStatus"
                    onChange={(e) =>
                      setFieldValue("residenceStatus", e.target.value)
                    }
                    value={values.residenceStatus ?? ""}
                    disabled={values.sameSocioEconomic}
                    data-hs-select='{"placeholder": "Pilih Status Tempat Tinggal...","toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>","toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800","dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300","optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50","optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>","extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"}'
                    className="hidden"
                  >
                    <option value="">Pilih Status Tempat Tinggal</option>
                    <option value="MILIK_SENDIRI">Milik Sendiri</option>
                    <option value="MENYEWA">Menyewa</option>
                    <option value="BERSAMA_ORANG_TUA">Bersama Orang Tua</option>
                  </select>
                </div>
                <div className="max-w-lg w-full">
                  <label
                    htmlFor="addressAyah"
                    className="block text-sm font-medium mb-2"
                  >
                    Alamat
                  </label>
                  <textarea
                    id="addressAyah"
                    name="address"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={values.sameSocioEconomic}
                    className="py-2 px-3 sm:py-3 sm:px-4 block w-full border border-obito-grey rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                    rows="2"
                    placeholder="Jl. Telekomunikasi No. 1, Bandung"
                    required
                    value={values.address ?? ""}
                  />
                </div>
                <div className="max-w-lg w-full">
                  <label
                    htmlFor="childrenCountAyah"
                    className="block text-sm font-medium mb-2"
                  >
                    Jumlah Anak
                  </label>
                  <select
                    ref={socioRefs.childrenCount}
                    required
                    id="childrenCountAyah"
                    name="childrenCount"
                    onChange={(e) =>
                      setFieldValue("childrenCount", e.target.value)
                    }
                    value={values.childrenCount ?? ""}
                    disabled={values.sameSocioEconomic}
                    data-hs-select='{"placeholder": "Pilih Jumlah Anak...","toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>","toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800","dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300","optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50","optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>","extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"}'
                    className="hidden"
                  >
                    <option value="">Pilih Jumlah Anak</option>
                    <option value="SATU">1</option>
                    <option value="DUA_SAMPAI_TIGA">2-3</option>
                    <option value="EMPAT_ATAU_LEBIH">≥4</option>
                  </select>
                </div>
                <div className="max-w-lg w-full">
                  <label
                    htmlFor="underFiveCountAyah"
                    className="block text-sm font-medium mb-2"
                  >
                    Jumlah Balita
                  </label>
                  <select
                    ref={socioRefs.underFiveCount}
                    required
                    id="underFiveCountAyah"
                    name="underFiveCount"
                    onChange={(e) =>
                      setFieldValue("underFiveCount", e.target.value)
                    }
                    value={values.underFiveCount ?? ""}
                    disabled={values.sameSocioEconomic}
                    data-hs-select='{"placeholder": "Pilih Jumlah Balita...","toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>","toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800","dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300","optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50","optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>","extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"}'
                    className="hidden"
                  >
                    <option value="">Pilih Jumlah Balita</option>
                    <option value="TIDAK_ADA">Tidak Ada</option>
                    <option value="SATU">1</option>
                    <option value="DUA_SAMPAI_TIGA">2-3</option>
                    <option value="EMPAT_ATAU_LEBIH">≥4</option>
                  </select>
                </div>
                <div className="max-w-lg w-full">
                  <label
                    htmlFor="familyIncomeLevelAyah"
                    className="block text-sm font-medium mb-2"
                  >
                    Tingkat Pendapatan Keluarga
                  </label>
                  <select
                    ref={socioRefs.familyIncomeLevel}
                    required
                    id="familyIncomeLevelAyah"
                    name="familyIncomeLevel"
                    onChange={(e) =>
                      setFieldValue("familyIncomeLevel", e.target.value)
                    }
                    value={values.familyIncomeLevel ?? ""}
                    disabled={values.sameSocioEconomic}
                    data-hs-select='{"placeholder": "Pilih Pendapatan...","toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>","toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800","dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300","optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50","optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>","extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"}'
                    className="hidden"
                  >
                    <option value="">Pilih Pendapatan</option>
                    <option value="KURANG_DARI_LIMA_JUTA">
                      &lt; 5 Juta
                    </option>
                    <option value="LIMA_JUTA_SAMPAI_SEPULUH_JUTA">5 - 10 Juta</option>
                    <option value="LEBIH_DARI_SEPULUH_JUTA">&gt; 10 Juta</option>
                  </select>
                </div>
                <div className="flex">
                  <input
                    type="checkbox"
                    className="shrink-0 mt-0.5 border-gray-200 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    id="hs-default-checkbox"
                    onChange={handleSameSocioEconomic}
                    value={values.sameSocioEconomic ?? ""}
                    checked={!!values.sameSocioEconomic}
                  />
                  <label
                    htmlFor="hs-default-checkbox"
                    className="text-sm text-gray-500 ms-3"
                  >
                    Data sosial ekonomi sama dengan Ibu
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );

  const renderAnakForm = () => (
    <form onSubmit={handleSubmit}>
      {!institutionData ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-2 gap-x-5">
          <div className="flex flex-col space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h1 className="font-semibold tracking-wide text-lg mb-4">
                Biodata
              </h1>
              <div className="flex flex-col space-y-4">
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
                    value={values.fullName ?? ""}
                    className="py-2.5 sm:py-3 px-4 block w-full border border-gray-200 rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="contoh saja"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                </div>
                <div className="max-w-lg w-full">
                  <label
                    htmlFor="birthDateAnak"
                    className="block text-sm font-medium mb-2"
                  >
                    Tanggal Lahir
                  </label>
                  <input
                    ref={dateInputRef}
                    required
                    id="birthDateAnak"
                    name="birthDate"
                    value={values.birthDate ?? ""}
                    readOnly
                    className="hs-datepicker py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none place"
                    type="text"
                    placeholder="YYYY/MM/DD"
                    data-hs-datepicker='{"selectedTheme": "light","dateMin": "1950-01-01","dateMax": "2050-12-31","locale": "id-ID","firstWeekday": 0,"inputModeOptions": {"dateSeparator": "/"},"templates": {"arrowPrev": "<button data-vc-arrow=\"prev\"><svg class=\"shrink-0 size-4\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m15 18-6-6 6-6\"></path></svg></button>","arrowNext": "<button data-vc-arrow=\"next\"><svg class=\"shrink-0 size-4\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m9 18 6-6-6-6\"></path></svg></button>"}}'
                  />
                </div>
                <div className="max-w-lg w-full">
                  <label
                    htmlFor="educationAnak"
                    className="block text-sm font-medium mb-2"
                  >
                    Pendidikan
                  </label>
                  <select
                    required
                    name="education"
                    id="educationAnak"
                    onChange={(e) => setFieldValue("education", e.target.value)}
                    value={values.education ?? ""}
                    data-hs-select='{"hasSearch": true,"searchPlaceholder": "Cari...","searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 py-1.5 sm:py-2 px-3","searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0","placeholder": "Pilh Pendidikan...","toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>","toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800","dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300","optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50","optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>","extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"}'
                    className="hidden"
                  >
                    <option value="">Pilih Pendidikan</option>
                    <option value="SD">SD</option>
                    <option value="SMP">SMP</option>
                    <option value="SMA">SMA</option>
                    <option value="D1">D1</option>
                    <option value="D2">D2</option>
                    <option value="D3">D3</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                  </select>
                </div>
                <div className="max-w-lg w-full">
                  <label
                    htmlFor="genderAnak"
                    className="block text-sm font-medium mb-2"
                  >
                    Jenis Kelamin
                  </label>
                  <select
                    required
                    id="genderAnak"
                    name="gender"
                    onChange={(e) => setFieldValue("gender", e.target.value)}
                    value={values.gender ?? ""}
                    data-hs-select='{"placeholder": "Pilih Jenis Kelamin...","toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>","toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800","dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300","optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50","optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>","extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"}'
                    className="hidden"
                  >
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="L">Laki-Laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div className="max-w-lg w-full">
                  <label
                    htmlFor="relationAnak"
                    className="block text-sm font-medium mb-2"
                  >
                    Hubungan
                  </label>
                  <select
                    required
                    id="relationAnak"
                    name="relation"
                    onChange={(e) => setFieldValue("relation", e.target.value)}
                    value={values.relation ?? ""}
                    data-hs-select='{"placeholder": "Pilih Hubungan...","toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>","toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800","dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300","optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50","optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>","extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"}'
                    className="hidden"
                  >
                    <option value="">Pilih Hubungan</option>
                    <option value="IBU">Ibu</option>
                    <option value="AYAH">Ayah</option>
                    <option value="ANAK">Anak</option>
                    <option value="LAINNYA">Lainnya</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 h-max">
              <h1 className="font-semibold tracking-wide text-lg mb-4">
                Data Pendidikan
              </h1>
              <div className="flex flex-col space-y-4">
                <div className="max-w-lg w-full">
                  <label
                    htmlFor="nis"
                    className="block text-sm font-medium mb-2"
                  >
                    Nomor Induk Siswa
                  </label>
                  <input
                    type="text"
                    id="nis"
                    name="nis"
                    className="py-2.5 sm:py-3 px-4 block w-full border border-gray-200 rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="0876756"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.nis ?? ""}
                    required
                  />
                </div>
                <div className="max-w-lg w-full">
                  <label
                    htmlFor="schoolYear"
                    className="block text-sm font-medium mb-2"
                  >
                    Angkatan
                  </label>
                  <select
                    name="schoolYear"
                    id="schoolYear"
                    onChange={(e) =>
                      setFieldValue("schoolYear", e.target.value)
                    }
                    required
                    value={values.schoolYear ?? ""}
                    data-hs-select='{"hasSearch": true,"searchPlaceholder": "Cari...","searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 py-1.5 sm:py-2 px-3","searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0","placeholder": "Pilh Angkatan...","toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>","toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800","dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300","optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50","optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>","extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"}'
                    className="hidden"
                  >
                    <option value="">Pilih Angkatan</option>
                    {generateSchoolYears().map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="max-w-lg w-full">
                  <label
                    htmlFor="semester"
                    className="block text-sm font-medium mb-2"
                  >
                    Semester
                  </label>
                  <select
                    name="semester"
                    id="semester"
                    onChange={(e) => setFieldValue("semester", e.target.value)}
                    value={values.semester ?? ""}
                    required
                    data-hs-select='{"hasSearch": true,"searchPlaceholder": "Cari...","searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 py-1.5 sm:py-2 px-3","searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0","placeholder": "Pilh Semester...","toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>","toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800","dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300","optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50","optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>","extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"}'
                    className="hidden"
                  >
                    <option value="">Pilih Semester</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </select>
                </div>
                <div className="max-w-lg w-full">
                  <label
                    htmlFor="schoolId"
                    className="block text-sm font-medium mb-2"
                  >
                    Sekolah
                  </label>
                  <select
                    name="schoolId"
                    id="schoolId"
                    onChange={(e) => setFieldValue("schoolId", e.target.value)}
                    value={values.schoolId ?? ""}
                    required
                    data-hs-select='{"hasSearch": true,"searchPlaceholder": "Cari...","searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 py-1.5 sm:py-2 px-3","searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0","placeholder": "Pilh Sekolah...","toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>","toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800","dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300","optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50","optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>","extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"}'
                    className="hidden"
                  >
                    <option value="">Pilih Sekolah</option>
                    {institutionData &&
                      institutionData?.institutions
                        ?.filter(
                          (item) => item.institution_type?.name === "School",
                        )
                        .map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                  </select>
                </div>
                <div className="max-w-lg w-full" id="test">
                  <label
                    htmlFor="classId"
                    className="block text-sm font-medium mb-2"
                  >
                    Kelas
                  </label>
                  <select
                    name="classId"
                    id="classId"
                    onChange={(e) => setFieldValue("classId", e.target.value)}
                    value={values.classId ?? ""}
                    required
                    data-hs-select='{"hasSearch": true,"searchPlaceholder": "Cari...","searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 py-1.5 sm:py-2 px-3","searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0","placeholder": "Pilh Kelas...","toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>","toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800","dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300","optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50","optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>","extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"}'
                    className="hidden"
                  >
                    <option value="">Pilih Kelas</option>
                    {classData.length > 0 &&
                      classData.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 h-max">
            <h1 className="font-semibold tracking-wide text-lg mb-4">
              Tinggi dan Berat Badan
            </h1>
            <div className="flex flex-col space-y-4">
              <div className="max-w-lg w-full">
                <label
                  htmlFor="height"
                  className="block text-sm font-medium mb-2"
                >
                  Tinggi Badan (cm)
                </label>
                <input
                  type="text"
                  id="height"
                  className="py-2.5 sm:py-3 px-4 block w-full border border-gray-200 rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder="180"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.height ?? ""}
                  required
                />
              </div>
              <div className="max-w-lg w-full">
                <label
                  htmlFor="weight"
                  className="block text-sm font-medium mb-2"
                >
                  Berat Badan (kg)
                </label>
                <input
                  type="text"
                  id="weight"
                  className="py-2.5 sm:py-3 px-4 block w-full border border-gray-200 rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder="80"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.weight ?? ""}
                  required
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );

  const canStart =
    selectedMembers.some((r) => r === "IBU" || r === "AYAH") &&
    selectedMembers.includes("ANAK");

  const hasExistingData =
    Array.isArray(familyMembersData) && familyMembersData.length > 0;

  return (
    <div>
      {isComplete ? (
        <div>
          <TableFamilyMember
            institutionData={institutionData}
            classData={classData}
          />
        </div>
      ) : !hasExistingData && currentIndex === 0 ? (
        /* ===== SELECTION SCREEN ===== */
        <div className="max-w-lg mx-auto mt-10 p-6 border border-gray-200 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Pilih Anggota Keluarga</h2>
          <ul className="max-w-full flex flex-col">
            <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-medium bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg">
              <div className="relative flex items-start w-full">
                <div className="flex items-center h-5">
                  <input
                    id="checkbox-ibu"
                    name="checkbox-ibu"
                    type="checkbox"
                    className="shrink-0 size-4 bg-transparent border-gray-300 rounded-sm shadow-2xs text-blue-600 focus:ring-0 focus:ring-offset-0 checked:bg-blue-600 checked:border-blue-600 disabled:opacity-50 disabled:pointer-events-none"
                    checked={selectedMembers.includes("IBU")}
                    onChange={() => handleMemberToggle("IBU")}
                  />
                </div>
                <label
                  htmlFor="checkbox-ibu"
                  className="block ms-3 w-full text-sm text-gray-600"
                >
                  Ibu
                </label>
              </div>
            </li>

            <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-medium bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg">
              <div className="relative flex items-start w-full">
                <div className="flex items-center h-5">
                  <input
                    id="checkbox-ayah"
                    name="checkbox-ayah"
                    type="checkbox"
                    className="shrink-0 size-4 bg-transparent border-gray-300 rounded-sm shadow-2xs text-blue-600 focus:ring-0 focus:ring-offset-0 checked:bg-blue-600 checked:border-blue-600 disabled:opacity-50 disabled:pointer-events-none"
                    checked={selectedMembers.includes("AYAH")}
                    onChange={() => handleMemberToggle("AYAH")}
                  />
                </div>
                <label
                  htmlFor="checkbox-ayah"
                  className="block ms-3 w-full text-sm text-gray-600"
                >
                  Ayah
                </label>
              </div>
            </li>

            <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-medium bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg">
              <div className="relative flex items-start w-full">
                <div className="flex items-center h-5">
                  <input
                    id="checkbox-anak"
                    name="checkbox-anak"
                    type="checkbox"
                    className="shrink-0 size-4 bg-transparent border-gray-300 rounded-sm shadow-2xs text-blue-600 focus:ring-0 focus:ring-offset-0 checked:bg-blue-600 checked:border-blue-600 disabled:opacity-50 disabled:pointer-events-none"
                    checked={true}
                    disabled
                  />
                </div>
                <label
                  htmlFor="checkbox-anak"
                  className="block ms-3 w-full text-sm text-gray-600"
                >
                  Anak
                </label>
              </div>
            </li>
          </ul>
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className={`py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent text-white focus:outline-hidden ${
                canStart
                  ? "bg-blue-600 hover:bg-blue-700 focus:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!canStart}
              onClick={handleStartStepper}
            >
              Lanjut
            </button>
          </div>
        </div>
      ) : (
        /* ===== DYNAMIC STEPPER ===== */
        <div data-hs-stepper="">
          <ul className="relative flex flex-row w-3/4 mx-auto gap-x-2">
            {selectedMembers.map((relation, idx) => {
              const Icon = memberIcons[relation];
              const stepIndex = idx + 1;
              return (
                <li
                  key={relation}
                  className={`flex items-center gap-x-2 group ${idx === selectedMembers.length - 1 ? "shrink basis-0" : "shrink basis-0 flex-1"}`}
                  data-hs-stepper-nav-item={`{"index": ${stepIndex}}`}
                >
                  <span className="min-w-7 min-h-7 group inline-flex items-center text-xs align-middle">
                    <span className="w-max h-10 hs-stepper-success:w-0 hs-stepper-success:h-0 hs-stepper-success:size-7 p-3 flex justify-center items-center shrink-0 bg-gray-100 font-medium text-gray-800 rounded-full group-focus:bg-gray-200 hs-stepper-active:bg-blue-600 hs-stepper-active:text-white hs-stepper-success:bg-blue-600 hs-stepper-success:text-white hs-stepper-completed:bg-teal-500 hs-stepper-completed:group-focus:bg-teal-600">
                      <div className="flex items-center justify-center gap-x-2">
                        <Icon className="hs-stepper-success:hidden hs-stepper-completed:hidden" />
                        <span className="hs-stepper-success:hidden hs-stepper-completed:hidden">
                          {memberLabels[relation]}
                        </span>
                      </div>
                      <svg
                        className="hidden shrink-0 size-3 hs-stepper-success:block"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                  </span>
                  {idx < selectedMembers.length - 1 && (
                    <div className="w-full h-px flex-1 bg-gray-200 group-last:hidden hs-stepper-success:bg-blue-600 hs-stepper-completed:bg-teal-600"></div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-5 sm:mt-8">
            {selectedMembers.map((relation, idx) => {
              const stepIndex = idx + 1;
              return (
                <div
                  key={relation}
                  data-hs-stepper-content-item={`{"index": ${stepIndex}}`}
                  style={{
                    display: stepIndex === currentIndex ? "block" : "none",
                  }}
                >
                  {relation === "IBU" && renderIbuForm()}
                  {relation === "AYAH" && renderAyahForm()}
                  {relation === "ANAK" && renderAnakForm()}
                </div>
              );
            })}

            <div className="mt-5 flex justify-between items-center gap-x-2">
              <button
                type="button"
                className="py-2 px-3 inline-flex items-center gap-x-1 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                data-hs-stepper-back-btn=""
                onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 1))}
              >
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
                  <path d="m15 18-6-6 6-6"></path>
                </svg>
                Back
              </button>
              {currentIndex < selectedMembers.length && (
                <button
                  type="button"
                  className="py-2 px-3 inline-flex items-center gap-x-1 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                  data-hs-stepper-next-btn=""
                  onClick={handleSubmit}
                >
                  Next
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
                    <path d="m9 18 6-6-6-6"></path>
                  </svg>
                </button>
              )}
              {currentIndex === selectedMembers.length && (
                <button
                  type="button"
                  className="py-2 px-3 inline-flex items-center gap-x-1 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                  onClick={async () => {
                    const response = await token();
                    const freshToken = response?.data?.accessToken;
                    setAccessToken(freshToken);
                    await onSubmit(values);
                    await handleFinish(freshToken);
                  }}
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Family;
