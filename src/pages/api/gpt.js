const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});


export default async function handler(req, res) {
  const openai = new OpenAIApi(configuration);
  const { text } = req.body;
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: generatePrompt(text) }],
  });

  res.status(200).json({ data: completion.data });
}

const generatePrompt = (text) => {
  return `
I want you to act like a nutritionist. For amateur bodybuilders or people who want to lose weight
You will prepare a nutrition program for you.
Here is my first question to you, ${text} 
answer the questions in Turkish!
`
}


const generatePrompt2 = (text) => {
  return `
I want you to act like a nutritionist. For amateur bodybuilders or people who want to lose weight
You will prepare a nutrition program for you.


  Ask the user step by step questions using this guide. Then do the calculations by going step by step.

  Here is my first question to you, "${text}?"

  answer the questions in Turkish!

`}


// Using the questions below, you will help people create their desired diet.
//   Guideline:
//   - What do you want to diet for?
//   - How many kilos are you ?
//   - How tall are you ?
//   - How old are you ?
//   - How is the activity level?
//   - What is her healt situation ?
//   - What is the nutritional preference?
//   - What is her gender?
//   - If the above information is not given, request them from the user by making them interactive!
//   - Do not give unnecessary information to the user !
//   - Answer the questions in Turkish!
//   - You don't need to explain your calculations to the user. Send the nutrition program to the user as a list !
//   - Ask step by step by making interactive questions to the user! As you get step-by-step answers, move on to the next steps!
//   - If the values entered by the user are meaningless, indicate this!