import { useFormik } from "formik";
import { jwtDecode } from "jwt-decode";
import { HSStaticMethods } from "preline/preline";
import React from "react";
import { IoArrowBackOutline, IoCheckboxOutline, IoPlay } from "react-icons/io5";
import useSWR from "swr";
import FormEditResponse from "../../../components/dashboard/parent/FormEditResponse";
import { useAuth } from "../../../hooks/auth/useAuth";
import { useResponses } from "../../../hooks/parent/useResponses";
import { token } from "../../../lib/auth/authAPI";
import {
  checkingAnsweredQuesioner,
  getResponseQuesioner,
} from "../../../lib/parent/responseAPI";
import {
  getQuesioners,
  getQuestionsByQuesionerIDWithoutPagination,
} from "../../../lib/quesionersAPI";

const TABLE_HEAD = ["No", "Pertanyaan", "Jawaban", "Skor", "Aksi"];

const createEmptyAnswer = (question) => ({
  questionId: Number(question.id),
  responseId: 0,
  score: 0,
  boolean_value: false,
  text_value: "",
  option_id: 0,
  scaleValue: 0,
});

const Question = () => {
  const { addResponse } = useResponses();
  const { accessToken, setAccessToken, user, setUser } = useAuth();

  const [selectedQuestion, setSelectedQuestion] = React.useState(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [answeredStatus, setAnsweredStatus] = React.useState({});
  const [responseQuesioner, setResponseQuesioner] = React.useState({});
  const [historyRefreshKey, setHistoryRefreshKey] = React.useState(0);
  const [submitError, setSubmitError] = React.useState("");

  const [page, setPage] = React.useState({});
  const [limit] = React.useState({});
  const [keyword] = React.useState({});

  const initializedQuizRef = React.useRef(null);

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

  const quesioners = async () => {
    const response = await getQuesioners();

    return response.data.filter(
      (item) =>
        item.title === "Tingkat Pengetahuan Gizi Seimbang" ||
        item.title === "Kebiasaan Sehari-hari Anak",
    );
  };

  const questionById = async (id) => {
    const response = await getQuestionsByQuesionerIDWithoutPagination(id);
    return response.data;
  };

  const { data: quesioner } = useSWR("quesioners", quesioners);

  const {
    data: question,
    isLoading: questionLoading,
    error: questionError,
  } = useSWR(
    selectedQuestion ? ["questions", selectedQuestion] : null,
    ([, id]) => questionById(id),
  );

  const { values, handleSubmit, setFieldValue, resetForm, isSubmitting } =
    useFormik({
      initialValues: {
        answers: [],
      },
      onSubmit: async (formValues) => {
        const activeToken = await getActiveToken();
        if (!selectedQuestion) return;

        try {
          setSubmitError("");

          await addResponse(
            selectedQuestion,
            formValues,
            activeToken,
          );

          setAnsweredStatus((prev) => ({
            ...prev,
            [selectedQuestion]: true,
          }));

          setHistoryRefreshKey((prev) => prev + 1);
          setSelectedQuestion(null);
          setCurrentIndex(0);
        } catch (error) {
          console.error("Gagal mengirim jawaban:", error);
          setSubmitError("Jawaban gagal dikirim. Silakan coba kembali.");
        }
      },
    });

  React.useEffect(() => {
    if (!selectedQuestion || !question?.length) return;

    if (initializedQuizRef.current !== selectedQuestion) {
      resetForm({
        values: {
          answers: question.map((item) => createEmptyAnswer(item)),
        },
      });

      initializedQuizRef.current = selectedQuestion;
    }
  }, [selectedQuestion, question, resetForm]);

  React.useEffect(() => {
    if (!selectedQuestion) {
      initializedQuizRef.current = null;
    }
  }, [selectedQuestion]);

  React.useEffect(() => {
    if (quesioner && accessToken) {
      Promise.all(
        quesioner.map(async (q) => {
          try {
            const activeToken = await getActiveToken();
            const data = await checkingAnsweredQuesioner(q.id, activeToken);

            return {
              id: q.id,
              answered: data.answered,
            };
          } catch {
            return {
              id: q.id,
              answered: false,
            };
          }
        }),
      ).then((results) => {
        const statusObj = {};

        results.forEach((result) => {
          statusObj[result.id] = result.answered;
        });

        setAnsweredStatus(statusObj);
      });
    }
  }, [quesioner, accessToken, historyRefreshKey]);

  React.useEffect(() => {
    if (quesioner && accessToken) {
      Promise.all(
        quesioner.map(async (q) => {
          const activeToken = await getActiveToken();
          const response = await getResponseQuesioner(
            q.id,
            activeToken,
            keyword[q.id] || "",
            page[q.id] || 0,
            limit[q.id] || 10,
          );

          return {
            id: q.id,
            data: response.data,
          };
        }),
      ).then((results) => {
        const responseObject = {};

        results.forEach((result) => {
          responseObject[result.id] = result.data;
        });

        setResponseQuesioner(responseObject);
      });
    }
  }, [quesioner, accessToken, page, limit, keyword, historyRefreshKey]);

  React.useEffect(() => {
    HSStaticMethods.autoInit();
  }, [responseQuesioner]);

  const handleStartQuiz = async (id) => {
    try {
      await getActiveToken();
    } catch (error) {
      console.error("Gagal memperbarui token:", error);
    }

    setSubmitError("");
    setSelectedQuestion(id);
    setCurrentIndex(0);

    resetForm({
      values: {
        answers: [],
      },
    });
  };

  const handleBackToList = () => {
    setSelectedQuestion(null);
    setCurrentIndex(0);
    setSubmitError("");
  };

  const isAnswered = (index) => {
    const answer = values.answers?.[index];

    return (
      answer &&
      answer.option_id !== undefined &&
      answer.option_id !== null &&
      Number(answer.option_id) !== 0
    );
  };

  const handleSelectAnswer = (option) => {
    const currentQuestion = question?.[currentIndex];

    if (!currentQuestion) return;

    const newAnswers = [...values.answers];

    newAnswers[currentIndex] = {
      ...createEmptyAnswer(currentQuestion),
      questionId: Number(currentQuestion.id),
      option_id: Number(option.id),
      score: Number(option.score ?? 0),
      boolean_value:
        currentQuestion.type === "BOOLEAN"
          ? Boolean(Number(option.score))
          : false,
      scaleValue:
        currentQuestion.type === "SCALE" ? Number(option.score ?? 0) : 0,
    };

    setFieldValue("answers", newAnswers);
    setSubmitError("");
  };

  const activeQuesioner = quesioner?.find(
    (item) => Number(item.id) === Number(selectedQuestion),
  );

  const answeredCount =
    question?.filter((_, index) => isAnswered(index)).length || 0;

  if (selectedQuestion) {
    if (questionLoading || !activeQuesioner) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
          <div className="expand-circle circle-1"></div>
          <div className="expand-circle circle-2"></div>
          <div className="expand-circle circle-3"></div>
        </div>
      );
    }

    if (questionError || !question) {
      return (
        <div className="min-h-screen bg-slate-100 p-8">
          <div className="mx-auto max-w-xl rounded-xl bg-white p-8 text-center shadow-sm">
            <h1 className="text-lg font-semibold text-red-600">
              Gagal memuat pertanyaan.
            </h1>

            <button
              type="button"
              onClick={handleBackToList}
              className="mt-5 rounded-md border border-blue-700 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
            >
              Kembali
            </button>
          </div>
        </div>
      );
    }

    if (question.length === 0) {
      return (
        <div className="min-h-screen bg-slate-100 p-8">
          <div className="mx-auto max-w-xl rounded-xl bg-white p-8 text-center shadow-sm">
            <h1 className="text-lg font-semibold text-slate-700">
              Belum ada pertanyaan pada kuisioner ini.
            </h1>

            <button
              type="button"
              onClick={handleBackToList}
              className="mt-5 rounded-md border border-blue-700 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
            >
              Kembali
            </button>
          </div>
        </div>
      );
    }

    const currentQuestion = question[currentIndex];

    return (
      <div className="min-h-fit bg-white">
        <div className="flex items-center gap-3 px-5 py-5 md:px-8">
          <div className="grid size-11 place-items-center rounded bg-blue-700 text-white">
            <IoCheckboxOutline className="size-6" />
          </div>

          <h1 className="text-xl font-bold text-slate-700 md:text-2xl">
            {activeQuesioner.title}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_335px]">
          <main className="bg-white p-4 md:p-6">
            <div className="rounded-xl bg-white p-5 shadow-sm md:p-7">
              <button
                type="button"
                onClick={handleBackToList}
                className="inline-flex items-center gap-2 rounded-md border border-blue-700 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                <IoArrowBackOutline />
                Back
              </button>

              <div className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-[105px_minmax(0,1fr)]">
                <aside className="h-fit border border-blue-200 bg-blue-50 p-3 text-xs text-slate-600">
                  <p className="font-bold text-slate-700">
                    Question {currentIndex + 1}
                  </p>

                  <p className="mt-2">
                    {isAnswered(currentIndex) ? "Answered" : "Not yet answered"}
                  </p>
                </aside>

                <section className="rounded-lg border border-blue-200 bg-blue-50 p-5 md:p-6">
                  <p className="text-base font-medium leading-relaxed text-slate-800">
                    {currentQuestion?.title}
                  </p>

                  <div className="mt-3 space-y-1">
                    {currentQuestion?.options?.map((option, optionIndex) => {
                      const selected =
                        Number(values.answers?.[currentIndex]?.option_id) ===
                        Number(option.id);

                      return (
                        <label
                          key={option.id}
                          className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-1 transition ${
                            selected ? "" : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${currentQuestion.id}`}
                            checked={selected}
                            onChange={() => handleSelectAnswer(option)}
                            className="size-5 accent-blue-700"
                          />

                          <span className="text-sm text-slate-800 md:text-base">
                            {option.title}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </section>
              </div>

              {submitError && (
                <div className="mt-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {submitError}
                </div>
              )}

              <div className="mt-7 flex items-center justify-between">
                {currentIndex > 0 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => prev - 1)}
                    className="rounded-md border border-blue-700 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                  >
                    Previous page
                  </button>
                ) : (
                  <span />
                )}

                {currentIndex < question.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                    className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
                  >
                    Next page
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (answeredCount !== question.length) {
                        setSubmitError(
                          `Masih ada ${
                            question.length - answeredCount
                          } soal yang belum dijawab.`,
                        );
                        return;
                      }

                      handleSubmit();
                    }}
                    disabled={isSubmitting}
                    className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? "Mengirim..." : "Submit"}
                  </button>
                )}
              </div>
            </div>
          </main>

          <aside className="border-t border-slate-200 bg-white p-5 lg:border-l lg:border-t-0 md:p-6">
            <h2 className="text-lg font-bold text-slate-700">
              Quiz navigation
            </h2>

            <div className="mt-4 flex max-w-[290px] flex-wrap gap-2">
              {question.map((_, index) => {
                const isCurrentQuestion = currentIndex === index;
                const questionAnswered = isAnswered(index);

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    className={`grid size-8 place-items-center border text-sm transition ${
                      isCurrentQuestion
                        ? "border-blue-800 bg-blue-700 text-white ring-1 ring-blue-800"
                        : questionAnswered
                          ? "border-blue-600 bg-blue-100 text-blue-800"
                          : "border-slate-400 bg-white text-slate-700 hover:border-blue-500 hover:bg-blue-50"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                if (answeredCount !== question.length) {
                  setSubmitError(
                    `Masih ada ${
                      question.length - answeredCount
                    } soal yang belum dijawab.`,
                  );
                  return;
                }

                handleSubmit();
              }}
              className="mt-4 text-sm font-medium text-blue-700 hover:text-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Finish attempt ...
            </button>

            <p className="mt-5 text-xs text-slate-500">
              {answeredCount} dari {question.length} soal telah dijawab.
            </p>
          </aside>
        </div>
      </div>
    );
  }

  let content;

  if (!quesioner) {
    content = (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="expand-circle circle-1"></div>
        <div className="expand-circle circle-2"></div>
        <div className="expand-circle circle-3"></div>
      </div>
    );
  } else {
    content = quesioner.map((item) => (
      <div
        key={item.id}
        className="flex items-center justify-between rounded-lg border border-obito-grey bg-white p-5"
      >
        <h1 className="text-base font-semibold">{item.title}</h1>

        <div className="hs-tooltip inline-block">
          <button
            type="button"
            disabled={answeredStatus[item.id]}
            onClick={() => handleStartQuiz(item.id)}
            className={`hs-tooltip-toggle inline-flex size-11 items-center justify-center rounded-full border-4 border-blue-100 bg-blue-200 text-blue-800 ${
              answeredStatus[item.id]
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer hover:bg-blue-300"
            }`}
          >
            <IoPlay />
          </button>

          <span
            className="hs-tooltip-content hs-tooltip-shown:visible hs-tooltip-shown:opacity-100 invisible absolute z-10 inline-block rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-2xs transition-opacity"
            role="tooltip"
          >
            {answeredStatus[item.id]
              ? "Anda sudah menjawab kuisioner"
              : "Mulai kuisioner"}
          </span>
        </div>
      </div>
    ));
  }

  return (
    <>
      <div className="flex flex-col space-y-5">{content}</div>

      <div>
        {quesioner?.map((qst) => {
          const currentResponse = responseQuesioner[qst.id];

          return answeredStatus[qst.id] ? (
            <div key={qst.id}>
              <h1 className="mb-5 mt-10 font-semibold">
                Riwayat Jawaban {qst.title}
              </h1>

              {currentResponse?.answers?.length > 0 ? (
                <div className="flex flex-col">
                  <div className="-m-1.5 overflow-x-auto">
                    <div className="inline-block min-w-full p-1.5 align-middle">
                      <div className="divide-y divide-gray-200 rounded-lg border border-gray-200">
                        <div className="overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                {TABLE_HEAD.map((head) => (
                                  <th
                                    key={head}
                                    scope="col"
                                    className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500"
                                  >
                                    {head}
                                  </th>
                                ))}
                              </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                              {(currentResponse?.questions || []).map(
                                (q, index) => {
                                  const answer = (
                                    currentResponse?.answers || []
                                  ).find(
                                    (ans) =>
                                      Number(ans.questionId) === Number(q.id),
                                  );

                                  const jawaban = (() => {
                                    if (!answer) return "-";

                                    const option = q.options?.find(
                                      (item) =>
                                        Number(item.id) ===
                                        Number(answer.option_id),
                                    );

                                    return option?.title ?? "-";
                                  })();

                                  return (
                                    <tr key={q.id}>
                                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium capitalize text-gray-800">
                                        {index +
                                          1 +
                                          (page[qst.id] || 0) *
                                            (limit[qst.id] || 10)}
                                      </td>

                                      <td className="whitespace-pre-wrap px-6 py-4 text-sm font-medium capitalize text-gray-800">
                                        {q?.title}
                                      </td>

                                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium capitalize text-gray-800">
                                        {jawaban}
                                      </td>

                                      <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium capitalize text-gray-800">
                                        {answer ? answer.score : "-"}
                                      </td>

                                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                        {answer ? (
                                          <>
                                            <button
                                              type="button"
                                              className="inline-flex items-center gap-x-2 rounded-lg border border-transparent text-sm font-semibold text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:pointer-events-none disabled:opacity-50"
                                              aria-controls={`hs-edit-response-modal-${answer.id}`}
                                              data-hs-overlay={`#hs-edit-response-modal-${answer.id}`}
                                            >
                                              Edit
                                            </button>

                                            <FormEditResponse
                                              answer={answer}
                                              question={q}
                                            />
                                          </>
                                        ) : (
                                          <span className="text-sm text-gray-400">
                                            -
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                },
                              )}
                            </tbody>
                          </table>

                          {currentResponse?.totalPage > 1 && (
                            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
                              <span className="text-sm text-gray-600">
                                Halaman {(page[qst.id] || 0) + 1} dari{" "}
                                {currentResponse?.totalPage}
                              </span>

                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  disabled={
                                    page[qst.id] === 0 ||
                                    page[qst.id] === undefined
                                  }
                                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                  onClick={() =>
                                    setPage((prev) => ({
                                      ...prev,
                                      [qst.id]: Math.max(
                                        (page[qst.id] || 0) - 1,
                                        0,
                                      ),
                                    }))
                                  }
                                >
                                  Prev
                                </button>

                                <button
                                  type="button"
                                  disabled={
                                    (page[qst.id] || 0) + 1 >=
                                    (currentResponse?.totalPage || 1)
                                  }
                                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                  onClick={() =>
                                    setPage((prev) => ({
                                      ...prev,
                                      [qst.id]: (page[qst.id] || 0) + 1,
                                    }))
                                  }
                                >
                                  Next
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <h1>Tidak ada jawaban</h1>
              )}
            </div>
          ) : null;
        })}
      </div>
    </>
  );
};

export default Question;
