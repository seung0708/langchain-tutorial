import dotenv from 'dotenv';
dotenv.config();

import { ChatOpenAI } from '@langchain/openai'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { retriever } from '../utils/retriever.js'
import {combineDocuments} from '../utils/combineDocuments.js'
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";

const openAIAPIKey = process.env.OPENAI_API_KEY
const llm = new ChatOpenAI({openAIAPIKey})

const standaloneQuestionTemplate = 'Given a question, convert it to a standalone question. question: {question} standalone question:'

const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate)

const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question about Scrimba based on the context provided. Try to find the answer in the context. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." And direct the questioner to email help@scrimba.com. Don't try to make up an answer. Always speak as if you were chatting to a friend.
context: {context}
question: {question}
answer:`

const answerPrompt = PromptTemplate.fromTemplate(answerTemplate)

/**
 * Super Challenge:
 * 
 * Set up a RunnableSequence so that the standaloneQuestionPrompt 
 * passes the standalone question to the retriever, and the retriever
 * passes the combined docs as context to the answerPrompt. Remember, 
 * the answerPrompt should also have access to the original question. 
 * 
 * When you have finished the challenge, you should see a 
 * conversational answer to our question in the console.
 * 
**/

const standaloneQuestionChain = RunnableSequence.from([standaloneQuestionPrompt, llm, new StringOutputParser()])
const retrieverChain = RunnableSequence.from([
    prevResult => prevResult.standalone_question, 
    retriever, 
    combineDocuments
])
const answerChain = RunnableSequence.from([answerPrompt, llm, new StringOutputParser])

const chain = RunnableSequence.from([
    {
        standalone_question: standaloneQuestionChain, 
        original_input: new RunnablePassthrough()
    },
    {
        context: retrieverChain, 
        question: ({original_input}) => original_input.question
    },
    answerChain
])

const response = await chain.invoke({
    question: 'What are the technical requirements for running Scrimba? I only have a very old laptop which is not that powerful.'
})

console.log(response)