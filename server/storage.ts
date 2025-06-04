import { users, assessments, payments, type User, type Assessment, type Payment, type InsertUser, type InsertAssessment, type InsertPayment } from "@shared/schema";

export interface IStorage {
  // User operations
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  
  // Assessment operations
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  getAssessment(id: number): Promise<Assessment | undefined>;
  updateAssessmentAnalysis(
    id: number, 
    analysis: {
      riskScore: number;
      riskBreakdown: Assessment['riskBreakdown'];
      timeline: string;
      recommendations: string;
      fullAnalysis: string;
    }
  ): Promise<Assessment>;
  markAssessmentAsPaid(id: number): Promise<Assessment>;
  
  // Payment operations
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentByIntentId(intentId: string): Promise<Payment | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private assessments: Map<number, Assessment>;
  private payments: Map<number, Payment>;
  private userIdCounter: number;
  private assessmentIdCounter: number;
  private paymentIdCounter: number;

  constructor() {
    this.users = new Map();
    this.assessments = new Map();
    this.payments = new Map();
    this.userIdCounter = 1;
    this.assessmentIdCounter = 1;
    this.paymentIdCounter = 1;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    const id = this.assessmentIdCounter++;
    const assessment: Assessment = {
      ...insertAssessment,
      id,
      riskScore: null,
      riskBreakdown: null,
      timeline: null,
      recommendations: null,
      fullAnalysis: null,
      isPaid: false,
      createdAt: new Date(),
    };
    this.assessments.set(id, assessment);
    return assessment;
  }

  async getAssessment(id: number): Promise<Assessment | undefined> {
    return this.assessments.get(id);
  }

  async updateAssessmentAnalysis(
    id: number,
    analysis: {
      riskScore: number;
      riskBreakdown: Assessment['riskBreakdown'];
      timeline: string;
      recommendations: string;
      fullAnalysis: string;
    }
  ): Promise<Assessment> {
    const assessment = this.assessments.get(id);
    if (!assessment) {
      throw new Error('Assessment not found');
    }

    const updated: Assessment = {
      ...assessment,
      ...analysis,
    };
    
    this.assessments.set(id, updated);
    return updated;
  }

  async markAssessmentAsPaid(id: number): Promise<Assessment> {
    const assessment = this.assessments.get(id);
    if (!assessment) {
      throw new Error('Assessment not found');
    }

    const updated: Assessment = {
      ...assessment,
      isPaid: true,
    };
    
    this.assessments.set(id, updated);
    return updated;
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = this.paymentIdCounter++;
    const payment: Payment = {
      ...insertPayment,
      id,
      createdAt: new Date(),
    };
    this.payments.set(id, payment);
    return payment;
  }

  async getPaymentByIntentId(intentId: string): Promise<Payment | undefined> {
    return Array.from(this.payments.values()).find(
      payment => payment.stripePaymentIntentId === intentId
    );
  }
}

export const storage = new MemStorage();
