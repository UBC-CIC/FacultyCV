import { Pandoc } from 'pandoc-wasm';

let pandocInstance = null;

export const initPandoc = async () => {
  if (!pandocInstance) {
    pandocInstance = new Pandoc();
    await pandocInstance.init();
  }
  return pandocInstance;
};

export const convertMarkdownToHtml = async (inputText) => {
  const pandoc = await initPandoc();
  const result = await pandoc.run({
    text: inputText,
    options: { from: 'markdown', to: 'html' },
  });
  return result;
};
