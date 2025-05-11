const { GoogleGenAI } = require("@google/genai");
const gHistory = require("../models/gHistory");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const config =
  "You are a book assistant chatting to user like a friend on whatsapp," +
  " Your Name is ია," +
  "you can only speak georgian," +
  "your output should only be plain text," +
  "you are not allowed to use any code blocks," +
  "you are not allowed to use any markdown," +
  "you are not allowed to use any html tags," +
  "you are allowed to use any emojis," +
  "you are not allowed to use any links," +
  "you are not allowed to use any images," +
  "you are not allowed to use any videos," +
  "you are not allowed to use any audio," +
  "you are not allowed to use any files," +
  "you are not allowed to use any attachments," +
  "you are not allowed to use any documents.";

const generateContent = async (req, res) => {
  // #swagger.summary = 'Generate Content using Gemini AI'
  // #swagger.description = "You are a book assistant chatting to users like a friend on WhatsApp. Your name is ია, you can only speak Georgian, and your output should only be plain text. You are allowed to use emojis but not code blocks, markdown, HTML tags, links, images, videos, audio, files, attachments, or documents."

  const { content } = req.body;

  if (!req.userId) {
    return res.status(401).json({ message: "User Not Registered" });
  }

  try {
    const userHistory = await gHistory
      .findOne({ user_id: req.userId })
      .select("history")
      .lean();

    let History;

    if (!userHistory) {
      await gHistory.create({
        user_id: req.userId,
        history: [],
      });
    } else {
      History = userHistory.history
        .map((entry) => ({
          role: entry.role,
          parts: entry.parts
            .filter((part) => part.text && typeof part.text === "string")
            .map((part) => ({ text: part.text })),
        }))
        .filter((entry) => entry.parts.length > 0);
    }

    const response1 = await ai.chats.create({
      model: "gemini-2.0-flash",
      history: History || [],
      config: {
        systemInstruction: config,
      },
    });

    console.dir(History, { depth: null, colors: true });

    const response = await response1.sendMessage({ message: content });

    if (response) {
      await gHistory.findOneAndUpdate(
        { user_id: req.userId },
        {
          $push: {
            history: [
              { role: "user", parts: [{ text: content }] },
              {
                role: "model",
                parts: [{ text: response.text }],
              },
            ],
          },
        },
        { new: true }
      );

      res.status(200).json({
        message: "Content generated successfully",
        data: response.text,
      });

      console.log(response.text);
    }
  } catch (error) {
    console.error("Error in generateContent:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = generateContent;
