export function cosineSimilarity(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export function semanticSearch(queryVector, rows, topK = 5) {
  return rows
    .map(r => ({ content: r.content, score: cosineSimilarity(queryVector, r.embedding) }))
    .sort((a,b)=>b.score-a.score)
    .slice(0, topK);
}
