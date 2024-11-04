# LLM Data Engine

Welcome! This is a free open-source tool for collecting AI conversation datasets to fine-tune Large Language Models (LLMs) easily and effectively. Currently a **work in progress**.

## Features

- **Create Projects**: Kick things off by creating a project where you can configure the settings and system prompts for your project.
  
- **Link with Langfuse**: Connect your projects to Langfuse, an open-source LLM engineering platform that will be used to store conversation/annotation data and user interactions.
    
- **Get Contributors**: Generate a shareable link for your project for human experts to have mock conversations and annotate AI responses, building you a tailored, high-quality dataset to help train your model!

## Demo Video

In this demo, I use the LLM Data Engine to collect data for training a model to behave as a helpful elementary school tutor. First, I create a project and link it to Langfuse. For demonstration, I act as an annotator and use the generated shareable link to have a mock conversation, acting as the student needing help and annotating/refining the AI's responses to train its behavior. Finally, I go to Langfuse to see the collected dataset, which can be used to fine-tune my model for my tutoring use case!

https://github.com/user-attachments/assets/e38a473a-fda0-40eb-84dc-f25e163dd9fd

## Join in!

If you have ideas, find bugs, or want to help build something the Data Engine, don’t hesitate to open an issue, submit a pull request, or directly reach out!

## Tech Stack

This project uses TypeScript, Next.js, Prisma/PostgreSQL, NextAuth, and Tailwind CSS, along with the OpenAI and Langfuse API's.
