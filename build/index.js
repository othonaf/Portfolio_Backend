"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
app_1.default.post('/jobMatch', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { input } = req.body;
    const prompt = `Você é um desenvolvedor júnior com habilidades em Node.js, NestJS, TypeScript, React, SQL, Git, Docker, CI/CD, e práticas ágeis como Scrum e Itil. Dada a descrição completa da vaga abaixo, identifique as habilidades mencionadas e gere uma resposta que mostre sua experiência como candidato ideal para a vaga. E se por acaso houver habilidades nas quais você não domina, argumente da melhor forma que puder garantindo sua softskill em aprender rápido, frisando possibilidades de transferência de habilidades.
        Descrição da Vaga: "${input}"
        Obs.: Seu texto será apresentado diretamente ao recrutador, portanto, não mande instruções genéricas como por exemplo, me mandar citar projetos pessoais, resultados ou coisas semelhantes.`;
    try {
        const response = yield axios_1.default.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
            contents: [
                {
                    parts: [
                        { text: prompt }
                    ]
                }
            ]
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const generatedText = response.data.candidates[0].content.parts[0].text || "Resposta não gerada.";
        res.status(200).send(generatedText.trim());
    }
    catch (error) {
        console.error("Erro ao chamar a API do Gemini:", error);
        res.status(500).json({ message: "Houve um erro ao processar sua solicitação. Tente novamente mais tarde.", error });
    }
}));
