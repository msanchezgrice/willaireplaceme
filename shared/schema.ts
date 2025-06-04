import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
});

export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  careerCategory: text("career_category").notNull(),
  jobTitle: text("job_title").notNull(),
  yearsExperience: text("years_experience").notNull(),
  companySize: text("company_size"),
  dailyWorkSummary: text("daily_work_summary").notNull(),
  keySkills: text("key_skills"),
  resumeText: text("resume_text"),
  riskScore: integer("risk_score"),
  riskBreakdown: jsonb("risk_breakdown").$type<{
    taskAutomation: number;
    creativeRequirements: number;
    humanInteraction: number;
    strategicThinking: number;
  }>(),
  timeline: text("timeline"),
  recommendations: text("recommendations"),
  fullAnalysis: text("full_analysis"),
  isPaid: boolean("is_paid").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  assessmentId: integer("assessment_id").notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id").notNull(),
  amount: integer("amount").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  riskScore: true,
  riskBreakdown: true,
  timeline: true,
  recommendations: true,
  fullAnalysis: true,
  isPaid: true,
  createdAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type Assessment = typeof assessments.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
