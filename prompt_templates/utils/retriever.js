import dotenv from 'dotenv';
dotenv.config();

import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'
import { OpenAIEmbeddings } from '@langchain/openai'
import { createClient } from "@supabase/supabase-js";

const openAIAPIKey = process.env.OPENAI_API_KEY
const embeddings = new OpenAIEmbeddings({openAIAPIKey})
const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY)

const vectoStore = new SupabaseVectorStore(embeddings, {
    client, 
    tableName: 'documents',
    queryName: 'match_documents'
})

export const retriever = vectoStore.asRetriever(); 
