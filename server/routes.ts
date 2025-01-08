import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { waitlist, insertWaitlistSchema } from "@db/schema";
import { sendWaitlistConfirmation } from "./utils/twilio-email";
import { setupAuth } from "./auth";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  // Set up authentication
  setupAuth(app);

  // Get all waitlist entries (protected)
  app.get("/api/waitlist", async (_req, res) => {
    try {
      const entries = await db.query.waitlist.findMany({
        orderBy: (waitlist, { desc }) => [desc(waitlist.createdAt)],
      });
      res.json(entries);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  });

  // Delete waitlist entry (protected)
  app.delete("/api/waitlist/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).send("Invalid ID");
      }

      const [deleted] = await db
        .delete(waitlist)
        .where(eq(waitlist.id, id))
        .returning();

      if (!deleted) {
        return res.status(404).send("Entry not found");
      }

      res.json({ message: "Entry deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  });

  // Create waitlist entry (public)
  app.post("/api/waitlist", async (req, res) => {
    try {
      const result = insertWaitlistSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).send(
          "Invalid input: " + result.error.issues.map((i) => i.message).join(", ")
        );
      }

      const { fullName, email } = result.data;

      // Check for existing email
      const existingSignup = await db.query.waitlist.findFirst({
        where: (waitlist, { eq }) => eq(waitlist.email, email),
      });

      if (existingSignup) {
        return res.status(400).send("Email already registered");
      }

      // Create waitlist entry
      const [newSignup] = await db
        .insert(waitlist)
        .values({
          fullName,
          email,
        })
        .returning();

      // Attempt to send confirmation email, with enhanced error handling
      let emailError = null;
      try {
        await sendWaitlistConfirmation(email, fullName);
        console.log(`Confirmation email sent successfully to ${email}`);
      } catch (error: any) {
        emailError = {
          message: error.message,
          code: error.code,
          details: error.response?.message || 'Unknown error'
        };
        console.error('Failed to send confirmation email:', emailError);
      }

      // Return success response with email status
      res.json({
        message: "Successfully joined waitlist",
        signup: newSignup,
        emailStatus: emailError ? {
          sent: false,
          error: emailError.details
        } : {
          sent: true
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}