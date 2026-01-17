import { Client } from "@gradio/client";

export async function embed(document) {
	const client = await Client.connect("ipepe/nomic-embeddings");
	const result = await client.predict("/predict", { 		
		document,	
		model_name: "nomic-ai/nomic-embed-text-v1.5", 
	});

  return result.data;
}
