// import { getCurrentDate } from "@/lib/utils";
import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

export const Signature = ({ imgUrl, setImgUrl }) => {
  const letterRef = useRef(null);
  const imgRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const contentEditRef = useRef(null);
  const [contentState, setContentState] = useState([
    {
      type: "bold",
      value: false,
    },
    {
      type: "italic",
      value: false,
    },
    {
      type: "insertOrderedList",
      value: false,
    },
  ]);

  return (
    <section className="bg-white py-4 rounded-md">
      <header className="text-xl font-bold">
        <h1>Tanda tangan</h1>
      </header>
      <footer className="flex flex-col mt-2 gap-4 z-20">
        <div>
          {!imgUrl && (
            <div className="relative w-[500px] h-[250px]">
              <SignatureCanvas
                penColor="black"
                canvasProps={{
                  width: 500,
                  height: 250,
                  className: "sigCanvas border-2 rounded-lg ",
                }}
                ref={letterRef}
              />
              <div className="absolute bottom-2 right-2 flex gap-2">
                <button
                  type="button"
                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-600 focus:outline-hidden focus:bg-red-600 disabled:opacity-50 disabled:pointer-events-none"
                  onClick={() => {
                    letterRef.current.clear();
                    setImgUrl(null);
                  }}
                >
                  Clear
                </button>
                <button
                  type="button"
                  className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                  onClick={() => {
                    const url = letterRef.current.toDataURL("image/png");
                    console.log({ imageUrl: url });
                    setImgUrl(url);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          )}
          {imgUrl && (
            <img
              src={imgUrl}
              className="size-40 object-contain object-center border"
            />
          )}
        </div>
      </footer>
    </section>
  );
};
