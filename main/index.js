import * as fs from 'fs';
import dotenv from 'dotenv'

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'
import { OpenAIEmbeddings } from '@langchain/openai'

import { createClient } from "@supabase/supabase-js";

dotenv.config();
try {
    const text = fs.readFileSync('scrimba-info.txt', 'utf-8')
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500, 
        separators: ['\n\n', '\n', ' ', ''], //default settings,
        chunkOverlap: 50
    })

    const output = await splitter.createDocuments([text])
    
    const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY)

    await SupabaseVectorStore.fromDocuments(
        output, 
        new OpenAIEmbeddings(process.env.OPENAI_API_KEY),
        {
            client, 
            tableName: 'documents'
        }
    )

} catch (error) {
    console.log(error)
}