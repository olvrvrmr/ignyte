import { sql } from 'drizzle-orm';
import { boolean, integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { enum: ["admin", "manager", "viewer"] }).default("viewer").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const players = pgTable("players", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  isRegular: boolean("is_regular").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const matches = pgTable("matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // 'singles' or 'doubles'
  player1Id: varchar("player1_id").notNull().references(() => players.id),
  player2Id: varchar("player2_id").references(() => players.id), // null for singles
  isWin: boolean("is_win").notNull(),
  matchDate: text("match_date").notNull(), // Store as YYYY-MM-DD format
  leagueGameId: varchar("league_game_id").references(() => leagueGames.id, { onDelete: "set null" }), // Optional link to league game
  createdAt: timestamp("created_at").defaultNow(),
});

// League Games table - represents a full league game (6 singles + 3 doubles)
export const leagueGames = pgTable("league_games", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  scheduledDate: text("scheduled_date").notNull(), // Store as YYYY-MM-DD format
  scheduledTime: text("scheduled_time"), // Optional time in HH:MM format
  opponentTeamName: text("opponent_team_name").notNull(), // Name of the opposing team
  isHomeGame: boolean("is_home_game").notNull().default(true), // true = home, false = away
  description: text("description"), // Optional description/notes
  status: text("status").default("scheduled").notNull(),
  teamAScore: integer("team_a_score").default(0), // Total points won by team A
  teamBScore: integer("team_b_score").default(0), // Total points won by team B
  completedAt: timestamp("completed_at"), // When the league game was completed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// League Game Participants - tracks which players participate in each league game
export const leagueGameParticipants = pgTable("league_game_participants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leagueGameId: varchar("league_game_id").notNull().references(() => leagueGames.id, { onDelete: "cascade" }),
  playerId: varchar("player_id").notNull().references(() => players.id),
  team: text("team", { enum: ["A", "B"] }).notNull(), // Team A or Team B
  createdAt: timestamp("created_at").defaultNow(),
});