import React from "react";
import { MdArrowRightAlt } from "react-icons/md";
import { HiTrash } from "react-icons/hi";
import { FaPlus } from "react-icons/fa6";
import { HSStaticMethods } from "preline/preline";
import { useFormik } from "formik";
import { useQuesioner } from "../../../hooks/useQuesioner";

const FormEditQuestion = ({ existingData }) => {
  const { updateQuesioner } = useQuesioner();

  React.useEffect(() => {
    if (!existingData) return;

    const id = "type";
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
  }, [existingData]);

  const { values, handleBlur, handleChange, handleSubmit, setFieldValue } =
    useFormik({
      initialValues: {
        title: existingData?.title,
        type: existingData?.type,
        options: existingData?.options || [{ title: "", score: "" }],
      },
      enableReinitialize: true,
      onSubmit: async (values) => {
        const changeToINT = {
          ...values,
          options: values.options.map(({ title, score }) => ({
            title,
            score: parseInt(score, 10),
          })),
        };

        await updateQuesioner(existingData?.id, changeToINT);
      },
    });

  const calculateQuestionNumber = (index) => {
    const group = Math.floor(index / 20) + 1;
    const number = index % 20;
    return `${group}.${number}`;
  };

  const handleOptionChange = (index, field, value) => {
    setFieldValue(
      "options",
      values.options.map((option, i) =>
        i === index ? { ...option, [field]: value } : option,
      ),
    );
  };

  const handleAddOption = () => {
    const maxId = values.options.reduce(
      (max, option) => Math.max(max, option.id || 0),
      0,
    );

    setFieldValue("options", [
      ...values.options,
      { id: maxId + 1, title: "", score: "" },
    ]);
  };

  const handleRemoveOption = (id) => {
    setFieldValue(
      "options",
      values.options.filter((option) => option.id !== id),
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-[auto_1fr] gap-4 items-center p-4">
        <div className="flex items-center col-start-1 col-end-1 w-min">
          <h1 className="flex items-center gap-2 w-max">
            Q {calculateQuestionNumber(existingData?.id)}{" "}
            <MdArrowRightAlt size={20} />
          </h1>
        </div>
        <div className="col-start-2 col-end-2">
          <textarea
            id="title"
            name="title"
            className="py-2 px-3 sm:py-3 sm:px-4 block w-full border border-gray-200 rounded-lg sm:text-sm focus:border-blue-900 focus:ring-blue-900 disabled:opacity-50 disabled:pointer-events-none"
            rows="2"
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
          ></textarea>
        </div>
        <div className="col-start-3 col-end-3">
          <label
            htmlFor="type"
            className="block text-sm font-medium mb-2"
          >
            Tipe Pertanyaan
          </label>
          <select
            id="type"
            name="type"
            data-hs-select='{
                    "placeholder": "Pilih Tipe Pertanyaan...",
                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                    "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800",
                    "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                    "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                    "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                    "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                  }'
            className="hidden"
            value={values.type}
            onChange={(event) => setFieldValue("type", event.target.value)}
          >
            <option value="SCALE">SCALE</option>
            <option value="BOOLEAN">BOOLEAN</option>
          </select>
        </div>
      </div>
      <div className="border-b border-gray-200">
        <div className="grid grid-cols-[auto_1fr] gap-4 items-center p-4">
          {values?.options.map((opt, index) => (
            <div key={index} className="col-start-1 col-end-3">
              <div className="flex items-center gap-2">
                <div className="w-full">
                  <label
                    htmlFor="opsi"
                    className="block text-sm font-medium mb-2"
                  >
                    Opsi {index + 1}
                  </label>
                  <input
                    type="text"
                    id="opsi"
                    name="opsi"
                    className="py-2.5 sm:py-3 px-4 block w-full border border-obito-grey rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                    value={opt.title}
                    onChange={(e) =>
                      handleOptionChange(index, "title", e.target.value)
                    }
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="skor"
                    className="block text-sm font-medium mb-2"
                  >
                    Skor
                  </label>
                  <input
                    type="number"
                    id="skor"
                    name="skor"
                    className="py-2.5 sm:py-3 px-4 block w-full border border-obito-grey rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                    value={opt.score}
                    onChange={(e) =>
                      handleOptionChange(index, "score", e.target.value)
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveOption(opt.id)}
                  className="inline-flex w-[14%] self-end justify-center items-center size-[46px] rounded-lg border-4 border-red-100 bg-red-200"
                >
                  <HiTrash size={16} className="text-red-900" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleAddOption}
          className="p-2 m-4 flex items-center gap-1 hover:bg-blue-100 rounded-lg"
        >
          <FaPlus size={16} className="text-blue-900" />
          <span className="text-sm font-medium text-blue-900">Opsi</span>
        </button>
        <button
          type="submit"
          className="me-4 py-3 px-4 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-transparent bg-blue-800 text-white hover:bg-blue-900 focus:outline-hidden focus:bg-blue-900 disabled:opacity-50 disabled:pointer-events-none"
        >
          Update
        </button>
      </div>
    </form>
  );
};

export default FormEditQuestion;
