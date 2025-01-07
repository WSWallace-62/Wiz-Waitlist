import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { waitlist, insertWaitlistSchema } from "@db/schema";
import { sendWaitlistConfirmation } from "./utils/email";

export function registerRoutes(app: Express): Server {
  // Get all waitlist entries
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

      const [newSignup] = await db
        .insert(waitlist)
        .values({
          fullName,
          email,
        })
        .returning();

      // Send confirmation email
      try {
        await sendWaitlistConfirmation(email, fullName);
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't fail the registration if email sending fails
      }

      res.json({
        message: "Successfully joined waitlist",
        signup: newSignup,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}