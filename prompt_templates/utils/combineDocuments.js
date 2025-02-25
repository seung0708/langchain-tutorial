//create a function to extract the text, join it into a string, and add the function to the chain
function combineDocuments(docs) {
    return docs.map((doc) => doc.pageContent).join('\n\n')
}