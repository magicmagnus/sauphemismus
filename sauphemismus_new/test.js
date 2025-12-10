// import { InferenceClient } from "@huggingface/inference";

// const client = new InferenceClient('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');

// const chatCompletion = await client.chatCompletion({
//     model: "meta-llama/Llama-3.1-8B-Instruct"
//     messages: [
//         {
//             role: "user",
//             content: "What is the capital of France?",
//         },
//     ],
// });

// console.log(chatCompletion.choices[0].message);

async function query(data) {
	const response = await fetch(
		"https://router.huggingface.co/v1/chat/completions",
		{
			headers: {
				Authorization: `Bearer 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`,
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.json();
	return result;
}

query({ 
    messages: [
        {
            role: "user",
            content: "What is the capital of France?",
        },
    ],
    model: "meta-llama/Llama-3.1-8B-Instruct",
}).then((response) => {
    console.log(JSON.stringify(response));
});

