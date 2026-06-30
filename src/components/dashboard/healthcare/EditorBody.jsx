import { useCurrentEditor } from "@tiptap/react";

export const EditorBody = ({ content }) => {
  return <pre>{JSON.stringify(content, null, 2)}</pre>;
};
