import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertAssessmentSchema } from "@shared/schema";
import { analyzeCareerRisk } from "./openai";

// Make Stripe optional for development
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Submit assessment data and get initial analysis
  app.post("/api/assessments", async (req, res) => {
    try {
      const validatedData = insertAssessmentSchema.parse(req.body);

      // Create assessment record
      const assessment = await storage.createAssessment({
        ...validatedData,
        resumeText: null,
      });

      // Perform AI analysis
      const analysis = await analyzeCareerRisk({
        careerCategory: assessment.careerCategory,
        jobTitle: assessment.jobTitle,
        yearsExperience: assessment.yearsExperience,
        dailyWorkSummary: assessment.dailyWorkSummary,
        keySkills: assessment.keySkills || '',
        resumeText: '',
      });

      // Update assessment with analysis results
      const updatedAssessment = await storage.updateAssessmentAnalysis(assessment.id, {
        riskScore: analysis.riskScore,
        riskBreakdown: analysis.riskBreakdown,
        timeline: analysis.timeline,
        recommendations: analysis.recommendations,
        fullAnalysis: analysis.fullAnalysis,
      });

      res.json({
        id: updatedAssessment.id,
        riskScore: updatedAssessment.riskScore,
        riskBreakdown: updatedAssessment.riskBreakdown,
        timeline: updatedAssessment.timeline,
        previewRecommendations: analysis.recommendations.substring(0, 300) + '...',
        hasFullReport: false,
      });
    } catch (error: any) {
      console.error('Assessment submission error:', error);
      res.status(400).json({ 
        message: error.message || "Error processing assessment"
      });
    }
  });

  // Get assessment by ID
  app.get("/api/assessments/:id", async (req, res) => {
    try {
      const assessmentId = parseInt(req.params.id);
      const assessment = await storage.getAssessment(assessmentId);
      
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      // Return preview or full data based on payment status
      if (assessment.isPaid) {
        res.json({
          id: assessment.id,
          riskScore: assessment.riskScore,
          riskBreakdown: assessment.riskBreakdown,
          timeline: assessment.timeline,
          recommendations: assessment.recommendations,
          fullAnalysis: assessment.fullAnalysis,
          hasFullReport: true,
        });
      } else {
        res.json({
          id: assessment.id,
          riskScore: assessment.riskScore,
          riskBreakdown: assessment.riskBreakdown,
          timeline: assessment.timeline,
          previewRecommendations: assessment.recommendations?.substring(0, 300) + '...',
          hasFullReport: false,
        });
      }
    } catch (error: any) {
      res.status(500).json({ message: "Error retrieving assessment" });
    }
  });

  // Create payment intent for full report
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ message: "Payment processing not configured" });
    }

    try {
      const { assessmentId } = req.body;
      
      const assessment = await storage.getAssessment(assessmentId);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      if (assessment.isPaid) {
        return res.status(400).json({ message: "Assessment already paid" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: 4900, // $49.00 in cents
        currency: "usd",
        metadata: {
          assessmentId: assessmentId.toString(),
        },
      });

      // Store payment record
      await storage.createPayment({
        assessmentId,
        stripePaymentIntentId: paymentIntent.id,
        amount: 4900,
        status: 'pending',
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        amount: 4900,
      });
    } catch (error: any) {
      console.error('Payment intent creation error:', error);
      res.status(500).json({ 
        message: "Error creating payment intent: " + error.message 
      });
    }
  });

  // Handle successful payment webhook
  app.post("/api/payment-success", async (req, res) => {
    try {
      const { paymentIntentId } = req.body;
      
      const payment = await storage.getPaymentByIntentId(paymentIntentId);
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      // Mark assessment as paid
      await storage.markAssessmentAsPaid(payment.assessmentId);

      res.json({ success: true });
    } catch (error: any) {
      console.error('Payment success handling error:', error);
      res.status(500).json({ message: "Error processing payment success" });
    }
  });

  // Career categories endpoint
  app.get("/api/career-categories", async (req, res) => {
    try {
      const categories = [
        {
          id: "designer",
          name: "Designer",
          description: "UI/UX, Graphic, Product Design",
          icon: "palette",
          averageRisk: 42,
          assessmentCount: 2847,
        },
        {
          id: "product-manager",
          name: "Product Manager",
          description: "Product Strategy, Roadmapping, Stakeholder Management",
          icon: "clipboard-list",
          averageRisk: 38,
          assessmentCount: 3254,
        },
        {
          id: "marketing",
          name: "Marketing",
          description: "Content, Digital Marketing, SEO, Campaign Management",
          icon: "bullhorn",
          averageRisk: 65,
          assessmentCount: 1932,
        },
        {
          id: "accounting",
          name: "Accounting",
          description: "Bookkeeping, Financial Analysis, Tax Preparation",
          icon: "calculator",
          averageRisk: 78,
          assessmentCount: 1567,
        },
        {
          id: "legal",
          name: "Legal",
          description: "Contract Review, Research, Document Preparation",
          icon: "balance-scale",
          averageRisk: 35,
          assessmentCount: 892,
        },
      ];

      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching career categories" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
