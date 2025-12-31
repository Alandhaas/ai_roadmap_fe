export async function generateText(data) {
   const res = await fetch("http://localhost:8000/generate-local", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
   });

   if (!res.ok) {
      throw new Error(`API error ${res.status}`);
   }

   const json = await res.json();

   // 🔑 THIS LINE FIXES EVERYTHING
   return json.output;
}

export async function streamGenerateText(data, onChunk) {
   const res = await fetch("http://localhost:8000/generate-local/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
   });

   const reader = res.body.getReader();
   const decoder = new TextDecoder();

   let done = false;
   while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) onChunk(decoder.decode(value));
   }
}
