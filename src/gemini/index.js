import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiService {
  constructor() {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    if (!apiKey) {
      console.error("API key không được tìm thấy! Vui lòng kiểm tra file .env");
    }

    this.genAI = new GoogleGenerativeAI(apiKey);

    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    this.config = {
      maxOutputTokens: 500,
      temperature: 0.7,
    };
  }

  getInitialHistory() {
    return [
      {
        role: "user",
        parts: [{ text: "Tư vấn giáo dục giới tính" }],
      },
      {
        role: "model",
        parts: [
          {
            text: `Chào bạn, tôi rất vui được tư vấn về giáo dục giới tính. Đây là một chủ đề rộng lớn và quan trọng, bao gồm nhiều khía cạnh khác nhau. Để có thể tư vấn tốt nhất, bạn có thể cho tôi biết bạn đang quan tâm đến vấn đề cụ thể nào không?...`,
          },
        ],
      },
    ];
  }

  async generateResponse(userMessage, chatHistory = []) {
    try {
      const history =
        chatHistory.length > 0 ? chatHistory : this.getInitialHistory();

      history.push({
        role: "user",
        parts: [{ text: userMessage }],
      });

      const chat = this.model.startChat({
        history,
        generationConfig: this.config,
      });

      const result = await chat.sendMessage(userMessage);
      const response = result.response;

      history.push({
        role: "model",
        parts: [{ text: response.text() }],
      });

      return {
        message: response.text(),
        history: history,
      };
    } catch (error) {
      console.error("Lỗi khi tạo phản hồi:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
