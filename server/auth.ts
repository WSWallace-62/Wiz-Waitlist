import passport from "passport";
import { IVerifyOptions, Strategy as LocalStrategy } from "passport-local";
import { type Express } from "express";
import session from "express-session";
import createMemoryStore from "memorystore";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { users, insertUserSchema } from "@db/schema";
import { db } from "@db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const scryptAsync = promisify(scrypt);
const crypto = {
  hash: async (password: string) => {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
  },
  compare: async (suppliedPassword: string, storedPassword: string) => {
    const [hashedPassword, salt] = storedPassword.split(".");
    const hashedPasswordBuf = Buffer.from(hashedPassword, "hex");
    const suppliedPasswordBuf = (await scryptAsync(
      suppliedPassword,
      salt,
      64,
    )) as Buffer;
    return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
  },
};

// extend express user object with our schema
declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const updateCredentialsSchema = z.object({
  currentPassword: z.string(),
  newUsername: z.string().min(3),
  newPassword: z.string().min(6),
});

export function setupAuth(app: Express) {
  const MemoryStore = createMemoryStore(session);
  const sessionSettings: session.SessionOptions = {
    secret: process.env.REPL_ID || 'the-vegan-wiz-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {},
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
  };

  if (app.get("env") === "production") {
    app.set("trust proxy", 1);
    sessionSettings.cookie = {
      secure: true,
    };
  }

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.username, username))
          .limit(1);

        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        const isMatch = await crypto.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  app.post("/api/login", (req, res, next) => {
    const result = insertUserSchema.safeParse(req.body);
    if (!result.success) {
      return res
        .status(400)
        .send("Invalid input: " + result.error.issues.map((i) => i.message).join(", "));
    }

    const cb = (err: any, user: Express.User, info: IVerifyOptions) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(400).send(info.message ?? "Login failed");
      }

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }

        return res.json({
          message: "Login successful",
          user: { id: user.id, username: user.username },
        });
      });
    };
    passport.authenticate("local", cb)(req, res, next);
  });

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).send("Logout failed");
      }

      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/user", (req, res) => {
    if (req.isAuthenticated()) {
      return res.json(req.user);
    }

    res.status(401).send("Not logged in");
  });

  app.put("/api/admin/credentials", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Authentication required");
    }

    const result = updateCredentialsSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).send(
        "Invalid input: " + result.error.issues.map((i) => i.message).join(", ")
      );
    }

    const { currentPassword, newUsername, newPassword } = result.data;

    try {
      // Verify current password
      const isMatch = await crypto.compare(currentPassword, req.user.password);
      if (!isMatch) {
        return res.status(400).send("Current password is incorrect");
      }

      // Check if new username already exists (if username is being changed)
      if (newUsername !== req.user.username) {
        const [existingUser] = await db
          .select()
          .from(users)
          .where(eq(users.username, newUsername))
          .limit(1);

        if (existingUser) {
          return res.status(400).send("Username already exists");
        }
      }

      // Hash new password
      const hashedPassword = await crypto.hash(newPassword);

      // Update user
      const [updatedUser] = await db
        .update(users)
        .set({
          username: newUsername,
          password: hashedPassword,
        })
        .where(eq(users.id, req.user.id))
        .returning();

      // Force logout after credential change
      req.logout((err) => {
        if (err) {
          console.error("Error logging out after credential update:", err);
        }
      });

      res.json({
        message: "Credentials updated successfully",
        user: { id: updatedUser.id, username: updatedUser.username },
      });
    } catch (error) {
      console.error("Error updating credentials:", error);
      res.status(500).send("Server error");
    }
  });
  // Protect the waitlist API with authentication
  app.use("/api/waitlist", (req, res, next) => {
    if (req.method === "GET" || req.method === "DELETE") {
      if (!req.isAuthenticated()) {
        return res.status(401).send("Authentication required");
      }
    }
    next();
  });
}