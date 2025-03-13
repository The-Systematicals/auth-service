CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"username" varchar(255),
	"email" varchar(255),
	"password" varchar(255),
	"refresh_token" text,
	"date_last_login" timestamp,
	"date_last_change_password" timestamp,
	"date_last_failed_login" timestamp,
	"date_lockout_expiration" timestamp,
	"failed_login_attempts" integer DEFAULT 0,
	"is_account_locked" smallint DEFAULT 0,
	"is_active" smallint DEFAULT 1,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DROP TABLE "auth_users" CASCADE;