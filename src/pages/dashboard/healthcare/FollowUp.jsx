import Placeholder from "@tiptap/extension-placeholder";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useFormik } from "formik";
import { HSSelect, HSStaticMethods } from "preline/preline";
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import Editor, {
  MenuBar,
} from "../../../components/dashboard/healthcare/Editor";
import Modal from "../../../components/dashboard/healthcare/Modal";
import TableQuestion from "../../../components/dashboard/healthcare/TableQuestion";
import {
  showResponseForInstitution,
  showResponseForParent,
} from "../../../lib/parent/responseAPI";
import { getQuesioners } from "../../../lib/quesionersAPI";
import {
  getRecommendations,
  getSingleRecommendation,
} from "../../../lib/recommendationAPI";
import { useAuth } from "../../../hooks/auth/useAuth";

const TABLE_HEAD = ["No", "Pertanyaan", "Jawaban"];

const FollowUp = () => {
  const [page, setPage] = React.useState({});
  const [limit, setLimit] = React.useState({});
  const [keyword, setKeyword] = React.useState({});
  const [query, setQuery] = React.useState({});
  const [responseParentData, setResponseParentData] = React.useState({});
  const [responseSchoolData, setResponseSchoolData] = React.useState({});
  const [loadingParent, setLoadingParent] = React.useState({});
  const [loadingSchool, setLoadingSchool] = React.useState({});
  const schoolRef = React.useRef(null);
  const [imgUrl, setImgUrl] = React.useState(null);

  const { values, setFieldValue } = useFormik({
    initialValues: {
      student: "",
      school: "",
    },
  });

  const quesionerParent = async () => {
    const response = await getQuesioners();
    return response.data.filter(
      (item) =>
        item.title === "Tingkat Pengetahuan Gizi Seimbang" ||
        item.title === "Kebiasaan Sehari-hari Anak"
    );
  };

  const quesionerSchool = async () => {
    const response = await getQuesioners();
    return response.data.filter(
      (item) =>
        item.title === "Pelayanan Kesehatan Sekolah" ||
        item.title === "Lingkungan Sekolah"
    );
  };

  const { data: quesionerParentData } = useSWR(
    "quesionerParent",
    quesionerParent
  );
  const { data: quesionerSchoolData } = useSWR(
    "quesionerSchool",
    quesionerSchool
  );

  console.log({ quesionerParentData, values });

  React.useEffect(() => {
    if (quesionerParentData && values.student) {
      setLoadingParent(
        Object.fromEntries(quesionerParentData.map((q) => [q.id, true]))
      );
      Promise.all(
        quesionerParentData.map(async (q) => {
          try {
            const response = await showResponseForParent(
              q.id,
              values.student,
              keyword[q.id] || "",
              page[q.id] || 0,
              limit[q.id] || 10
            );
            return {
              id: q.id,
              data: response.data,
            };
          } catch (error) {
            console.log(error);
          }
        })
      ).then((results) => {
        const obj = {};
        results.forEach((r) => {
          obj[r.id] = r.data;
        });
        setResponseParentData(obj);
        setLoadingParent(
          Object.fromEntries(quesionerParentData.map((q) => [q.id, false]))
        );
      });
    }
  }, [quesionerParentData, values.student, keyword, page, limit]);

  React.useEffect(() => {
    if (quesionerSchoolData && values.school) {
      setLoadingSchool(
        Object.fromEntries(quesionerSchoolData.map((q) => [q.id, true]))
      );
      Promise.all(
        quesionerSchoolData.map(async (q) => {
          try {
            const response = await showResponseForInstitution(
              q.id,
              values.school,
              keyword[q.id] || "",
              page[q.id] || 0,
              limit[q.id] || 10
            );
            return {
              id: q.id,
              data: response.data,
            };
          } catch (error) {
            console.log(error);
          }
        })
      ).then((results) => {
        const obj = {};
        results.forEach((r) => {
          obj[r.id] = r.data;
        });
        setResponseSchoolData(obj);
        setLoadingSchool(
          Object.fromEntries(quesionerSchoolData.map((q) => [q.id, false]))
        );
      });
    }
  }, [quesionerSchoolData, values.school, keyword, page, limit]);

  const [selectedRecommendationData, setSelectedRecommendationData] =
    React.useState(null);
  const { accessToken } = useAuth();

  const students = async () => {
    const response = await getRecommendations(accessToken);
    const filteredData = {
      ...response.data,
      recomend: response.data.recomend.filter(
        (item) => item.status === "PROCESSED"
      ),
    };
    filteredData.totalRows = filteredData.recomend.length;
    return filteredData;
  };

  const { data: recommendationData, isLoading: recommendationLoading } = useSWR(
    "students",
    students
  );

  React.useEffect(() => {
    if (recommendationData) {
      HSStaticMethods.autoInit();
    }
  }, [recommendationData]);

  const getSchoolIdByStudentFamilyId = (familyId) => {
    const rec = recommendationData?.recomend.find(
      (r) => r?.student?.familyMember?.familyId === familyId
    );
    setSelectedRecommendationData(rec);
    return rec?.student?.institution?.id?.toString() || "";
  };

  React.useEffect(() => {
    if (schoolRef.current) {
      const selectInstance = HSSelect.getInstance(schoolRef.current, true);
      if (selectInstance) {
        selectInstance.element.setValue(values.school);
      }
    }
  }, [values.school, recommendationData]);

  React.useEffect(() => {
    // Hapus label yang terkait dengan select student
    const label = document.querySelector('label[for="student"]');
    if (label) {
      label.remove();
    }

    const select = document.getElementById("student");
    if (select) {
      const instance = HSSelect.getInstance(select);
      if (instance) {
        instance.destroy();
      }
    }
    setTimeout(() => {
      const newLabel = document.createElement("label");
      newLabel.setAttribute("for", "student");
      newLabel.className = "block text-sm font-medium mb-2";
      newLabel.textContent = "Murid";
      if (!select) {
        return;
      }
      // select.parentNode.insertBefore(newLabel, select);
      HSStaticMethods.autoInit();
    }, 100);
  }, [values.school]);

  const [content, setContent] = useState("");

  const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure({ types: [ListItem.name] }),
    StarterKit.configure({
      bulletList: {
        keepMarks: true,
        keepAttributes: false,
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false,
      },
      heading: {
        levels: [1, 2, 3, 4, 5, 6],
      },
    }),
    Placeholder.configure({
      placeholder: "Tulis rekomendasi disini",
      emptyNodeClass: "text-gray-400 dark:text-neutral-100",
    }),
  ];

  // const [recommendation, setRecommendation] = useState(null);

  const fetchRecommendationWithUserData = async () => {
    console.log("Fetching ....");
    if (!selectedRecommendationData) {
      console.log("ID belum tersedia");
      return null;
    }
    const recommendation = await getSingleRecommendation(
      selectedRecommendationData.id
    );
    return recommendation.data;
  };

  const {
    data: recommendation,
    mutate,
    isLoading,
    error,
  } = useSWR(
    selectedRecommendationData?.id
      ? `singleRecommendation-${selectedRecommendationData.id}`
      : null,
    fetchRecommendationWithUserData,
    { onError: (err) => console.log({ err }) }
  );

  useEffect(() => {
    if (!selectedRecommendationData) {
      return;
    }
    mutate();
  }, [selectedRecommendationData]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-2 gap-x-5">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex flex-col space-y-4">
            {recommendationLoading ? (
              <div>Loading...</div>
            ) : (
              <div className="max-w-lg w-full">
                <label
                  htmlFor="student"
                  className="block text-sm font-medium mb-2"
                >
                  Murid
                </label>
                <select
                  required
                  name="student"
                  id="student"
                  onChange={(e) => {
                    setFieldValue("student", e.target.value);
                    const schoolId = getSchoolIdByStudentFamilyId(
                      e.target.value
                    );
                    if (schoolId) setFieldValue("school", schoolId);
                  }}
                  value={values.student ?? ""}
                  data-hs-select='{
                    "hasSearch": true,
                    "searchPlaceholder": "Cari...",
                    "searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 py-1.5 sm:py-2 px-3",
                    "searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0",
                    "placeholder": "Pilh Murid...",
                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                    "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800",
                    "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                    "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                    "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                    "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                  }'
                  className="hidden"
                >
                  <option value="">Pilih Murid </option>
                  {values.school === ""
                    ? recommendationData?.recomend?.map((rec) => (
                        <option
                          key={rec.id}
                          value={rec?.student?.familyMember?.familyId}
                        >
                          {rec?.student?.familyMember?.fullName}
                        </option>
                      ))
                    : recommendationData?.recomend
                        ?.filter(
                          (rec) =>
                            rec?.student?.institution?.id?.toString() ===
                            values.school
                        )
                        .map((rec) => (
                          <option
                            key={rec.id}
                            value={rec?.student?.familyMember?.familyId}
                          >
                            {rec?.student?.familyMember?.fullName}
                          </option>
                        ))}
                </select>
              </div>
            )}

            {values.student && quesionerParentData && (
              <div>
                {quesionerParentData.map((q) => (
                  <div key={q.id}>
                    <h2 className="text-sm font-semibold my-5">
                      Hasil Jawaban {q.title}
                    </h2>
                    <TableQuestion
                      TABLE_HEAD={TABLE_HEAD}
                      content={"jawaban"}
                      data={responseParentData[q.id]}
                      dataKey={"answers"}
                      page={responseParentData[q.id]?.page || 0}
                      pages={responseParentData[q.id]?.totalPage || 0}
                      rows={responseParentData[q.id]?.totalRows || 0}
                      setPage={(p) =>
                        setPage((prev) => ({ ...prev, [q.id]: p }))
                      }
                      setQuery={(val) =>
                        setQuery((prev) => ({ ...prev, [q.id]: val }))
                      }
                      query={query[q.id] || ""}
                      searchData={(e) => {
                        e.preventDefault();
                        setPage((prev) => ({ ...prev, [q.id]: 0 }));
                        setKeyword((prev) => ({
                          ...prev,
                          [q.id]: query[q.id] || "",
                        }));
                      }}
                      placeholder="Cari pertanyaan"
                      isLoading={loadingParent[q.id]}
                    >
                      {(answer, index) => {
                        const question = responseParentData[
                          q.id
                        ]?.questions?.find(
                          (qst) => Number(qst.id) === Number(answer.questionId)
                        );

                        let jawaban = "-";

                        if (question) {
                          const selectedOption = question.options?.find(
                            (opt) => Number(opt.id) === Number(answer.option_id)
                          );

                          if (selectedOption) {
                            jawaban = selectedOption.title;
                          }
                        }

                        return (
                          <tr key={answer.id}>
                            <td className="px-6 py-4 capitalize whitespace-nowrap text-sm font-medium text-gray-800">
                              {responseParentData[q.id]?.page *
                                responseParentData[q.id]?.limit +
                                index +
                                1}
                            </td>
                            <td className="px-6 py-4 capitalize whitespace-pre-wrap text-sm font-medium text-gray-800">
                              {question?.title}
                            </td>
                            <td className="px-6 py-4 capitalize whitespace-nowrap text-sm font-medium text-gray-800">
                              {jawaban}
                            </td>
                          </tr>
                        );
                      }}
                    </TableQuestion>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex flex-col space-y-4">
            {recommendationLoading ? (
              <div>Loading...</div>
            ) : (
              <div className="max-w-lg w-full">
                <label
                  htmlFor="school"
                  className="block text-sm font-medium mb-2"
                >
                  Sekolah
                </label>
                <select
                  ref={schoolRef}
                  required
                  name="school"
                  id="school"
                  onChange={(e) => setFieldValue("school", e.target.value)}
                  value={values.school ?? ""}
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
                  <option value="">Pilih Sekolah </option>
                  {recommendationData?.recomend.map((rec) => (
                    <option key={rec.id} value={rec?.student?.institution?.id}>
                      {rec?.student?.institution?.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {values.school && quesionerSchoolData && (
              <div>
                {quesionerSchoolData.map((q) => (
                  <div key={q.id}>
                    <h2 className="text-sm font-semibold my-5">
                      Hasil Jawaban {q.title}
                    </h2>
                    <TableQuestion
                      TABLE_HEAD={TABLE_HEAD}
                      content={"jawaban"}
                      data={responseSchoolData[q.id]}
                      dataKey={"answers"}
                      page={responseSchoolData[q.id]?.page || 0}
                      pages={responseSchoolData[q.id]?.totalPage || 0}
                      rows={responseSchoolData[q.id]?.totalRows || 0}
                      setPage={(p) =>
                        setPage((prev) => ({ ...prev, [q.id]: p }))
                      }
                      setQuery={(val) =>
                        setQuery((prev) => ({ ...prev, [q.id]: val }))
                      }
                      query={query[q.id] || ""}
                      searchData={(e) => {
                        e.preventDefault();
                        setPage((prev) => ({ ...prev, [q.id]: 0 }));
                        setKeyword((prev) => ({
                          ...prev,
                          [q.id]: query[q.id] || "",
                        }));
                      }}
                      placeholder="Cari pertanyaan"
                      isLoading={loadingSchool[q.id]}
                    >
                      {(answer, index) => {
                        const question = responseSchoolData[
                          q.id
                        ]?.questions?.find(
                          (qst) => Number(qst.id) === Number(answer.questionId)
                        );

                        let jawaban = "-";

                        if (question) {
                          const selectedOption = question.options?.find(
                            (opt) => Number(opt.id) === Number(answer.option_id)
                          );

                          if (selectedOption) {
                            jawaban = selectedOption.title;
                          }
                        }

                        return (
                          <tr key={answer.id}>
                            <td className="px-6 py-4 capitalize whitespace-nowrap text-sm font-medium text-gray-800">
                              {responseSchoolData[q.id]?.page *
                                responseSchoolData[q.id]?.limit +
                                index +
                                1}
                            </td>
                            <td className="px-6 py-4 capitalize whitespace-pre-wrap text-sm font-medium text-gray-800">
                              {question?.title}
                            </td>
                            <td className="px-6 py-4 capitalize whitespace-nowrap text-sm font-medium text-gray-800">
                              {jawaban}
                            </td>
                          </tr>
                        );
                      }}
                    </TableQuestion>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <div className="text-lg">
          <h1 className="font-bold ">Rekomendasi</h1>
          <EditorProvider
            content={content}
            extensions={extensions}
            slotBefore={<MenuBar />}
            editorContainerProps={{
              className: "border p-4 border-gray-400 rounded-md ",
            }}
          >
            <Editor
              selectedRecommendationData={selectedRecommendationData}
              content={content}
              setContent={setContent}
              imgUrl={imgUrl}
              setImgUrl={setImgUrl}
            >
              <Modal
                content={content}
                values={recommendation ?? ""}
                setContent={setContent}
                signature={imgUrl}
              />
            </Editor>
          </EditorProvider>
        </div>
      </div>
    </div>
  );
};

export default FollowUp;
