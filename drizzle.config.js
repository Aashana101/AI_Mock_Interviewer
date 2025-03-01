/** @type {import("drizzle-kit").Config} */
export default {
    schema: "./utils/schema.js",
    dialect: "postgresql",
    dbCredentials:{
        url:'postgresql://neondb_owner:A8feEMhCDuB4@ep-aged-poetry-a9br3yju.gwc.azure.neon.tech/Ai_Mock_Interviewer?sslmode=require',
    }
};