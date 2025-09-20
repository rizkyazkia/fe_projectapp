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

const Family = () => {
  const { accessToken, setAccessToken, user, setUser } = useAuth();

  const dateInputRef = React.useRef(null);
  const dateInputRef2 = React.useRef(null);
  const dateInputRef3 = React.useRef(null);
  const statusSelectRef = React.useRef(null);
  const [currentIndex, setCurrentIndex] = React.useState(1);
  const [isComplete, setIsComplete] = React.useState(false);

  const getTypeByIndex = (index) => {
    if (index === 1) return "ibu";
    if (index === 2) return "ayah";
    return "anak";
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
      birthWeight: values.birthWeight
        ? parseFloat(values.birthWeight)
        : undefined,
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

    setCurrentIndex((prev) => Math.min(prev + 1, 3));
  };

  const handleFinish = async (tokenArg) => {
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
        createFamilyMember(members, tokenArg || accessToken)
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
      }
    );
  };

  const getInitialValues = (index) => {
    if (index === 1) {
      return {
        type: getTypeByIndex(currentIndex),
        fullName: "",
        birthDate: "",
        education: "",
        gender: "",
        relation: "",
        phone: "",
        jobTypeId: "",
        income: "",
        weight: "",
        height: "",
        status: "",
        address: "",
      };
    }
    if (index === 2) {
      return {
        type: getTypeByIndex(currentIndex),
        fullName: "",
        birthDate: "",
        education: "",
        gender: "",
        relation: "",
        phone: "",
        jobTypeId: "",
        income: "",
        weight: "",
        height: "",
        status: "",
        address: "",
        sameHome: false,
      };
    }
    if (index === 3) {
      return {
        type: getTypeByIndex(currentIndex),
        fullName: "",
        birthDate: "",
        education: "",
        gender: "",
        relation: "",
        nis: "",
        schoolYear: "",
        semester: "",
        schoolId: 0,
        weight: "",
        height: "",
        birthWeight: "",
        classId: 0,
      };
    }
  };

  const {
    values,
    handleChange,
    handleBlur,
    setFieldValue,
    handleSubmit,
    getFieldProps,
  } = useFormik({
    initialValues: getInitialValues(currentIndex),
    onSubmit,
    enableReinitialize: true,
  });

  React.useEffect(() => {
    const type = getTypeByIndex(currentIndex);
    const saved = localStorage.getItem("familyMember");
    const members = saved ? JSON.parse(saved) : [];
    const existing = members.find((item) => item.type === type);

    if (existing) {
      Object.keys(existing).forEach((key) => {
        setFieldValue(key, existing[key]);
      });
    } else {
      const initial = getInitialValues(currentIndex);
      Object.keys(initial).forEach((key) => {
        setFieldValue(key, initial[key]);
      });
    }
  }, [currentIndex]);

  const jobtype = async () => {
    const response = await getJobTypes();
    return response.data;
  };

  const institutions = async () => {
    const response = await api.get(import.meta.env.VITE_API_GET_INSTITUTIONS);
    return response.data?.data;
  };

  const classes = async () => {
    const schoolId = getFieldProps("schoolId").value;
    console.log({ schoolId });

    if (schoolId === 0) {
      return;
    }
    const response = await api.get(
      `${import.meta.env.VITE_BASE_URL}schools/${schoolId}`
    );
    return response.data?.data;
  };

  const familyMembers = async () => {
    const response = await getFamilyMember(accessToken);
    return response.data?.familyMembers;
  };

  const { data: jobData } = useSWR("jobtypes", jobtype);
  const { data: institutionData } = useSWR("institutions", institutions);
  // const { data: classData } = useSWR("classes", classes);
  const { data: familyMembersData } = useSWR("familyMembers", familyMembers);

  const [classData, setClassData] = useState([]);

  React.useEffect(() => {
    // Hanya jalankan jika familyMembersData sudah ada dan stepper belum complete
    if (
      !isComplete &&
      Array.isArray(familyMembersData) &&
      familyMembersData.length > 0
    ) {
      const type = getTypeByIndex(currentIndex);
      const dbData = familyMembersData.find((item) => {
        if (type === "ibu") return item.relation === "IBU";
        if (type === "ayah") return item.relation === "AYAH";
        if (type === "anak") return item.relation === "ANAK";
        return false;
      });

      if (dbData) {
        const initial = getInitialValues(currentIndex);
        Object.keys(initial).forEach((key) => {
          if (key === "type") {
            setFieldValue("type", getTypeByIndex(currentIndex));
            return;
          }
          switch (key) {
            case "fullName":
              setFieldValue("fullName", dbData.fullName ?? "");
              break;
            case "birthDate":
              setFieldValue(
                "birthDate",
                dbData.birthDate ? dbData.birthDate.slice(0, 10) : ""
              );
              break;
            case "education":
              setFieldValue("education", dbData.education ?? "");
              break;
            case "gender":
              setFieldValue("gender", dbData.gender ?? "");
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
                dbData.job?.jobType?.id.toString() ?? ""
              );
              break;
            case "income":
              setFieldValue("income", dbData.job?.income.toString() ?? "");
              break;
            case "height":
              setFieldValue("height", dbData.nutrition?.[0]?.height ?? "");
              break;
            case "weight":
              setFieldValue("weight", dbData.nutrition?.[0]?.weight ?? "");
              break;
            case "status":
              setFieldValue("status", dbData.residence?.status ?? "");
              break;
            case "address":
              setFieldValue("address", dbData.residence?.address ?? "");
              break;
            case "birthWeight":
              setFieldValue(
                "birthWeight",
                dbData.nutrition?.[0]?.birthWeight ?? ""
              );
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
                dbData.student?.institution?.id?.toString() ?? ""
              );
              break;
            case "classId":
              setFieldValue(
                "classId",
                dbData.student?.class?.id?.toString() ?? ""
              );
              break;
            default:
          }
        });

        if (currentIndex === 2) {
          const ibuData = familyMembersData.find(
            (item) => item.relation === "IBU"
          );
          const ayahData = dbData;
          if (ibuData && ayahData) {
            const sameHome =
              ayahData.residence?.status === ibuData.residence?.status &&
              ayahData.residence?.address === ibuData.residence?.address;
            setFieldValue("sameHome", sameHome);
          }
        }
      } else {
        const initial = getInitialValues(currentIndex);
        Object.keys(initial).forEach((key) => {
          if (key === "type") {
            setFieldValue("type", getTypeByIndex(currentIndex));
            return;
          }
          setFieldValue(key, initial[key]);
        });
      }
    }
    // eslint-disable-next-line
  }, [currentIndex, familyMembersData, setFieldValue]);

  React.useEffect(() => {
    const elEducationIbu = document.getElementById("educationIbu");
    const elEducationAyah = document.getElementById("educationAyah");
    const elEducationAnak = document.getElementById("educationAnak");
    const selectedEducationIbu = elEducationIbu
      ? HSSelect.getInstance(elEducationIbu, true)
      : null;
    const selectedEducationAyah = elEducationAyah
      ? HSSelect.getInstance(elEducationAyah, true)
      : null;
    const selectedEducationAnak = elEducationAnak
      ? HSSelect.getInstance(elEducationAnak, true)
      : null;
    if (selectedEducationIbu) {
      selectedEducationIbu.element.setValue(values.education);
    }
    if (selectedEducationAyah) {
      selectedEducationAyah.element.setValue(values.education);
    }
    if (selectedEducationAnak) {
      selectedEducationAnak.element.setValue(values.education);
    }
    const elGenderIbu = document.getElementById("genderIbu");
    const elGenderAyah = document.getElementById("genderAyah");
    const elGenderAnak = document.getElementById("genderAnak");
    const selectedGenderIbu = elGenderIbu
      ? HSSelect.getInstance(elGenderIbu, true)
      : null;
    const selectedGenderAyah = elGenderAyah
      ? HSSelect.getInstance(elGenderAyah, true)
      : null;
    const selectedGenderAnak = elGenderAnak
      ? HSSelect.getInstance(elGenderAnak, true)
      : null;
    if (selectedGenderIbu) {
      selectedGenderIbu.element.setValue(values.gender);
    }
    if (selectedGenderAyah) {
      selectedGenderAyah.element.setValue(values.gender);
    }
    if (selectedGenderAnak) {
      selectedGenderAnak.element.setValue(values.gender);
    }
    const elRelationIbu = document.getElementById("relationIbu");
    const elRelationAyah = document.getElementById("relationAyah");
    const elRelationAnak = document.getElementById("relationAnak");
    const selectedRelationIbu = elRelationIbu
      ? HSSelect.getInstance(elRelationIbu, true)
      : null;
    const selectedRelationAyah = elRelationAyah
      ? HSSelect.getInstance(elRelationAyah, true)
      : null;
    const selectedRelationAnak = elRelationAnak
      ? HSSelect.getInstance(elRelationAnak, true)
      : null;
    if (selectedRelationIbu) {
      selectedRelationIbu.element.setValue(values.relation);
    }
    if (selectedRelationAyah) {
      selectedRelationAyah.element.setValue(values.relation);
    }
    if (selectedRelationAnak) {
      selectedRelationAnak.element.setValue(values.relation);
    }
    const elJobTypeIbu = document.getElementById("jobTypeIdIbu");
    const elJobTypeAyah = document.getElementById("jobTypeIdAyah");
    const selectedJobTypeIbu = elJobTypeIbu
      ? HSSelect.getInstance(elJobTypeIbu, true)
      : null;
    const selectedJobTypeAyah = elJobTypeAyah
      ? HSSelect.getInstance(elJobTypeAyah, true)
      : null;
    if (selectedJobTypeIbu) {
      selectedJobTypeIbu.element.setValue(values.jobTypeId || "");
    }
    if (selectedJobTypeAyah) {
      selectedJobTypeAyah.element.setValue(values.jobTypeId || "");
    }
    const elIncomeIbu = document.getElementById("incomeIbu");
    const elIncomeAyah = document.getElementById("incomeAyah");
    const selectedIncomeIbu = elIncomeIbu
      ? HSSelect.getInstance(elIncomeIbu, true)
      : null;
    const selectedIncomeAyah = elIncomeAyah
      ? HSSelect.getInstance(elIncomeAyah, true)
      : null;
    if (selectedIncomeIbu) {
      selectedIncomeIbu.element.setValue(values.income || "");
    }
    if (selectedIncomeAyah) {
      selectedIncomeAyah.element.setValue(values.income || "");
    }
    const elStatusIbu = document.getElementById("statusIbu");
    const elStatusAyah = document.getElementById("statusAyah");
    const selectedStatusIbu = elStatusIbu
      ? HSSelect.getInstance(elStatusIbu, true)
      : null;
    const selectedStatusAyah = elStatusAyah
      ? HSSelect.getInstance(elStatusAyah, true)
      : null;
    if (selectedStatusIbu) {
      selectedStatusIbu.element.setValue(values.status || "");
    }
    if (selectedStatusAyah) {
      selectedStatusAyah.element.setValue(values.status || "");
    }
    const elSchoolYear = document.getElementById("schoolYear");
    const selectedSchoolYear = elSchoolYear
      ? HSSelect.getInstance(elSchoolYear, true)
      : null;
    if (selectedSchoolYear) {
      selectedSchoolYear.element.setValue(values.schoolYear || "");
    }
    const elSemester = document.getElementById("semester");
    const selectedSemester = elSemester
      ? HSSelect.getInstance(elSemester, true)
      : null;
    if (selectedSemester) {
      selectedSemester.element.setValue(values.semester || "");
    }
    const elSchoolId = document.getElementById("schoolId");
    const selectedSchoolId = elSchoolId
      ? HSSelect.getInstance(elSchoolId, true)
      : null;
    if (selectedSchoolId) {
      selectedSchoolId.element.setValue(values.schoolId || "");
    }
    const elClassId = document.getElementById("classId");
    const selectedClassId = elClassId
      ? HSSelect.getInstance(elClassId, true)
      : null;
    if (selectedClassId) {
      selectedClassId.element.setValue(values.classId || "");
    }
  }, [
    values.education,
    values.gender,
    values.relation,
    values.jobTypeId,
    values.income,
    values.status,
    values.schoolYear,
    values.semester,
    values.schoolId,
    values.classId,
  ]);

  React.useEffect(() => {
    if (isComplete) return;
    if (jobData) {
      HSStaticMethods.autoInit();

      if (dateInputRef.current) {
        const instance = HSDatepicker.getInstance(dateInputRef.current, true);

        if (instance && instance.element) {
          instance.element.on("change", (date) => {
            const selectedDate = date.selectedDates[0];
            setFieldValue("birthDate", selectedDate);
          });
        } else {
          console.error("HSDatepicker instance is null or invalid.");
        }
      } else {
        console.error("dateInputRef.current is null.");
      }

      if (dateInputRef2.current) {
        const instance = HSDatepicker.getInstance(dateInputRef2.current, true);

        if (instance && instance.element) {
          instance.element.on("change", (date) => {
            const selectedDate = date.selectedDates[0];
            setFieldValue("birthDate", selectedDate);
          });
        } else {
          console.error("HSDatepicker instance is null or invalid.");
        }
      } else {
        console.error("dateInputRef2.current is null.");
      }

      if (dateInputRef3.current) {
        const instance = HSDatepicker.getInstance(dateInputRef3.current, true);

        if (instance && instance.element) {
          instance.element.on("change", (date) => {
            const selectedDate = date.selectedDates[0];
            setFieldValue("birthDate", selectedDate);
          });
        } else {
          console.error("HSDatepicker instance is null or invalid.");
        }
      }
    }
  }, [jobData, setFieldValue]);

  React.useEffect(() => {
    if (isComplete) return;
    if (institutionData || classData) {
      HSStaticMethods.autoInit();

      if (dateInputRef3.current) {
        const instance = HSDatepicker.getInstance(dateInputRef3.current, true);

        if (instance && instance.element) {
          instance.element.on("change", (date) => {
            const selectedDate = date.selectedDates[0];
            setFieldValue("birthDate", selectedDate);
          });
        } else {
          console.error("HSDatepicker instance is null or invalid.");
        }
      }
    }
  }, [institutionData, classData, setFieldValue, isComplete]);

  React.useEffect(() => {
    if (currentIndex !== 2) return;

    setTimeout(() => {
      if (statusSelectRef.current) {
        const selectInstance = HSSelect.getInstance(
          statusSelectRef.current,
          true
        );

        if (selectInstance) {
          selectInstance.element.setValue(values.status);

          if (values.sameHome) {
            selectInstance.element.toggle.setAttribute("disabled", true);
            selectInstance.element.toggle.classList.add(
              "disabled:opacity-50",
              "disabled:pointer-events-none"
            );
            selectInstance.element.wrapper.children[3].setAttribute(
              "disabled",
              true
            );
            selectInstance.element.wrapper.children[3].classList.add(
              "opacity-50",
              "pointer-events-none"
            );
          } else {
            selectInstance.element.toggle.removeAttribute("disabled");
            selectInstance.element.toggle.classList.remove(
              "disabled:opacity-50",
              "disabled:pointer-events-none"
            );
            selectInstance.element.wrapper.children[3].removeAttribute(
              "disabled"
            );
            selectInstance.element.wrapper.children[3].classList.remove(
              "opacity-50",
              "pointer-events-none"
            );
          }
        }
      }
      HSStaticMethods.autoInit();
    }, 100);
  }, [values.status, values.sameHome, currentIndex, statusSelectRef]);

  const schoolId = +getFieldProps("schoolId").value;
  React.useEffect(() => {
    console.log({ schoolId });

    const fetchClasses = async () => {
      try {
        const { data } = await getAllClass(schoolId);
        setClassData(data.classes);
      } catch (err) {
        setClassData([]);
        console.log({ err });
      }
    };

    if (schoolId !== 0) {
      fetchClasses();
    } else {
      setClassData([]);
    }
  }, [schoolId]);

  React.useEffect(() => {
    const instance = HSSelect.getInstance("#classId");
    if (instance) {
      instance.destroy();
    }
    setTimeout(() => {
      HSStaticMethods.autoInit();
    }, 100);
  }, [classData]);

  const handleSameAddress = (e) => {
    const checked = e.target.checked;
    const saved = localStorage.getItem("familyMember");
    const members = saved ? JSON.parse(saved) : [];
    const data = members.find((item) => item.type === "ibu");
    if (checked && data) {
      setFieldValue("address", data.address);
      setFieldValue("status", data.status);
      setFieldValue("sameHome", true);
    } else {
      setFieldValue("address", "");
      setFieldValue("status", "");
      setFieldValue("sameHome", false);
    }
  };

  React.useEffect(() => {
    if (Array.isArray(familyMembersData) && familyMembersData.length > 0) {
      const hasAyah = familyMembersData.some(
        (item) => item.relation === "AYAH" && item.isCompleted === true
      );
      const hasIbu = familyMembersData.some(
        (item) => item.relation === "IBU" && item.isCompleted === true
      );
      const hasAnak = familyMembersData.some(
        (item) => item.relation === "ANAK" && item.isCompleted === true
      );
      const allCompleted = familyMembersData.every(
        (item) => item.isCompleted === true
      );

      setIsComplete(hasAyah && hasIbu && hasAnak && allCompleted);
    } else {
      setIsComplete(false);
    }
  }, [familyMembersData]);

  const updateToken = async () => {
    const currentTime = new Date().getTime();

    if (user?.exp * 1000 < currentTime) {
      const response = await token();
      setAccessToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setUser(decoded);
    }
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      if (user?.exp * 1000 < currentTime) {
        updateToken();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [user]);

  return (
    <div>
      {isComplete ? (
        <TableFamilyMember
          institutionData={institutionData}
          classData={classData}
        />
      ) : (
        <div data-hs-stepper="">
          <ul className="relative flex flex-row w-3/4 mx-auto gap-x-2">
            <li
              className="flex items-center gap-x-2 shrink basis-0 flex-1 group"
              data-hs-stepper-nav-item='{
      "index": 1
    }'
            >
              <span className="min-w-7 min-h-7 group inline-flex items-center text-xs align-middle">
                <span className="w-max h-10 hs-stepper-success:w-0 hs-stepper-success:h-0 hs-stepper-success:size-7 p-3 flex justify-center items-center shrink-0 bg-gray-100 font-medium text-gray-800 rounded-full group-focus:bg-gray-200 hs-stepper-active:bg-blue-600 hs-stepper-active:text-white hs-stepper-success:bg-blue-600 hs-stepper-success:text-white hs-stepper-completed:bg-teal-500 hs-stepper-completed:group-focus:bg-teal-600">
                  <div className="flex items-center justify-center gap-x-2">
                    <FaChildDress className="hs-stepper-success:hidden hs-stepper-completed:hidden" />
                    <span className="hs-stepper-success:hidden hs-stepper-completed:hidden">
                      Data Diri
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
              <div className="w-full h-px flex-1 bg-gray-200 group-last:hidden hs-stepper-success:bg-blue-600 hs-stepper-completed:bg-teal-600"></div>
            </li>

            <li
              className="flex items-center gap-x-2 shrink basis-0 flex-1 group"
              data-hs-stepper-nav-item='{
      "index": 2
    }'
            >
              <span className="min-w-7 min-h-7 group inline-flex items-center text-xs align-middle">
                <span className="w-max h-10 hs-stepper-success:w-0 hs-stepper-success:h-0 hs-stepper-success:size-7 p-3 flex justify-center items-center shrink-0 bg-gray-100 font-medium text-gray-800 rounded-full group-focus:bg-gray-200 hs-stepper-active:bg-blue-600 hs-stepper-active:text-white hs-stepper-success:bg-blue-600 hs-stepper-success:text-white hs-stepper-completed:bg-teal-500 hs-stepper-completed:group-focus:bg-teal-600">
                  <div className="flex items-center justify-center gap-x-2">
                    <FaChild className="hs-stepper-success:hidden hs-stepper-completed:hidden" />
                    <span className="hs-stepper-success:hidden hs-stepper-completed:hidden">
                      Data Ayah
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
              <div className="w-full h-px flex-1 bg-gray-200 group-last:hidden hs-stepper-success:bg-blue-600 hs-stepper-completed:bg-teal-600"></div>
            </li>

            <li
              className="flex items-center gap-x-2 group"
              data-hs-stepper-nav-item='{
        "index": 3
      }'
            >
              <span className="min-w-7 min-h-7 group inline-flex items-center text-xs align-middle">
                <span className="w-max h-10 hs-stepper-success:w-0 hs-stepper-success:h-0 hs-stepper-success:size-7 p-3 flex justify-center items-center shrink-0 bg-gray-100 font-medium text-gray-800 rounded-full group-focus:bg-gray-200 hs-stepper-active:bg-blue-600 hs-stepper-active:text-white hs-stepper-success:bg-blue-600 hs-stepper-success:text-white hs-stepper-completed:bg-teal-500 hs-stepper-completed:group-focus:bg-teal-600">
                  <div className="flex items-center justify-center gap-x-2">
                    <FaChildReaching className="hs-stepper-success:hidden hs-stepper-completed:hidden" />
                    <span className="hs-stepper-success:hidden hs-stepper-completed:hidden">
                      Data Anak
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
              <div className="w-full h-px flex-1 bg-gray-200 group-last:hidden hs-stepper-success:bg-blue-600 hs-stepper-completed:bg-teal-600"></div>
            </li>
            {/* End Item */}
          </ul>

          <div className="mt-5 sm:mt-8">
            <div
              data-hs-stepper-content-item='{
      "index": 1
    }'
            >
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
                              htmlFor="birthDate"
                              className="block text-sm font-medium mb-2"
                            >
                              Tanggal Lahir
                            </label>
                            <input
                              required
                              ref={dateInputRef}
                              id="birthDate"
                              name="birthDate"
                              readOnly
                              className="hs-datepicker py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none place"
                              type="text"
                              value={values.birthDate ?? ""}
                              placeholder="YYYY/MM/DD"
                              data-hs-datepicker='{
                              "selectedTheme": "light",
                              "dateMin": "1950-01-01",
                              "dateMax": "2050-12-31",
                              "locale": "id-ID",
                              "firstWeekday": 0,
                              "inputModeOptions": {
                                "dateSeparator": "/"
                              },
                              "templates": {
                                "arrowPrev": "<button data-vc-arrow=\"prev\"><svg class=\"shrink-0 size-4\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m15 18-6-6 6-6\"></path></svg></button>",
                                "arrowNext": "<button data-vc-arrow=\"next\"><svg class=\"shrink-0 size-4\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m9 18 6-6-6-6\"></path></svg></button>"
                              }
                            }'
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
                              onChange={(e) =>
                                setFieldValue("education", e.target.value)
                              }
                              value={values.education ?? ""}
                              data-hs-select='{
                    "hasSearch": true,
                    "searchPlaceholder": "Cari...",
                    "searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 py-1.5 sm:py-2 px-3",
                    "searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0",
                    "placeholder": "Pilh Pendidikan...",
                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                    "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800",
                    "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                    "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                    "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                    "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                  }'
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
                              htmlFor="genderIbu"
                              className="block text-sm font-medium mb-2"
                            >
                              Jenis Kelamin
                            </label>
                            <select
                              required
                              id="genderIbu"
                              name="gender"
                              onChange={(e) =>
                                setFieldValue("gender", e.target.value)
                              }
                              value={values.gender ?? ""}
                              data-hs-select='{
                    "placeholder": "Pilih Jenis Kelamin...",
                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                    "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800",
                    "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                    "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                    "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                    "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                  }'
                              className="hidden"
                            >
                              <option value="">Pilih Jenis Kelamin</option>
                              <option value="L">Laki-Laki</option>
                              <option value="P">Perempuan</option>
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
                              onChange={(e) =>
                                setFieldValue("relation", e.target.value)
                              }
                              value={values.relation ?? ""}
                              data-hs-select='{
                    "placeholder": "Pilih Hubungan...",
                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                    "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800",
                    "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                    "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                    "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                    "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                  }'
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
                              onChange={(e) =>
                                setFieldValue("jobTypeId", e.target.value)
                              }
                              value={values.jobTypeId ?? ""}
                              data-hs-select='{
                    "hasSearch": true,
                    "searchPlaceholder": "Cari...",
                    "searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 py-1.5 sm:py-2 px-3",
                    "searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0",
                    "placeholder": "Pilh Pekerjaan...",
                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                    "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800",
                    "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                    "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                    "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                    "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                  }'
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
                          <div className="max-w-lg w-full">
                            <label
                              htmlFor="incomeIbu"
                              className="block text-sm font-medium mb-2"
                            >
                              Gaji
                            </label>
                            <select
                              required
                              name="income"
                              id="incomeIbu"
                              onChange={(e) =>
                                setFieldValue("income", e.target.value)
                              }
                              value={values.income ?? ""}
                              data-hs-select='{
                    "hasSearch": true,
                    "searchPlaceholder": "Cari...",
                    "searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 py-1.5 sm:py-2 px-3",
                    "searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0",
                    "placeholder": "Pilh Gaji...",
                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                    "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800",
                    "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                    "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                    "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                    "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                  }'
                              className="hidden"
                            >
                              <option value="">Pilih Gaji</option>
                              <option value="KURANG_DARI_SATU_JUTA">
                                Kurang Dari 1 Juta
                              </option>
                              <option value="SATU_JUTA_SAMPAI_DUA_JUTA">
                                1 Juta Sampai 2 Juta
                              </option>
                              <option value="DUA_JUTA_SAMPAI_TIGA_JUTA">
                                2 Juta Sampai 3 Juta
                              </option>
                              <option value="TIGA_JUTA_SAMPAI_EMPAT_JUTA">
                                3 Juta Sampai 4 Juta
                              </option>
                              <option value="EMPAT_JUTA_SAMPAI_LIMA_JUTA">
                                4 Juta Sampai 5 Juta
                              </option>
                              <option value="LIMA_JUTA_SAMPAI_ENAM_JUTA">
                                5 Juta Sampai 6 Juta
                              </option>
                              <option value="ENAM_JUTA_SAMPAI_TUJUH_JUTA">
                                6 Juta Sampai 7 Juta
                              </option>
                              <option value="TUJUH_JUTA_SAMPAI_DELAPAN_JUTA">
                                7 Juta Sampai 8 Juta
                              </option>
                              <option value="DELAPAN_JUTA_SAMPAI_SEMBILAN_JUTA">
                                8 Juta Sampai 9 Juta
                              </option>
                              <option value="SEMBILAN_JUTA_SAMPAI_SEPULUH_JUTA">
                                9 Juta Sampai 10 Juta
                              </option>
                              <option value="LEBIH_DARI_SEPULUH_JUTA">
                                Lebih Dari 10 Juta
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-4">
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
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="py-2.5 sm:py-3 px-4 block w-full border border-gray-200 rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                              placeholder="180"
                              required
                              value={values.height ?? ""}
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
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="py-2.5 sm:py-3 px-4 block w-full border border-gray-200 rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                              placeholder="80"
                              required
                              value={values.weight ?? ""}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 h-max">
                        <h1 className="font-semibold tracking-wide text-lg mb-4">
                          Data Tempat Tinggal
                        </h1>
                        <div className="flex flex-col space-y-4">
                          <div className="max-w-lg w-full">
                            <label
                              htmlFor="statusIbu"
                              className="block text-sm font-medium mb-2"
                            >
                              Status Tempat Tinggal
                            </label>
                            <select
                              required
                              id="statusIbu"
                              name="status"
                              onChange={(e) =>
                                setFieldValue("status", e.target.value)
                              }
                              value={values.status ?? "MILIK_SENDIRI"}
                              data-hs-select='{
                    "placeholder": "Pilih Status Tempat Tinggal...",
                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                    "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800",
                    "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                    "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                    "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                    "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                  }'
                              className="hidden"
                            >
                              <option value="">
                                Pilih Status Tempat Tinggal
                              </option>
                              <option value="MILIK_SENDIRI">
                                Milik Sendiri
                              </option>
                              <option value="MENYEWA">Menyewa</option>
                              <option value="BERSAMA_ORANG_TUA">
                                Bersama Orang Tua
                              </option>
                              <option value="LAINNYA">Lainnya</option>
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
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>

            <div
              data-hs-stepper-content-item='{
      "index": 2
    }'
              style={{ display: "none" }}
            >
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
                              htmlFor="birthDateAyah"
                              className="block text-sm font-medium mb-2"
                            >
                              Tanggal Lahir
                            </label>
                            <input
                              required
                              ref={dateInputRef2}
                              id="birthDateAyah"
                              name="birthDate"
                              className="hs-datepicker py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none place"
                              type="text"
                              placeholder="YYYY/MM/DD"
                              readOnly
                              value={values.birthDate ?? ""}
                              data-hs-datepicker='{
                              "selectedTheme": "light",
                              "dateMin": "1950-01-01",
                              "dateMax": "2050-12-31",
                              "locale": "id-ID",
                              "firstWeekday": 0,
                              "inputModeOptions": {
                                "dateSeparator": "/"
                              },
                              "templates": {
                                "arrowPrev": "<button data-vc-arrow=\"prev\"><svg class=\"shrink-0 size-4\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m15 18-6-6 6-6\"></path></svg></button>",
                                "arrowNext": "<button data-vc-arrow=\"next\"><svg class=\"shrink-0 size-4\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m9 18 6-6-6-6\"></path></svg></button>"
                              }
                            }'
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
                              onChange={(e) =>
                                setFieldValue("education", e.target.value)
                              }
                              value={values.education ?? ""}
                              data-hs-select='{
                    "hasSearch": true,
                    "searchPlaceholder": "Cari...",
                    "searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 py-1.5 sm:py-2 px-3",
                    "searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0",
                    "placeholder": "Pilh Pendidikan...",
                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                    "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800",
                    "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                    "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                    "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                    "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                  }'
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
                              htmlFor="genderAyah"
                              className="block text-sm font-medium mb-2"
                            >
                              Jenis Kelamin
                            </label>
                            <select
                              required
                              id="genderAyah"
                              name="gender"
                              onChange={(e) =>
                                setFieldValue("gender", e.target.value)
                              }
                              value={values.gender ?? ""}
                              data-hs-select='{
                    "placeholder": "Pilih Jenis Kelamin...",
                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                    "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800",
                    "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                    "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                    "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                    "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                  }'
                              className="hidden"
                            >
                              <option value="">Pilih Jenis Kelamin</option>
                              <option value="L">Laki-Laki</option>
                              <option value="P">Perempuan</option>
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
                              onChange={(e) =>
                                setFieldValue("relation", e.target.value)
                              }
                              value={values.relation ?? ""}
                              data-hs-select='{
                    "placeholder": "Pilih Hubungan...",
                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                    "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800",
                    "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                    "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                    "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                    "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                  }'
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
                              onChange={(e) =>
                                setFieldValue("jobTypeId", e.target.value)
                              }
                              value={values.jobTypeId ?? ""}
                              data-hs-select='{
                    "hasSearch": true,
                    "searchPlaceholder": "Cari...",
                    "searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 py-1.5 sm:py-2 px-3",
                    "searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0",
                    "placeholder": "Pilh Pekerjaan...",
                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                    "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800",
                    "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                    "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                    "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                    "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                  }'
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
                          <div className="max-w-lg w-full">
                            <label
                              htmlFor="incomeAyah"
                              className="block text-sm font-medium mb-2"
                            >
                              Gaji
                            </label>
                            <select
                              required
                              name="income"
                              id="incomeAyah"
                              onChange={(e) =>
                                setFieldValue("income", e.target.value)
                              }
                              value={values.income ?? ""}
                              data-hs-select='{
                    "hasSearch": true,
                    "searchPlaceholder": "Cari...",
                    "searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 py-1.5 sm:py-2 px-3",
                    "searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0",
                    "placeholder": "Pilh Gaji...",
                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                    "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800",
                    "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                    "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                    "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                    "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                  }'
                              className="hidden"
                            >
                              <option value="">Pilih Gaji</option>
                              <option value="KURANG_DARI_SATU_JUTA">
                                Kurang Dari 1 Juta
                              </option>
                              <option value="SATU_JUTA_SAMPAI_DUA_JUTA">
                                1 Juta Sampai 2 Juta
                              </option>
                              <option value="DUA_JUTA_SAMPAI_TIGA_JUTA">
                                2 Juta Sampai 3 Juta
                              </option>
                              <option value="TIGA_JUTA_SAMPAI_EMPAT_JUTA">
                                3 Juta Sampai 4 Juta
                              </option>
                              <option value="EMPAT_JUTA_SAMPAI_LIMA_JUTA">
                                4 Juta Sampai 5 Juta
                              </option>
                              <option value="LIMA_JUTA_SAMPAI_ENAM_JUTA">
                                5 Juta Sampai 6 Juta
                              </option>
                              <option value="ENAM_JUTA_SAMPAI_TUJUH_JUTA">
                                6 Juta Sampai 7 Juta
                              </option>
                              <option value="TUJUH_JUTA_SAMPAI_DELAPAN_JUTA">
                                7 Juta Sampai 8 Juta
                              </option>
                              <option value="DELAPAN_JUTA_SAMPAI_SEMBILAN_JUTA">
                                8 Juta Sampai 9 Juta
                              </option>
                              <option value="SEMBILAN_JUTA_SAMPAI_SEPULUH_JUTA">
                                9 Juta Sampai 10 Juta
                              </option>
                              <option value="LEBIH_DARI_SEPULUH_JUTA">
                                Lebih Dari 10 Juta
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-4">
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
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="py-2.5 sm:py-3 px-4 block w-full border border-gray-200 rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                              placeholder="180"
                              value={values.height ?? ""}
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
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="py-2.5 sm:py-3 px-4 block w-full border border-gray-200 rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                              placeholder="80"
                              value={values.weight ?? ""}
                              required={!!values.weight}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 h-max">
                        <h1 className="font-semibold tracking-wide text-lg mb-4">
                          Data Tempat Tinggal
                        </h1>
                        <div className="flex flex-col space-y-4">
                          <div className="max-w-lg w-full">
                            <label
                              htmlFor="statusAyah"
                              className="block text-sm font-medium mb-2"
                            >
                              Status Tempat Tinggal
                            </label>
                            <select
                              ref={statusSelectRef}
                              required
                              id="statusAyah"
                              name="status"
                              onChange={(e) =>
                                setFieldValue("status", e.target.value)
                              }
                              value={values.status ?? ""}
                              data-hs-select='{
                    "placeholder": "Pilih Status Tempat Tinggal...",
                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                    "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800",
                    "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                    "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                    "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                    "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                  }'
                              className="hidden"
                            >
                              <option value="">
                                Pilih Status Tempat Tinggal
                              </option>
                              <option value="MILIK_SENDIRI">
                                Milik Sendiri
                              </option>
                              <option value="MENYEWA">Menyewa</option>
                              <option value="BERSAMA_ORANG_TUA">
                                Bersama Orang Tua
                              </option>
                              <option value="LAINNYA">Lainnya</option>
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
                              disabled={values.sameHome}
                              className="py-2 px-3 sm:py-3 sm:px-4 block w-full border border-obito-grey rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                              rows="2"
                              placeholder="Jl. Telekomunikasi No. 1, Bandung"
                              required
                              value={values.address ?? ""}
                            ></textarea>
                          </div>
                          <div className="flex">
                            <input
                              type="checkbox"
                              className="shrink-0 mt-0.5 border-gray-200 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                              id="hs-default-checkbox"
                              onChange={handleSameAddress}
                              value={values.sameHome ?? ""}
                              checked={!!values.sameHome}
                            />
                            <label
                              htmlFor="hs-default-checkbox"
                              className="text-sm text-gray-500 ms-3"
                            >
                              Alamat rumah sama
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>

            <div
              data-hs-stepper-content-item='{
      "index": 3
    }'
              style={{ display: "none" }}
            >
              <form onSubmit={handleSubmit}>
                {!institutionData ? (
                  <div>Loading...</div>
                ) : (
                  <div className="grid grid-cols-2 gap-x-5">
                    <div className="flex flex-col space-y-4">
                      {/* Biodata Start */}
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
                              ref={dateInputRef3}
                              required
                              id="birthDateAnak"
                              name="birthDate"
                              value={values.birthDate ?? ""}
                              readOnly
                              className="hs-datepicker py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none place"
                              type="text"
                              placeholder="YYYY/MM/DD"
                              data-hs-datepicker='{
                              "selectedTheme": "light",
                              "dateMin": "1950-01-01",
                              "dateMax": "2050-12-31",
                              "locale": "id-ID",
                              "firstWeekday": 0,
                              "inputModeOptions": {
                                "dateSeparator": "/"
                              },
                              "templates": {
                                "arrowPrev": "<button data-vc-arrow=\"prev\"><svg class=\"shrink-0 size-4\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m15 18-6-6 6-6\"></path></svg></button>",
                                "arrowNext": "<button data-vc-arrow=\"next\"><svg class=\"shrink-0 size-4\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m9 18 6-6-6-6\"></path></svg></button>"
                              }
                            }'
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
                              onChange={(e) =>
                                setFieldValue("education", e.target.value)
                              }
                              value={values.education ?? ""}
                              data-hs-select='{
                    "hasSearch": true,
                    "searchPlaceholder": "Cari...",
                    "searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 py-1.5 sm:py-2 px-3",
                    "searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0",
                    "placeholder": "Pilh Pendidikan...",
                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                    "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800",
                    "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                    "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                    "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                    "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                  }'
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
                              onChange={(e) =>
                                setFieldValue("gender", e.target.value)
                              }
                              value={values.gender ?? ""}
                              data-hs-select='{
                    "placeholder": "Pilih Jenis Kelamin...",
                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                    "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800",
                    "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                    "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                    "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                    "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                  }'
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
                              onChange={(e) =>
                                setFieldValue("relation", e.target.value)
                              }
                              value={values.relation ?? ""}
                              data-hs-select='{
                    "placeholder": "Pilih Hubungan...",
                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                    "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800",
                    "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                    "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                    "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                    "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                  }'
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
                      {/* Biodata End */}
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
                              data-hs-select='{
                    "hasSearch": true,
                    "searchPlaceholder": "Cari...",
                    "searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 py-1.5 sm:py-2 px-3",
                    "searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0",
                    "placeholder": "Pilh Angkatan...",
                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                    "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800",
                    "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                    "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                    "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                    "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                  }'
                              className="hidden"
                            >
                              <option value="">Pilih Angkatan</option>
                              <option value="2025/2024">2025/2024</option>
                              <option value="2024/2023">2024/2023</option>
                              <option value="2023/2022">2023/2022</option>
                              <option value="2022/2021">2022/2021</option>
                              <option value="2021/2020">2021/2020</option>
                              <option value="2020/2019">2020/2019</option>
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
                              onChange={(e) =>
                                setFieldValue("semester", e.target.value)
                              }
                              value={values.semester ?? ""}
                              required
                              data-hs-select='{
                    "hasSearch": true,
                    "searchPlaceholder": "Cari...",
                    "searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 py-1.5 sm:py-2 px-3",
                    "searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0",
                    "placeholder": "Pilh Semester...",
                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                    "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800",
                    "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                    "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                    "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                    "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                  }'
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
                              onChange={(e) =>
                                setFieldValue("schoolId", e.target.value)
                              }
                              value={values.schoolId ?? ""}
                              required
                              data-hs-select='{
                    "hasSearch": true,
                    "searchPlaceholder": "Cari...",
                    "searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 py-1.5 sm:py-2 px-3",
                    "searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0",
                    "placeholder": "Pilh Sekolah...",
                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                    "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800",
                    "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                    "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                    "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                    "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                  }'
                              className="hidden"
                            >
                              <option value="">Pilih Sekolah</option>
                              {institutionData &&
                                institutionData?.institutions
                                  ?.filter(
                                    (item) =>
                                      item.institution_type?.name === "School"
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
                              onChange={(e) =>
                                setFieldValue("classId", e.target.value)
                              }
                              value={values.classId ?? ""}
                              required
                              data-hs-select='{
                    "hasSearch": true,
                    "searchPlaceholder": "Cari...",
                    "searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 py-1.5 sm:py-2 px-3",
                    "searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0",
                    "placeholder": "Pilh Kelas...",
                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                    "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800",
                    "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                    "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                    "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                    "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                  }'
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
                        <div className="max-w-lg w-full">
                          <label
                            htmlFor="birthWeight"
                            className="block text-sm font-medium mb-2"
                          >
                            Berat Badan Lahir (kg)
                          </label>
                          <input
                            type="text"
                            id="birthWeight"
                            className="py-2.5 sm:py-3 px-4 block w-full border border-gray-200 rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                            placeholder="2"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.birthWeight ?? ""}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>

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
              {currentIndex === 3 && (
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
