const MAX_TOKENS_PER_CALL = 1500;

const splitTextIntoChunks = (text, slideCount) => {
  // Split text based on markdown headings or paragraphs
  let sections = text.split(/(?=\n#{1,6}\s)|\n\s*\n/);

  console.log("Initial Pre-Split Sections:", sections);

  if (sections.length > slideCount) {
    // Merge sections to fit slide count
    const mergeFactor = Math.ceil(sections.length / slideCount);
    const mergedSections = [];
    for (let i = 0; i < sections.length; i += mergeFactor) {
      mergedSections.push(sections.slice(i, i + mergeFactor).join("\n\n"));
    }
    sections = mergedSections.slice(0, slideCount);
  } else if (sections.length < slideCount) {
    // Add empty sections to match target count
    while (sections.length < slideCount) {
      sections.push("");
    }
  }

  return sections;
};

const splitForBatchProcessing = (text) => {
  const sections = text.split(/(?=\n#{1,6}\s)/);
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

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
};

export { splitTextIntoChunks, splitForBatchProcessing };
