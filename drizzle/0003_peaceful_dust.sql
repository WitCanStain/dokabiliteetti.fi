ALTER TABLE "establishments" RENAME COLUMN "county" TO "municipality";--> statement-breakpoint
ALTER TABLE "establishments" DROP CONSTRAINT "establishments_license_number_unique";--> statement-breakpoint
ALTER TABLE "establishments" ADD COLUMN "business_id" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_business" ON "establishments" USING btree ("business_id","license_number");--> statement-breakpoint
ALTER TABLE "establishments" DROP COLUMN "formatted";--> statement-breakpoint
ALTER TABLE "establishments" DROP COLUMN "confidence";