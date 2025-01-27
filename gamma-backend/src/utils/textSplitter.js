const MAX_TOKENS_PER_CALL = 1500;

const splitTextIntoChunks = (text, slideCount) => {
  // Normalize newlines and split based on headings or paragraphs
  let sections = text.split(/\n\s*\n|(?=\n#{1,6}\s)/);

  console.log("Initial Pre-Split Sections:", sections);

  sections = sections.map((section) => section.trim()).filter(Boolean);

  if (sections.length > slideCount) {
    const mergedSections = [];
    const mergeFactor = Math.ceil(sections.length / slideCount);

    for (let i = 0; i < sections.length; i += mergeFactor) {
      mergedSections.push(sections.slice(i, i + mergeFactor).join("\n\n"));
    }

    sections = mergedSections.slice(0, slideCount);
  }

  if (sections.length < slideCount) {
    const emptyCount = slideCount - sections.length;
    for (let i = 0; i < emptyCount; i++) {
      sections.push("");
    }
  }

  console.log("Adjusted Sections:", sections);
  return sections;
};

const splitForBatchProcessing = (text) => {
  const sections = text.split(/\n(?=#+\s)|\n\s*\n/);
  const chunks = [];
  let currentChunk = "";

  for (const section of sections) {
    if ((currentChunk + section).length > MAX_TOKENS_PER_CALL) {
      chunks.push(currentChunk.trim());
      currentChunk = section;
    } else {
      currentChunk += section + "\n\n";
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
};

export { splitTextIntoChunks, splitForBatchProcessing };
