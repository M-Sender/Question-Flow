# PermitFlow Case Study

## What it is:

This project is a permit flow management system designed to streamline the process of applying for permits. It allows users to answer a series of questions to determine the type of permit they need and guides them through the application process.

## How to build:

To build and run the project locally, follow these steps:

1. **Clone the repository**: 

`git clone https://github.com/msender/PermitFlow-Case-Study.git`


2. **Install client dependencies**: 

`cd permitFlowViews &&
npm install &&
cd ..`


3. **Install server dependencies**: 

`cd permitFlowServer &&
npm install &&
cd ..`


4. **Run the DB setup and seeding**: 
Assuming `ts-node` is installed, run the following command to set up the database and seed it with initial data:

`ts-node permitFlowServer/database/setupDB.ts`


5. **Start the server**: 
Open a terminal and run the server: (Runs on port 8000 (change in permitFlowServer/server.ts if needed and need to adjust React connections))

`ts-node permitFlowServer/server.ts`


6. **Start the client**: 
Open another terminal and run the React project:

`cd permitFlowViews &&
npm start`


7. **Open the webpage**:
Once both the server and client are running, open a web browser and go to [http://localhost:3000](http://localhost:3000) to view the application.

## If more time:

If you have more time to work on the project, consider the following enhancements:

- Add more municipalities and compiled trees to accommodate a wider range of permit application scenarios.
- Create a web interface for easy creation of trees and question steps to customize the permit flow.
- Implement session management using cookies or session IDs to store current sessions with answer trees, ensuring that sessions persist even after page refreshes.

## Video link:

Include a link to any video demonstration or walkthrough of the project if available.
