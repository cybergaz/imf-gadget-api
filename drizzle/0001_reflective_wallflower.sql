CREATE TABLE "gadgets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"status" varchar(50) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "hashed_password" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "salt" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "name";