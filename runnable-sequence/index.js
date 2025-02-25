import dotenv from 'dotenv';
dotenv.config();

import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import {StringOutputParser} from "@langchain/core/output_parsers";

const openAIAPIKey = process.env.OPENAI_API_KEY
const llm = new ChatOpenAI({openAIAPIKey})