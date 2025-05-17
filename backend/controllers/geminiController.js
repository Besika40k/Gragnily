const fetch = require("node-fetch");

const isProd = process.env.MY_ENVIRONMENT == "production";

const pythonEndpoint = isProd
  ? process.env.PYTHON_ENDPOINT
  : "http://127.0.0.1:8000";

const generateContent = async (req, res) => {
  const { content } = req.body;

  if (!req.userId) {
    return res.status(401).json({ message: "User Not Registered" });
  }

  try {
    // Example: Fetch request to another API
    const apiResponse = await fetch(`${pythonEndpoint}/gemini/extractRagData`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, user_id: req.userId }),
    });

    if (!apiResponse.ok) {
      throw new Error("Failed to fetch from external API");
    }

    // eslint-disable-next-line no-unused-vars
    const { retrieved_data, answer } = await apiResponse.json();

    res.status(200).json({
      message: "Fetched data from external API",
      data: answer,
    });
  } catch (error) {
    console.error("Error in generateContent:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getHistory = async (req, res) => {
  // #swagger.summary = 'Get User History'
  // #swagger.description = "Fetch the user AI-IA's chat history."

  if (!req.userId) {
    return res.status(401).json({ message: "User Not Registered" });
  }

  try {
    // Example: Fetch request to another API
    const apiResponse = await fetch(
      `${pythonEndpoint}/gemini/getHistory?user_id=${encodeURIComponent(
        req.userId
      )}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!apiResponse.ok) {
      throw new Error("Failed to fetch from external API");
    }

    const history = await apiResponse.json();

    res.status(200).json({
      message: "Fetched data from external API",
      data: history,
    });
  } catch (error) {
    console.error("Error in generateContent:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const loadData = async (req, res) => {
  /*
    #swagger.summary = "Load RAG data list"
    #swagger.description = "Accepts a raw JSON array of RAG data items, each containing 'text' and 'source' strings."
    #swagger.consumes = ['application/json']
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            text: { type: "string", example: "Sample text" },
                            source: { type: "string", example: "Source A" }
                        },
                        required: ["text", "source"]
                    }
                }
            }
        }
    }
*/

  if (!req.userId) {
    return res.status(401).json({ message: "User Not Registered" });
  }

  const ragData = req.body;

  try {
    const apiResponse = await fetch(
      `${pythonEndpoint}/gemini/loadRagData?user_id=${req.userId}`, // user_id in query string
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ragData), // Just the list of ragData, not wrapped
      }
    );

    if (!apiResponse.ok) {
      throw new Error("Failed to fetch from external API");
    }

    const data = await apiResponse.json();

    res.status(200).json({
      message: "Fetched data from external API",
      data: data,
    });
  } catch (error) {
    console.error("Error in generateContent:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { generateContent, getHistory, loadData };
