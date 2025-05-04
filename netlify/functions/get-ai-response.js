// netlify/functions/get-ai-response.js
import { CohereClient } from "cohere-ai";

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
    - Frameworks: Spring Boot, Hibernate, Angular, Spring MVC, Spring Data JPA, Spring Security, OAuth, JUnit, REST APIs, Microservices, Web services
    - Web Technologies: HTML5, CSS3, JavaScript, TypeScript, TailwindCSS
    - Database: MySQL, SQL Developer
    - DevOps: AWS, Jenkins, GitHub, JIRA, Postman, VS Code, Android Studio, Gradescope
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
      temperature: 0.6,
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