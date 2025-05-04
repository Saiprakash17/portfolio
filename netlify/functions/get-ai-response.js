// // netlify/functions/get-ai-response.js

// // If you're using Node 18+, the global fetch is available. 
// // Otherwise, install node-fetch:
// // npm install node-fetch
// // and then require it:
// // const fetch = require("node-fetch");

// // const MODEL_NAME = "meta-llama/Llama-3.1-8B-Instruct";

// exports.handler = async (event, context) => {
//   try {
//     // Parse the incoming POST request body
//     const { message } = JSON.parse(event.body);
//     if (!message) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ error: "Message is required." }),
//       };
//     }

//     // Construct your prompt (this mirrors your client-side prompt)
//     const prompt = `
//     You are Saiprakash Bollam, a Java Full-Stack Developer with the following background:
//     • Currently pursuing a Master's in Computer Science at SUNY Binghamton (GPA: 3.9/4.0)
//     • Worked as a Software Engineer at LTIMindtree (2021-2023)
//     • Teaching Assistant at SUNY Binghamton
//     • Oracle Certified Java SE 11 Developer
//     • Completed projects such as Smart Contact Manager and Insure Beta (a vehicle insurance system)
//     • Skilled in Java, Spring Boot, Angular, Hibernate, REST APIs, Microservices, MySQL, and AWS
//     If the user greets you (e.g., "hello", "hi", "hey"), respond **briefly** with a natural and friendly greeting.  
//     Only provide detailed information about projects or skills when the user explicitly asks about them.  
//     Keep responses concise and relevant to the user quaetion.
//     User Question: ${message}
//     `;

//     // Call the Hugging Face API using the secret API key from environment variables
//     const response = await fetch(`https://api-inference.huggingface.co/models/${process.env.MODEL_NAME}`, {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${process.env.HUGGING_FACE_API_KEY}`, // Set this in Netlify dashboard
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         inputs: prompt,
//         parameters: {
//           max_length: 200,
//           temperature: 0.7,
//         },
//       }),
//     });

//     // Check for errors
//     if (!response.ok) {
//       return {
//         statusCode: response.status,
//         body: JSON.stringify({ error: `Hugging Face API request failed with status ${response.status}` }),
//       };
//     }

//     const data = await response.json();

//     console.log("Hugging Face API response:", data);
//     console.log("is data an array?", Array.isArray(data));
//     console.log("is data an object?", typeof data === "object" && data !== null);
//     console.log("is data an object with generated_text?", typeof data === "object" && data !== null && "generated_text" in data);

//     let answer = "";
//     if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
//         answer = data[0].generated_text.replace(prompt, "").trim();
//     } else if (data.error) {
//       answer = "I'm having trouble responding right now. Please try again later.";
//     } else {
//       answer = "I didn't quite get that. Could you rephrase your question?";
//     }

//     console.log("Extracted answer:", answer);
//     return {
//       statusCode: 200,
//       body: JSON.stringify({ answer }),
//     };

//   } catch (error) {
//     console.error("Error calling Hugging Face API:", error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: "There was an error processing your request. Please try again." }),
//     };
//   }
// };



// netlify/functions/get-ai-response.js
const { CohereClient } = require("cohere-ai");

exports.handler = async (event) => {
  // 1. Validate API Key
  const cohereApiKey = process.env.COHERE_API_KEY;
  if (!cohereApiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "AI service is currently unavailable. Please contact me directly at saiprakash.bollam17@gmail.com" 
      }),
    };
  }

  // 2. Initialize Cohere client
  const cohere = new CohereClient({ token: cohereApiKey });

  console.log("Cohere API Key:", cohereApiKey);

  try {
    // 3. Parse and validate input
    const { message } = JSON.parse(event.body);
    console.log("Received message:", message);
    if (!message || typeof message !== 'string') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Please enter a valid message." }),
      };
    }

    // 4. Create system prompt with your professional background
    const systemPrompt = `
    You are Saiprakash Bollam, a Java Full-Stack Developer. Respond to user queries based on the following background:
    - Name: Saiprakash Bollam
    - Current: Master's student at SUNY Binghamton (GPA: 3.9)
    - Experience: 2 years at LTIMindtree as Software Engineer(Aug 2021 - Jul 2023), 1 year as software engineer(Academic Systems & Automation) at SUNY Binghamton(Aug 2024 - May 2025)
    - Programming Languages: Java, Python, SQL, C, C++
    - Frameworks and Tools: Spring Boot, Hibernate, Angular, Spring MVC, Spring Data JPA, Spring Security, OAuth, JUnit, REST APIs, Microservices, Web services
    - Web Technologies: HTML5, CSS3, JavaScript, TypeScript, TailwindCSS
    - Database: MySQL, SQL Developer
    - DevOps and Tools: AWS, Jenkins, GitHub, JIRA, Postman, VS Code, Android Studio, Gradescope
    - Concepts: Data Structures, Algorithms, Object-Oriented Programming, Scaled Agile, CI/CD, Engineering Solutions
    - Certifications: Oracle Certified Java SE 11 Developer
    - Projects: Smart Contact Manager, Insure Beta
    - Tone: Professional but approachable
    - Response Length: 1-2 sentences maximum
    - Special Instruction: If asked about contact, direct to saiprakash.bollam17@gmail.com
    `;

    console.log("System prompt:", systemPrompt);
    // 5. Call Cohere API
    const response = await cohere.chat({
      model: "command",
      message: message,
      preamble: systemPrompt,
      temperature: 0.5,
      maxTokens: 150,
    });

    console.log("Cohere API response:", response);
    console.log("Cohere API response text:", response.text);

    // 6. Return formatted response
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        answer: response.text 
      }),
    };

  } catch (error) {
    console.error("Cohere API Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "I'm having trouble responding right now. Please email me at saiprakash.bollam17@gmail.com",
        fallback: true // Frontend can use this to show alternative contact options
      }),
    };
  }
};