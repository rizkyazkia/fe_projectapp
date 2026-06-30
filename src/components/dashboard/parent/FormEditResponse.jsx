import { useFormik } from "formik";
import { HSStaticMethods } from "preline/preline";
import React from "react";
import { useResponses } from "../../../hooks/parent/useResponses";

const FormEditResponse = ({ answer, question }) => {
  React.useEffect(() => {
    HSStaticMethods.autoInit();
  }, []);

  const { updateResponse } = useResponses();

  const { values, handleSubmit, setFieldValue } = useFormik({
    initialValues: {
      option_id: answer.option_id,
      text_value: answer.text_value,
      boolean_value: answer.boolean_value,
      scaleValue: answer.scaleValue,
      score: answer.score,
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      const opt = question.options.find((o) => o.id === values.option_id);

      const payload = {
        option_id: opt.id,
        score: opt.score,
        boolean_value:
          question.type === "BOOLEAN" ? Boolean(opt.score) : undefined,
        scaleValue: question.type === "SCALE" ? opt.score : undefined,
      };

      await updateResponse(answer.id, payload);
    },
  });

  return (
    <div
      id={`hs-edit-response-modal-${answer.id}`}
      className="hs-overlay [--overlay-backdrop:static] hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto pointer-events-none"
      aria-labelledby={`hs-edit-response-modal-${answer.id}-label`}
    >
      <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-xl sm:w-full m-3 sm:mx-auto min-h-[calc(100%-56px)] flex items-center">
        <div className="w-full flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl pointer-events-auto">
          <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200">
            <h3
              id={`hs-edit-response-modal-${answer.id}-label`}
              className="font-bold text-gray-800"
            >
              Update jawaban
            </h3>
            <button
              type="button"
              className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
              aria-label="Close"
              data-hs-overlay={`#hs-edit-response-modal-${answer.id}`}
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
          <div className="p-4 max-w-xl wrap-break-word">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col space-y-4">
                <h1 className="font-semibold text-base whitespace-break-spaces">
                  1. {question.title}
                </h1>
                <div className="grid space-y-4">
                  {question.options.map((opt, index) => {
                    return (
                      <label
                        key={opt.id}
                        htmlFor="hs-vertical-radio-in-form"
                        className="w-full flex p-3 bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <input
                          type="radio"
                          name="hs-vertical-radio-in-form"
                          className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                          id="hs-vertical-radio-in-form"
                          value={opt.id}
                          checked={values.option_id === opt.id}
                          onChange={() => setFieldValue("option_id", opt.id)}
                        />
                        <span className="text-sm text-gray-500 ms-3">
                          {opt.title}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </form>
          </div>
          <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t border-gray-200">
            <button
              type="submit"
              onClick={handleSubmit}
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormEditResponse;
