import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { waitlist, insertWaitlistSchema } from "@db/schema";

export function registerRoutes(app: Express): Server {
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
