# Foodable

Foodable will be an AI-powered web application designed to help users discover healthy and affordable food options tailored to their dietary needs and budget. The app offers personalized recommendations, recipe sharing, and grocery lists with nutritional insights.

## Features
- **Personalized Recipe Suggestions**: Discover recipes that meet your dietary preferences and budget.
- **Custom Grocery Lists**: Generate shopping lists from your recipes and dietary needs.
- **Nutritional Insights**: Get AI-assisted insights into nutritional content to make healthier choices.
- **Authentication & Access Control**: Secure user accounts using Clerk.js

## Tech Stack
- **Frontend**: Built with Next.js and styled using Tailwind CSS for a responsive UI.
- **Backend**: Node.js API with MongoDB Atlas as the database, which includes vector search capabilities.
- **AI & Embedding**: Uses OpenAI and MongoDB Atlas Vector Search.
- **Deployment**: Hosted on Vercel with CI/CD integration.

## Project Structure
```plaintext
/project-root
├── /.github
├── /frontend                # NextJS Front End Code
   ├── /__tests__            # Jest Tests
   ├── /cypress              # Cypress Tests
   ├── /public               # Public Data and Assets
   ├── /src                  # Source Code
      ├── /app               # Page Routes and API Routes
         ├── /api            # API Rotues
      ├── /assets            # Assets (fonts, images)
      ├── /components        # UI Components
      ├── /config            # Configurations of Data
      ├── /hooks             # Client Side Custom Hooks
      ├── /layouts           # Client and Server Side Layouts
      ├── /lib
          ├── /hooks         # Client Side Custom Hooks
          ├── /utils         # Utility Functions for Various Things
      ├── /providers         # Providers for Application
      ├── /server            # Methods to Communicate with Server
         ├── /api            # Fetch Methods to Communicate with API
         ├── /hooks          # TanStack Hooks to Communicate with API
      ├── /stores            # Zustand Stores
      ├── /types             # Types for Data throughout Application
   ├── .env.local            
├── /postman                 # Location of Export Postman Tests and Environment
└── README.md                # Project documentation
```

## Local Development / Deployment

### IMPORTANT: 

Before starting local development or deployment, make sure you've properly created and configured the `.env.local` file in the root of the `frontend` directory.  
You can use the provided [`env.txt`](./frontend/env.txt) file at the top level of the project as a reference.

1. Prerequisites:
   - Node.js
   - MongoDB Atlas Account
   - Clerk.js Account Setup
2. Clone the repository:
   ```bash
   git clone git@github.com:MrF1ow/foodable.git
   cd foodable
   ```
3. Install packages
   ```bash
   npm install
   ```
4. Ensure Build Process Works Correctly
    ```bash
    npm run build
    ```
5. Start The Application
    ```bash
    npm start
    ```
6. Access the App @:
    ```bash
    http://localhost:8000
    ```
## Accessing the Webpage

### Please Note Before Accessing:

1. Some features are still under development.
2. Known issues may still exist. If you encounter any bugs or unexpected behavior, please report them via the [`Issues`](https://github.com/MrF1ow/Foodable/issues) tab.
3. The site is using development API keys, which may result in slower response times or limited functionality.

### Access the Site

Visit: [https://foodable.xyz](https://foodable.xyz)


