export const splitDocument = async (document: string, slideCount: number) => {
  try {
    const response = await fetch("http://localhost:5000/api/split-document", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ document, slideCount }),
    });

    if (!response.ok) {
      throw new Error("Failed to split document");
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
