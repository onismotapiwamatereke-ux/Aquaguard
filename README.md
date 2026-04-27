# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i
# Note: The project now requires `papaparse` for CSV data processing. It is included in package.json.

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
"# Waternorne-Diease-Detector" 

## Dataset: Water Pollution & Disease

### Source and Description
The application utilizes `water_pollution_disease.csv` as a primary dataset for modeling disease outbreaks. This dataset contains 3,001 rows detailing environmental, geographical, and socioeconomic metrics that correlate with waterborne diseases such as Cholera, Typhoid, and Diarrhea.

### Column Schema Summary
- **Geographic/Temporal**: Country, Region, Year
- **Water Quality**: Water Source Type, Contaminant Level (ppm), pH Level, Turbidity (NTU), Dissolved Oxygen (mg/L), Nitrate Level (mg/L), Lead Concentration (µg/L), Bacteria Count (CFU/mL), Water Treatment Method
- **Socioeconomic/Environmental**: Access to Clean Water (%), Infant Mortality Rate, GDP per Capita (USD), Healthcare Access Index (0-100), Urbanization Rate (%), Sanitation Coverage (%), Rainfall (mm/year), Temperature (°C), Population Density
- **Disease Outcomes**: Diarrheal Cases, Cholera Cases, and Typhoid Cases (all per 100,000 people)

### Data Flow into the UI
1. The CSV is located at the project root and is loaded using Vite's `?url` import strategy.
2. The `src/lib/parse-water-pollution.ts` utility leverages **PapaParse** to process the CSV and **Zod** to validate each row against strict types.
3. The custom React hook `useWaterPollutionData()` in `src/hooks/useWaterPollutionData.ts` fetches, parses, and provides `{ data, isLoading, error }` states.
4. UI components will consume this hook to render charts, tables, and AI-predicted risk clusters.

## Changelog
- 2026-04-24 — Integrated water_pollution_disease.csv; added project_wiki.md and AGENT_RULES.md
