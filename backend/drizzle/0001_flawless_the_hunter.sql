DO $$ BEGIN
 CREATE TYPE "exam_status" AS ENUM('draft', 'published', 'archived');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "question_type" AS ENUM('multiple_choice', 'single_choice', 'text');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DROP TABLE "access_keys";--> statement-breakpoint
ALTER TABLE "exams" ALTER COLUMN "title" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "exams" ALTER COLUMN "created_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "exam_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "options" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "options" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "exams" ADD COLUMN "duration" integer;--> statement-breakpoint
ALTER TABLE "exams" ADD COLUMN "available_from" timestamp;--> statement-breakpoint
ALTER TABLE "exams" ADD COLUMN "available_to" timestamp;--> statement-breakpoint
ALTER TABLE "exams" ADD COLUMN "status" "exam_status" DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE "exams" ADD COLUMN "total_questions" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "exams" ADD COLUMN "participants" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "text" text NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "type" "question_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "correct_answer" text;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "marks" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "time_blocks" ADD COLUMN "duration" integer;--> statement-breakpoint
ALTER TABLE "questions" DROP COLUMN IF EXISTS "description";--> statement-breakpoint
ALTER TABLE "questions" DROP COLUMN IF EXISTS "image_url";--> statement-breakpoint
ALTER TABLE "questions" DROP COLUMN IF EXISTS "correct_option";--> statement-breakpoint
ALTER TABLE "questions" DROP COLUMN IF EXISTS "is_active";