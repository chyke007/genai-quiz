<h1 align="center">
  <br>
  Genai-Quiz
  <br>
</h1>

<h4 align="center"><a href="#" target="_blank">GenaiQuiz,</a> is Serverless Quiz app that converts youtube videos and pdf content to option based quizes.</h4>

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

<p align="center">
 <a href="#folder-structure">Folder Structure</a> •
  <a href="#key-features">Services Used</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#documentation">Documentation</a> •
  <a href="#you-may-also-like">Related</a> •
  <a href="#license">License</a>
</p>

## Folder Structure
This project contains source code for a serverless that can be deployed using the serverless framework. It also contains frontend code built using Next.js that can also be easily deployed or run locally. Also added are the architecture diagrams for the project.

- [architecture](https://github.com/chyke007/genai-quiz/tree/main/architecture) - Contains architectural diagram and workflows for the application
- [backend](https://github.com/chyke007/genai-quiz/tree/main/backend) - Contains the backend/serverless portion of the application built using the serverless framework
- [frontend](https://github.com/chyke007/genai-quiz/tree/main/frontend) - Contains the frontend of the application built using Next.js

## Services Used

The application utilizes the event driven architecure and Generative AI and is built using AWS services powered by the serverless framework. The following are the AWS services explicitly used

- Amazon EventBridge 
- Amazon S3
- Amazon DynamoDB
- AWS Lambda
- Amazon API Gateway
- AWS Step Functions
- AWS IoT
- Amazon Cognito
- AWS CloudFormation
- AWS STS
- Amazon Bedrock

## How To Use

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) v16+ (which comes with [npm](http://npmjs.com)) installed on your computer. Also create an account with AWS, install the AWS CLI in locally, create an IAM user and add this user to AWS CLI as a profile. This profile user should have necessary permissions to deploy the backend section to AWS. Next, add required credentials to the .env file created from the command below. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/chyke007/genai-quiz.git

# Go into the repository
$ cd genai-quiz

# Copy environment variable
$ cp backend/.env.example backend/.env  && cp frontend/.env.example frontend/.env

# Deploy backend (run from folder root)
$ npm i serverless -g
$ cd backend && npm i && serverless deploy

# Remove backend resources (run from folder root)
$ cd backend && sls remove

# Run Frontend (run from folder root)
$ cd frontend && npm i && npm run dev
```
## Architecture

### Full flow

<img src="https://github.com/chyke007/genai-quiz/blob/main/architecture/full-architecture.png" alt="Full Flow" width="700" />
 
### Question Generation Flow

<img src="https://github.com/chyke007/genai-quiz/blob/main/architecture/question-generation-architecture.png" alt="Question Generation Flow" width="700" />


## Documentation

Coming soon... 

## You may also like...

- [YumFood](https://github.com/chyke007/yum-food) - An An online food ordering application
- [TrackIt](https://github.com/chyke007/whatsapp-group-bot) - A WhatsApp messages tracker
- [Facial Vote](https://github.com/chyke007/facial-vote) - A Serverless Facial Recognition voting application

## License

MIT

---

> [chibuikenwa.com](https://www.chibuikenwa.com) &nbsp;&middot;&nbsp;
> GitHub [@chyke007](https://github.com/chyke007) &nbsp;&middot;&nbsp;
> LinkedIn [@chibuikenwachukwu](https://linkedin.com/in/chibuikenwachukwu)
