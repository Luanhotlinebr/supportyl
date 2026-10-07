CREATE TYPE "document_type" AS ENUM('CPF', 'CNPJ');--> statement-breakpoint
CREATE TYPE "priority_type" AS ENUM('BAIXA', 'NORMAL', 'ALTA', 'URGENTE');--> statement-breakpoint
CREATE TYPE "role_type" AS ENUM('ADMIN', 'TECNICO');--> statement-breakpoint
CREATE TYPE "status_ticket" AS ENUM('ABERTO', 'ANDAMENTO', 'CONCLUIDO');--> statement-breakpoint
CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"author_id" uuid NOT NULL,
	"ticket_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL,
	"document_type" "document_type" DEFAULT 'CPF'::"document_type" NOT NULL,
	"document" varchar(18) NOT NULL UNIQUE,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"phone_number" varchar(16),
	"birth_date" date
);
--> statement-breakpoint
CREATE TABLE "ticket_histories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"action" varchar(50) NOT NULL,
	"previous_value" text,
	"new_value" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL,
	"ticket_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" varchar(128) NOT NULL,
	"description" text NOT NULL,
	"status" "status_ticket" DEFAULT 'ABERTO'::"status_ticket" NOT NULL,
	"priority" "priority_type" DEFAULT 'NORMAL'::"priority_type" NOT NULL,
	"created_by" uuid NOT NULL,
	"assigned_to" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL,
	"user_name" varchar(30) NOT NULL UNIQUE,
	"password_hash" text NOT NULL,
	"phone_number" varchar(16),
	"role" "role_type" DEFAULT 'TECNICO'::"role_type" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_users_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_ticket_id_tickets_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "ticket_histories" ADD CONSTRAINT "ticket_histories_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "ticket_histories" ADD CONSTRAINT "ticket_histories_ticket_id_tickets_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_created_by_users_id_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_assigned_to_users_id_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_customer_id_customers_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT;