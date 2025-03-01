import { varchar, text, serial} from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const MockInterviewer = pgTable("mock_interviewer", {
  id: serial("id").primaryKey(),
  jsonMockResp: text("json_mock_resp").notNull(),
  jobPosition: varchar("job_position").notNull(),
  jobDesc: varchar("job_desc").notNull(),
  jobExperience: varchar("job_experience").notNull(),
  createdBy:varchar('created_by').notNull(),
  createdAt:varchar('created_at').notNull(),
  mockID:varchar('mock_id').notNull()
});

export const UserAnswer = pgTable("userAnswer", {
  id: serial("id").primaryKey(),
  mockIDRef: varchar("mock_id").notNull(),
  question:varchar('question').notNull(),
  correctAns:text('correctAns'),
  userAns:text('userAns'),
  feedback:text('feedback'),
  rating: varchar('rating'),
  userEmail:varchar('userEmail'),
  createdAt:varchar('created_at'),

});

