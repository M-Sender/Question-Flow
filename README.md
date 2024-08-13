

## What it is

This project is a permit flow management system designed to streamline the process of applying for permits. It allows users to answer a series of questions to determine the type of permit they need.

## How to build

To build and run the project locally, follow these steps:

**Clone the repository**:

`git clone https://github.com/M-Sender/Question-Flow`

**Quick Start**:

For a quick start, run `npm run quickStart`

Client runs on port `3000`, server on port `8000`

**Open the webpage**:
Once both the server and client are running, open a web browser and go to [http://localhost:3000](http://localhost:3000) to view the application.

## Database Schema and info:

1. **Municipalities Table:**
   - This table stores information about different municipalities.
   - It has two columns:
     - `id`: A unique identifier for each municipality. This column serves as the primary key.
     - `name`: The name of the municipality.
   - This table serves as a reference point for municipalities involved in the questionnaire results and compiled trees.

2. **Steps Table:**
   - This table represents the steps or questions in the questionnaire.
   - It has three columns:
     - `id`: A unique identifier for each step. This column serves as the primary key.
     - `prompt`: The main question or prompt of the step.
     - `subText`: Additional information or subtext related to the step, if applicable.
   - The steps table provides a structured way to store the content of each step in the questionnaire.

3. **CompiledTrees Table:**
   - This table stores compiled trees, which could represent processed or aggregated data from the questionnaire responses.
   - It has three columns:
     - `id`: A unique identifier for each compiled tree. This column serves as the primary key.
     - `municipality_id`: A foreign key referencing the `municipality_id` column in the municipalities table, indicating the municipality associated with the compiled tree.
     - `compiledTree`: The compiled tree data, JSON.
   - The `municipality_id` column establishes a relationship between compiled trees and municipalities.

4. **QuestionnaireResults Table:**
   - This table stores the results of the questionnaire responses.
   - It has five columns:
     - `id`: A unique identifier for each questionnaire result. This column serves as the primary key.
     - `timestamp`: The timestamp indicating when the questionnaire was completed.
     - `answers`: The answers provided in the questionnaire, possibly stored in a JSON or textual format.
     - `municipality`: A foreign key referencing the `municipality_id` column in the municipalities table, indicating the municipality associated with the questionnaire response.
     - `result`: A foreign key referencing the `id` column in the steps table, indicating the step that determined the result of the questionnaire.
   - The `municipality` column links each questionnaire result to the corresponding municipality, while the `result` column establishes a relationship between the result and the specific step in the questionnaire that determined it.
   - Reasoning:
      -`result`: Captures the result of the questionnaire, i.e., the type of permit needed. Allows for easy analysis and segmentation of data based on the type of permit in demand.

      -`answers`: Provides a trace of the steps followed by the respondent. Although not as detailed as storing each individual answer, it still offers insights into the respondent's journey through the questionnaire.

      -`timestamp` and `municipality`: Enable temporal and geographical analysis, allowing the identification of trends over time and in different areas.
