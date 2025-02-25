import dotenv from 'dotenv';
dotenv.config();

import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import {StringOutputParser} from "@langchain/core/output_parsers";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";

const openAIAPIKey = process.env.OPENAI_API_KEY
const llm = new ChatOpenAI({openAIAPIKey})

const punctuationTemplate = `Given a sentence, add punction where needed. 
    sentence: {sentence}
    sentence with punctuation:
`;

const punctuationPrompt = PromptTemplate.fromTemplate(punctuationTemplate);

const grammarTemplate = `Given a sentence correct the grammar. 
    sentence: {punctuated_sentence}
    sentence with correct grammar
`;

const grammarPrompt = PromptTemplate.fromTemplate(grammarTemplate);

const translationTemplate = `Given a sentence, translate that sentence into {language}
    sentence: {grammatically_correct_sentence}
    translated sentence: 
`
const translationPrompt = PromptTemplate.fromTemplate(translationTemplate)

const punctionChain = RunnableSequence.from([punctuationPrompt, llm, new StringOutputParser()])
const grammarChain = RunnableSequence.from([grammarPrompt, llm, new StringOutputParser()])
const translationChain = RunnableSequence.from([translationPrompt, llm, new StringOutputParser()])

const chain = RunnableSequence.from([
    {
        punctuated_sentence: punctionChain,
        original_input: new RunnablePassthrough()
    }, 
    {
        grammatically_correct_sentence: grammarChain,
        language: ({original_input}) => original_input.language
    }, 
    translationChain
])

const response = await chain.invoke({
    sentence: 'i dont like mondays', 
    language: 'japanese'
})

console.log(response)