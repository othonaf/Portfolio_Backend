import app from "./app";
import axios from 'axios';
import dotenv from 'dotenv';
import { Request, Response } from "express";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post('/jobMatch', async (req: Request, res: Response) => {
    const { input, lang } = req.body;

    const prompt = `Você é um desenvolvedor júnior com habilidades em Node.js, NestJS, TypeScript, React, SQL, AWS, Google Cloud, Git, Docker, CI/CD, e práticas ágeis como Scrum e Itil. Dada a descrição completa da vaga abaixo, identifique as habilidades mencionadas e gere uma resposta que mostre sua experiência como candidato ideal para a vaga. E se por acaso houver habilidades que você não domina, argumente da melhor forma que puder garantindo sua softskill em aprender rápido, frisando possibilidades de transferência de habilidades.
        Descrição da Vaga: "${input}"
        Obs.: Seu texto será apresentado diretamente ao recrutador, portanto, não mande instruções genéricas como por exemplo, me mandar citar projetos pessoais, resultados ou coisas semelhantes. Evite também deixar espaços em branco e/ou abertos para que eu edite de alguma forma. LEMBRE-SE SUA RESPOSTA APARECERÁ AUTOMATICAMENTE PARA O RECRUTADOR. Responda em ${lang}`;

    try {
        const response:any = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            { text: prompt }
                        ]
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        const generatedText = response.data.candidates[0].content.parts[0].text || "Resposta não gerada.";

        res.status(200).send(generatedText.trim());

    } catch (error) {
        res.status(500).json({ message: "Houve um erro ao processar sua solicitação. Tente novamente mais tarde.", error });
    }
});
