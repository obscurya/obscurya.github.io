const splitTextIntoChunks = text => {
  const words = [...text.matchAll(/[a-zа-яё-]+/gi)];
  const chunks = [];

  for (let i = 0; i < words.length; i++) {
    const { index } = words[i];
    const [word] = words[i];
    const wordLength = word.length;

    chunks.push({
      content: word,
      isWord: true,
    });

    let chars = '';

    if (words[i + 1]) {
      chars = text.substring(index + wordLength, words[i + 1].index);
    } else {
      chars = text.substring(index + wordLength, text.length);
    }

    chunks.push({
      content: chars,
    });
  }

  return chunks;
};

const createTextContainer = text => {
  const textChunks = splitTextIntoChunks(text);
  const textContainer = document.createElement('div');
  const paragraph = document.createElement('p');

  textContainer.classList.add('text-container');
  paragraph.classList.add('paragraph');

  textChunks.forEach(chunk => {
    const chunkElement = document.createElement('span');

    chunkElement.innerHTML = chunk.content;

    if (chunk.isWord) {
      chunkElement.classList.add('word');
    }

    paragraph.appendChild(chunkElement);
  });

  textContainer.appendChild(paragraph);

  return textContainer;
};
