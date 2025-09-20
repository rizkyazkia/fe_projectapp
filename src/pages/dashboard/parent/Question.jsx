import { useFormik } from "formik";
import { jwtDecode } from "jwt-decode";
import { HSOverlay, HSStaticMethods } from "preline/preline";
import React from "react";
import { IoPlay } from "react-icons/io5";
import useSWR from "swr";
import { useAuth } from "../../../hooks/auth/useAuth";
import { useResponses } from "../../../hooks/parent/useResponses";
import { token } from "../../../lib/auth/authAPI";
import { getResponseQuesioner } from "../../../lib/parent/responseAPI";
import {
  getQuesioners,
  getQuestionsByQuesionerIDWithoutPagination,
} from "../../../lib/quesionersAPI";
import FormEditResponse from "../../../components/dashboard/parent/FormEditResponse";

const TABLE_HEAD = ["No", "Pertanyaan", "Jawaban", "Skor", "Aksi"];

const Question = () => {
  const { addResponse } = useResponses();
  const { accessToken, setAccessToken, user, setUser } = useAuth();

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

  const [selectedQuestion, setSelectedQuestion] = React.useState(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const quesioners = async () => {
    const response = await getQuesioners();
    return response.data.filter(
      (item) =>
        item.title === "Tingkat Pengetahuan Gizi Seimbang" ||
        item.title === "Kebiasaan Sehari-hari Anak"
    );
  };

  const questionById = async (id) => {
    const response = await getQuestionsByQuesionerIDWithoutPagination(id);
    return response.data;
  };

  // const { data: quesioner } = useSWR("quesioners", quesioners);
  const [quesioner, setQuesioner] = React.useState([]);
  const { data: question, isLoading: questionLoading } = useSWR(
    selectedQuestion ? ["quesions", selectedQuestion] : null,
    ([, id]) => questionById(id)
  );

  const handleOpenModal = (id) => {
    updateToken();
    HSOverlay.open(`#hs-vertically-centered-modal-${id}`);
  };

  const handleCloseModal = (id) => {
    HSOverlay.close(`#hs-vertically-centered-modal-${id}`);
    setCurrentIndex(0);
  };

  React.useEffect(() => {
    HSStaticMethods.autoInit();
    HSOverlay.autoInit();
  }, [quesioner, selectedQuestion, question]);

  const { values, handleSubmit, setFieldValue } = useFormik({
    initialValues: {
      answers: [
        {
          questionId: 0,
          responseId: 0,
          score: 0,
          boolean_value: false,
          text_value: "",
          option_id: 0,
          scaleValue: 0,
        },
      ],
    },
    onSubmit: async (values) => {
      await addResponse(selectedQuestion, values, accessToken);
    },
  });

  const [answeredStatus, setAnsweredStatus] = React.useState({});

  const [page, setPage] = React.useState({});
  const [limit, setLimit] = React.useState({});
  const [keyword, setKeyword] = React.useState({});
  const [query, setQuery] = React.useState({});
  const [responeQuesioner, setResponseQuesioner] = React.useState([]);
  const [loadingQuesioner, setLoadingQuesioner] = React.useState({});

  React.useEffect(() => {
    const fetchResponse = async () => {
      try {
        const { data } = await getResponseQuesioner(accessToken);
        setResponseQuesioner(data);
        setQuesioner(data);
      } catch (err) {}
    };
    if (quesioner && accessToken) {
      fetchResponse();
    }
  }, []);

  let content;
  if (!quesioner) {
    content = (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-white">
        <div className="expand-circle circle-1"></div>
        <div className="expand-circle circle-2"></div>
        <div className="expand-circle circle-3"></div>
      </div>
    );
  } else {
    content = quesioner.map((item) => {
      if (responeQuesioner.length > 0) {
        const response = responeQuesioner.map((val) => val.Response[0]);
        const ans = response.find((val) =>
          val ? val.quisionerId === item.id : undefined
        );
        console.log({ ans });
      }
      return (
        <div
          key={item.id}
          className="flex items-center justify-between bg-white h-max w-full border border-obito-grey rounded-lg p-5"
        >
          <h1 className="font-semibold text-base">{item.title}</h1>
          <div className="hs-tooltip inline-block">
            <span
              className={`hs-tooltip-toggle inline-flex justify-center items-center size-11 rounded-full border-4 border-blue-100 bg-blue-200 text-blue-800 ${
                item && item.Response.length > 0
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              onClick={() => {
                if (item.Response.length === 0) {
                  handleOpenModal(item.id);
                  setSelectedQuestion(item.id);
                }
              }}
              disabled={item && item.Response.length > 0}
            >
              <IoPlay />
            </span>
            <span
              className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-2xs"
              role="tooltip"
            >
              {item && item.Response.length > 0
                ? "Anda sudah menjawab kuisioner"
                : "Mulai kuisioner"}
            </span>
          </div>

          <div
            id={`hs-vertically-centered-modal-${item.id}`}
            className="hs-overlay [--overlay-backdrop:static] hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto pointer-events-none"
            aria-labelledby={`hs-vertically-centered-modal-${item.id}-label`}
          >
            <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto min-h-[calc(100%-56px)] flex items-center">
              <div className="w-full flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl pointer-events-auto">
                <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200">
                  <h3
                    id={`hs-vertically-centered-modal-${item.id}-label`}
                    className="font-bold text-gray-800 text-sm"
                  >
                    {item.description}
                  </h3>
                  <button
                    type="button"
                    className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
                    aria-label="Close"
                    onClick={() => handleCloseModal(item.id)}
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
                <div className="p-4 overflow-y-auto flex flex-col space-y-5">
                  {questionLoading || !question ? (
                    <div>Loading...</div>
                  ) : (
                    <form
                      onSubmit={handleSubmit}
                      className="flex flex-col space-y-5"
                    >
                      <div
                        className="flex w-full h-4 bg-gray-200 rounded-full overflow-hidden"
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <div
                          className="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition duration-500"
                          style={{
                            width:
                              question && question.length > 0
                                ? `${
                                    ((currentIndex + 1) / question.length) * 100
                                  }%`
                                : "0%",
                          }}
                        >
                          {question && question.length > 0
                            ? `${Math.round(
                                ((currentIndex + 1) / question.length) * 100
                              )}%`
                            : "0%"}
                        </div>
                      </div>
                      <div className="flex font-semibold items-start gap-x-2">
                        <h1>{currentIndex + 1}. </h1>
                        <span className="font-semibold">
                          {question?.[currentIndex]?.title}
                        </span>
                      </div>
                      {question?.[currentIndex]?.options?.map((opt) => (
                        <button
                          type="button"
                          key={opt.id}
                          className="bg-white/80 border border-gray-200 rounded-lg p-4 text-left hover:bg-blue-100"
                          onClick={() => {
                            const currentQuestion = question?.[currentIndex];
                            const newAnswers = [...values.answers];

                            if (currentQuestion.type === "MULTIPLE_CHOICE") {
                              newAnswers[currentIndex] = {
                                questionId: parseInt(currentQuestion.id),
                                option_id: opt.id,
                                score: opt.score,
                                text_value: opt.title,
                              };
                            } else if (currentQuestion.type === "BOOLEAN") {
                              newAnswers[currentIndex] = {
                                questionId: parseInt(currentQuestion.id),
                                option_id: opt.id,
                                score: opt.score,
                                boolean_value: Boolean(opt.score),
                              };
                            } else if (currentQuestion.type === "SCALE") {
                              newAnswers[currentIndex] = {
                                questionId: parseInt(currentQuestion.id),
                                option_id: opt.id,
                                score: opt.score,
                                scaleValue: opt.score,
                              };
                            }

                            setFieldValue("answers", newAnswers);

                            if (currentIndex < question?.length - 1) {
                              setCurrentIndex((idx) => idx + 1);
                            }
                          }}
                        >
                          {opt.title}
                        </button>
                      ))}
                    </form>
                  )}
                </div>
                <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t border-gray-200">
                  {question && currentIndex === question?.length - 1 && (
                    <button
                      type="submit"
                      className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                      disabled={
                        values.answers.filter((a) => a && a.option_id)
                          .length !== question?.length
                      }
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  console.log({ quesioner });

  return (
    <>
      <div className="flex flex-col space-y-5">{content}</div>
      <div>
        {quesioner.length > 0 &&
          quesioner?.map((qst) => {
            return (
              <div key={qst.id}>
                <h1 className="mt-10 mb-5 font-semibold">
                  Riwayat Jawaban {qst.title}
                </h1>
                {qst.Response.length > 0 ? (
                  qst.Response.map((r, i) => {
                    return (
                      <div className="flex flex-col">
                        <div className="-m-1.5 overflow-x-auto">
                          <div className="p-1.5 min-w-full inline-block align-middle">
                            <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                              <div className="py-3 px-4">
                                {/* <form
                              onSubmit={searchData}
                              className="relative max-w-xs w-full"
                            >
                              <label htmlFor="search" className="sr-only">
                                Search
                              </label>
                              <input
                                type="text"
                                value={query}
                                name="search_query"
                                id="search_query"
                                onChange={(e) => setQuery(e.target.value)}
                                className="py-1.5 sm:py-2 px-3 ps-9 block w-full border border-obito-grey shadow-2xs rounded-lg sm:text-sm focus:z-10 focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                                placeholder={placeholder}
                              />
                              <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                                <svg
                                  className="size-4 text-gray-400"
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
                                  <circle cx="11" cy="11" r="8"></circle>
                                  <path d="m21 21-4.3-4.3"></path>
                                </svg>
                              </div>
                              <button
                                type="submit"
                                className="bg-blue-800 text-white px-2.5 py-1.5 text-sm rounded-md absolute top-1/2 -translate-y-1/2 right-1"
                              >
                                Cari
                              </button>
                            </form> */}
                              </div>
                              <div className="overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      {TABLE_HEAD.map((head) => (
                                        <th
                                          key={head}
                                          scope="col"
                                          className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                                        >
                                          {head}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {qst.questions.map((q, i) => {
                                      const answer = r.answers.find(
                                        (ans) => ans.questionId === q.id
                                      );

                                      return (
                                        <tr key={q.id}>
                                          <td className="px-6 py-4 capitalize whitespace-nowrap text-sm font-medium text-gray-800">
                                            {i + 1}
                                          </td>
                                          <td className="px-6 py-4 capitalize whitespace-pre-wrap text-sm font-medium text-gray-800">
                                            {q?.title}
                                          </td>
                                          <td className="px-6 py-4 capitalize whitespace-nowrap text-sm font-medium text-gray-800">
                                            {q.type === "SCALE"
                                              ? answer?.scaleValue ?? "-"
                                              : answer?.text_value ?? "-"}
                                          </td>
                                          <td className="px-6 py-4 capitalize whitespace-nowrap text-sm font-medium text-gray-800 text-center">
                                            {answer ? answer.score : "-"}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                              type="button"
                                              className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                                              aria-controls={`hs-edit-response-modal-${answer.id}`}
                                              data-hs-overlay={`#hs-edit-response-modal-${answer.id}`}
                                            >
                                              Edit
                                            </button>
                                            <FormEditResponse
                                              answer={answer}
                                              question={q}
                                            />
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <h1>Tidak ada jawaban</h1>
                )}
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Question;
