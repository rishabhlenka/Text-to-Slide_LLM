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

export { splitTextIntoChunks };
