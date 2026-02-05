CREATE TABLE "establishments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"street_address" text,
	"city" text,
	"postcode" text,
	"county" text,
	"state" text,
	"country" text,
	"country_code" text,
	"formatted" text,
	"confidence" real,
	"location" geometry(point) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "spatial_index" ON "establishments" USING gist ("location");