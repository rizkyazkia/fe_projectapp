import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorContent, useCurrentEditor, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { jwtDecode } from "jwt-decode";
import React from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../hooks/auth/useAuth";
import { token } from "../../../lib/auth/authAPI";
import { createInternvetion } from "../../../lib/recommendationAPI";
import { Signature } from "./Signature";
import { useNavigate } from "react-router-dom";

export const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="bg-white  rounded-xl overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
      <div className="control-group relative">
        <div className="button-group sticky top-0 bg-white flex align-middle  border-b border-gray-200 p-2 w-full dark:bg-neutral-900 dark:border-neutral-700 gap-2 ">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 p-1 ${
              editor.isActive("bold") ? "is-active" : ""
            }`}
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
              <path d="M14 12a4 4 0 0 0 0-8H6v8"></path>
              <path d="M15 20a4 4 0 0 0 0-8H6v8Z"></path>
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 p-1 ${
              editor.isActive("italic") ? "is-active" : ""
            }`}
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
              <line x1="19" x2="10" y1="4" y2="4"></line>
              <line x1="14" x2="5" y1="20" y2="20"></line>
              <line x1="15" x2="9" y1="4" y2="20"></line>
            </svg>
          </button>

          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 p-1 ${
              editor.isActive("paragraph") ? "is-active" : ""
            }`}
          >
            P
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 p-1 ${
              editor.isActive("heading", { level: 1 }) ? "is-active" : ""
            }`}
          >
            H1
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 p-1 ${
              editor.isActive("heading", { level: 2 }) ? "is-active" : ""
            }`}
          >
            H2
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 p-1 ${
              editor.isActive("heading", { level: 3 }) ? "is-active" : ""
            }`}
          >
            H3
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            className={`size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 p-1 ${
              editor.isActive("heading", { level: 4 }) ? "is-active" : ""
            }`}
          >
            H4
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 5 }).run()
            }
            className={`size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 p-1 ${
              editor.isActive("heading", { level: 5 }) ? "is-active" : ""
            }`}
          >
            H5
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 6 }).run()
            }
            className={`size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 p-1 ${
              editor.isActive("heading", { level: 6 }) ? "is-active" : ""
            }`}
          >
            H6
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 p-1 ${
              editor.isActive("bulletList") ? "is-active" : ""
            }`}
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
              <line x1="8" x2="21" y1="6" y2="6"></line>
              <line x1="8" x2="21" y1="12" y2="12"></line>
              <line x1="8" x2="21" y1="18" y2="18"></line>
              <line x1="3" x2="3.01" y1="6" y2="6"></line>
              <line x1="3" x2="3.01" y1="12" y2="12"></line>
              <line x1="3" x2="3.01" y1="18" y2="18"></line>
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 p-1 ${
              editor.isActive("orderedList") ? "is-active" : ""
            }`}
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
              <line x1="10" x2="21" y1="6" y2="6"></line>
              <line x1="10" x2="21" y1="12" y2="12"></line>
              <line x1="10" x2="21" y1="18" y2="18"></line>
              <path d="M4 6h1v4"></path>
              <path d="M4 10h2"></path>
              <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Editor({
  selectedRecommendationData,
  imgUrl,
  setImgUrl,
  children,
}) {
  const { editor } = useCurrentEditor();
  const navigate = useNavigate();

  const { accessToken, setAccessToken, user, setUser } = useAuth();

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

  const handleSubmit = async () => {
    if (!selectedRecommendationData) {
      return;
    }
    const { id } = selectedRecommendationData;

    const mappedContent = {
      content: editor.getJSON(),
      signature: imgUrl,
    };

    const jsonContent = JSON.stringify(mappedContent);

    try {
      const activeToken = await getActiveToken();
      const data = await createInternvetion(
        {
          recommendationId: id,
          content: jsonContent,
          forType: "SCHOOL",
          notes: null,
        },
        activeToken
      );
      toast.success("Berhasil membuat intervensi", {
        onClose: () => {
          navigate("/healthcare/treatment-history");
        },
      });
    } catch (err) {
      console.log({ err });
      toast.error(err.message);
    }
  };

  return (
    <div className=" space-y-3">
      <div className="border-gray-400 rounded-md">
        <EditorContent editor={editor} />
      </div>
      <Signature imgUrl={imgUrl} setImgUrl={setImgUrl} />
      <div className="flex gap-4">
        <button
          type="button"
          className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
          onClick={handleSubmit}
          disabled={!selectedRecommendationData || !imgUrl}
        >
          Kirim rekomendasi
        </button>
        {children}
      </div>
    </div>
  );
}
