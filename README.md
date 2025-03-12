# Foodable

Foodable is an AI-powered web application designed to help users discover healthy and affordable food options tailored to their dietary needs and budget. The app offers personalized recommendations, recipe sharing, and automated grocery lists with nutritional insights.

## Features
- **Personalized Recipe Suggestions**: Discover recipes that meet your dietary preferences and budget.
- **Custom Grocery Lists**: Generate shopping lists from your recipes and dietary needs.
- **Nutritional Insights**: Get AI-assisted insights into nutritional content to make healthier choices.
- **Authentication & Access Control**: Secure user accounts using AWS Cognito.

## Tech Stack
- **Frontend**: Built with Next.js and styled using Tailwind CSS for a responsive UI.
- **Backend**: Node.js API with MongoDB Atlas as the database, which includes vector search capabilities.
- **AI & Embedding**: Utilizes AWS Bedrock and Lambda for processing and embedding.
- **Infrastructure**: Provisioned and managed with AWS CDK.
- **Deployment**: Hosted on Vercel with CI/CD integration.
- **Containerization**: Docker is used for local development and testing, allowing easy multi-container setup.

## Project Structure
```plaintext
/project-root
├── /.github
├── /aws-infra               # AWS CDK infrastructure setup
├── /database                # Docker Initilization
├── /frontend                # NextJS Front End Code
   ├── .env.local
├── .env
├── docker-compose.yml       # Docker Compose for local testing
└── README.md                # Project documentation
```

## Local Development

1. Prerequisites:
   - Node.js
   - Docker
   - AWS CLI
   - AWS CDK
   - MongoDB Atlas Account
2. Clone the repository:
   ```bash
   git clone git@github.com:MrF1ow/foodable.git
   cd foodable
   ```
3. Run Docker Composer:
   ```bash
   docker compose up --build -d
   ```
4. Access the App:
    - Frontend: http://localhost:8000
