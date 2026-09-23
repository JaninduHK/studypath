CREATE TYPE "public"."account_type" AS ENUM('student', 'adviser', 'staff');--> statement-breakpoint
CREATE TYPE "public"."adviser_verification_status" AS ENUM('unsubmitted', 'pending', 'approved', 'rejected', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."staff_role" AS ENUM('administrator', 'moderator', 'support_agent', 'scholarship_editor');--> statement-breakpoint
CREATE TYPE "public"."funding_type" AS ENUM('fully_funded', 'partial');--> statement-breakpoint
CREATE TYPE "public"."scholarship_status" AS ENUM('open', 'closing_soon', 'closed', 'archived');--> statement-breakpoint
CREATE TYPE "public"."service_package_status" AS ENUM('draft', 'pending_review', 'active', 'paused');--> statement-breakpoint
CREATE TYPE "public"."service_type" AS ENUM('eligibility_assessment', 'scholarship_shortlist', 'cv_review', 'cv_creation', 'motivation_letter_coaching', 'document_review', 'interview_preparation', 'other');--> statement-breakpoint
CREATE TYPE "public"."order_event_type" AS ENUM('created', 'paid', 'delivered', 'revision_requested', 'revision_delivered', 'completed', 'cancelled', 'disputed', 'dispute_resolved', 'refunded', 'message');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending_payment', 'active', 'delivered', 'revision_requested', 'completed', 'cancelled', 'disputed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."payout_status" AS ENUM('pending', 'paid', 'failed');--> statement-breakpoint
CREATE TYPE "public"."document_access_action" AS ENUM('view', 'download');--> statement-breakpoint
CREATE TYPE "public"."document_kind" AS ENUM('cv', 'academic_transcript', 'degree_certificate', 'language_certificate', 'recommendation_letter', 'motivation_letter', 'identification', 'research_proposal', 'work_experience_letter', 'other');--> statement-breakpoint
CREATE TYPE "public"."virus_scan_status" AS ENUM('pending', 'clean', 'infected', 'error');--> statement-breakpoint
CREATE TYPE "public"."dispute_status" AS ENUM('open', 'under_review', 'resolved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."application_stage" AS ENUM('interested', 'preparing', 'ready_for_review', 'submitted', 'interview', 'awarded', 'rejected', 'withdrawn', 'archived');--> statement-breakpoint
CREATE TYPE "public"."cv_language" AS ENUM('en', 'de');--> statement-breakpoint
CREATE TYPE "public"."cv_status" AS ENUM('draft', 'final');--> statement-breakpoint
CREATE TYPE "public"."report_status" AS ENUM('open', 'under_review', 'actioned', 'dismissed');--> statement-breakpoint
CREATE TYPE "public"."report_target_type" AS ENUM('adviser_profile', 'service_package', 'review', 'message', 'scholarship');--> statement-breakpoint
CREATE TABLE "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "adviser_profile" (
	"user_id" text PRIMARY KEY NOT NULL,
	"professional_title" text,
	"bio" text,
	"country" text,
	"timezone" text,
	"verification_status" "adviser_verification_status" DEFAULT 'unsubmitted' NOT NULL,
	"identity_verified_at" timestamp with time zone,
	"verification_notes" text,
	"qualifications" jsonb DEFAULT '[]'::jsonb,
	"experience_years" numeric(4, 1),
	"languages" jsonb DEFAULT '[]'::jsonb,
	"specialization_fields" jsonb DEFAULT '[]'::jsonb,
	"supported_degree_levels" jsonb DEFAULT '[]'::jsonb,
	"portfolio_samples" jsonb DEFAULT '[]'::jsonb,
	"response_time_hours" numeric(5, 1),
	"rating_average" numeric(3, 2),
	"rating_count" integer DEFAULT 0 NOT NULL,
	"completed_order_count" integer DEFAULT 0 NOT NULL,
	"on_time_delivery_rate" numeric(5, 2),
	"repeat_client_rate" numeric(5, 2),
	"independence_disclaimer_accepted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "authenticator" (
	"credentialID" text NOT NULL,
	"userId" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "authenticator_userId_credentialID_pk" PRIMARY KEY("userId","credentialID"),
	CONSTRAINT "authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_profile" (
	"user_id" text PRIMARY KEY NOT NULL,
	"nationality" text,
	"country_of_residence" text,
	"education_level" text,
	"current_qualification" text,
	"gpa" numeric(4, 2),
	"gpa_scale" text,
	"field_of_study" text,
	"target_degree_level" text,
	"preferred_subjects" jsonb DEFAULT '[]'::jsonb,
	"language_qualifications" jsonb DEFAULT '[]'::jsonb,
	"work_experience_years" numeric(4, 1),
	"research_experience" text,
	"preferred_universities" jsonb DEFAULT '[]'::jsonb,
	"funding_requirement" text,
	"consent_processing_accepted_at" timestamp with time zone,
	"marketing_opt_in" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	"hashed_password" text,
	"account_type" "account_type" DEFAULT 'student' NOT NULL,
	"staff_role" "staff_role",
	"suspended_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "saved_scholarship" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" text NOT NULL,
	"scholarship_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scholarship_change_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scholarship_id" uuid NOT NULL,
	"field" text NOT NULL,
	"old_value" text,
	"new_value" text,
	"changed_by_user_id" text,
	"changed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scholarship" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"provider_name" text NOT NULL,
	"university_name" text,
	"degree_levels" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"subjects" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"funding_type" "funding_type" NOT NULL,
	"funding_amount_label" text NOT NULL,
	"funding_amount_min" numeric(10, 2),
	"funding_amount_max" numeric(10, 2),
	"funding_currency" text DEFAULT 'EUR' NOT NULL,
	"covered_expenses" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"eligible_nationalities" jsonb DEFAULT '"all"'::jsonb NOT NULL,
	"country_of_residence_restriction" text,
	"eligibility_requirements" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"language_requirements" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"gpa_requirement" text,
	"work_experience_requirement" text,
	"required_documents" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"open_date" date,
	"close_date" date,
	"is_rolling_deadline" boolean DEFAULT false NOT NULL,
	"application_process" text,
	"official_application_url" text,
	"official_source_urls" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" "scholarship_status" DEFAULT 'open' NOT NULL,
	"last_verified_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_verified_by_user_id" text,
	"superseded_by_scholarship_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "scholarship_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "service_package" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"adviser_id" text NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"service_type" "service_type" NOT NULL,
	"summary" text NOT NULL,
	"what_is_included" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"what_is_excluded" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"deliverables" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"student_prerequisites" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"process_steps" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"revisions_included" integer DEFAULT 0 NOT NULL,
	"delivery_days" integer NOT NULL,
	"price_amount" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'EUR' NOT NULL,
	"cancellation_policy" text,
	"refund_policy" text,
	"status" "service_package_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "service_package_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "order_event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"type" "order_event_type" NOT NULL,
	"actor_user_id" text,
	"payload" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" text NOT NULL,
	"adviser_id" text NOT NULL,
	"service_package_id" uuid NOT NULL,
	"related_scholarship_id" uuid,
	"package_snapshot" jsonb NOT NULL,
	"price_amount" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'EUR' NOT NULL,
	"platform_commission_amount" numeric(10, 2) NOT NULL,
	"status" "order_status" DEFAULT 'pending_payment' NOT NULL,
	"revisions_used" numeric(3, 0) DEFAULT '0' NOT NULL,
	"delivery_due_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"stripe_payment_intent_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payout" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"adviser_id" text NOT NULL,
	"order_id" uuid,
	"amount" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'EUR' NOT NULL,
	"status" "payout_status" DEFAULT 'pending' NOT NULL,
	"stripe_transfer_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_access_grant" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_id" uuid NOT NULL,
	"order_id" uuid NOT NULL,
	"grantee_user_id" text NOT NULL,
	"granted_by_user_id" text NOT NULL,
	"expires_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_access_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_id" uuid NOT NULL,
	"accessed_by_user_id" text NOT NULL,
	"action" "document_access_action" NOT NULL,
	"ip_address" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_version" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_id" uuid NOT NULL,
	"version_number" integer NOT NULL,
	"storage_key" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"kind" "document_kind" NOT NULL,
	"file_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"storage_key" text NOT NULL,
	"checksum_sha256" text NOT NULL,
	"virus_scan_status" "virus_scan_status" DEFAULT 'pending' NOT NULL,
	"current_version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "conversation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "conversation_order_id_unique" UNIQUE("order_id")
);
--> statement-breakpoint
CREATE TABLE "message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"sender_id" text NOT NULL,
	"body" text NOT NULL,
	"attachment_document_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"read_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "dispute" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"raised_by_user_id" text NOT NULL,
	"reason" text NOT NULL,
	"status" "dispute_status" DEFAULT 'open' NOT NULL,
	"evidence" jsonb DEFAULT '[]'::jsonb,
	"resolution_notes" text,
	"resolved_by_user_id" text,
	"resolved_at" timestamp with time zone,
	"refund_amount" numeric(10, 2),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"student_id" text NOT NULL,
	"adviser_id" text NOT NULL,
	"service_package_id" uuid NOT NULL,
	"rating_communication" integer NOT NULL,
	"rating_timeliness" integer NOT NULL,
	"rating_quality" integer NOT NULL,
	"rating_accuracy" integer NOT NULL,
	"comment" text,
	"adviser_response" text,
	"adviser_responded_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "review_order_id_unique" UNIQUE("order_id")
);
--> statement-breakpoint
CREATE TABLE "application_document" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"document_id" uuid NOT NULL,
	"role" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "application_task" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"title" text NOT NULL,
	"done" boolean DEFAULT false NOT NULL,
	"due_date" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "application" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" text NOT NULL,
	"scholarship_id" uuid,
	"stage" "application_stage" DEFAULT 'interested' NOT NULL,
	"progress_percent" integer DEFAULT 0 NOT NULL,
	"notes" text,
	"deadline" date,
	"submitted_at" timestamp with time zone,
	"result_decided_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cv_document" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"title" text NOT NULL,
	"template_key" text NOT NULL,
	"language" "cv_language" DEFAULT 'en' NOT NULL,
	"status" "cv_status" DEFAULT 'draft' NOT NULL,
	"sections" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cv_version" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cv_document_id" uuid NOT NULL,
	"version_number" integer NOT NULL,
	"snapshot" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_user_id" text,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"ip_address" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "report" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reporter_user_id" text NOT NULL,
	"target_type" "report_target_type" NOT NULL,
	"target_id" text NOT NULL,
	"reason" text NOT NULL,
	"status" "report_status" DEFAULT 'open' NOT NULL,
	"resolved_by_user_id" text,
	"resolution_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "adviser_profile" ADD CONSTRAINT "adviser_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_profile" ADD CONSTRAINT "student_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_scholarship" ADD CONSTRAINT "saved_scholarship_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_scholarship" ADD CONSTRAINT "saved_scholarship_scholarship_id_scholarship_id_fk" FOREIGN KEY ("scholarship_id") REFERENCES "public"."scholarship"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scholarship_change_history" ADD CONSTRAINT "scholarship_change_history_scholarship_id_scholarship_id_fk" FOREIGN KEY ("scholarship_id") REFERENCES "public"."scholarship"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scholarship_change_history" ADD CONSTRAINT "scholarship_change_history_changed_by_user_id_user_id_fk" FOREIGN KEY ("changed_by_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scholarship" ADD CONSTRAINT "scholarship_last_verified_by_user_id_user_id_fk" FOREIGN KEY ("last_verified_by_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_package" ADD CONSTRAINT "service_package_adviser_id_user_id_fk" FOREIGN KEY ("adviser_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_event" ADD CONSTRAINT "order_event_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_event" ADD CONSTRAINT "order_event_actor_user_id_user_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_adviser_id_user_id_fk" FOREIGN KEY ("adviser_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_service_package_id_service_package_id_fk" FOREIGN KEY ("service_package_id") REFERENCES "public"."service_package"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_related_scholarship_id_scholarship_id_fk" FOREIGN KEY ("related_scholarship_id") REFERENCES "public"."scholarship"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payout" ADD CONSTRAINT "payout_adviser_id_user_id_fk" FOREIGN KEY ("adviser_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payout" ADD CONSTRAINT "payout_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_access_grant" ADD CONSTRAINT "document_access_grant_document_id_document_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."document"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_access_grant" ADD CONSTRAINT "document_access_grant_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_access_grant" ADD CONSTRAINT "document_access_grant_grantee_user_id_user_id_fk" FOREIGN KEY ("grantee_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_access_grant" ADD CONSTRAINT "document_access_grant_granted_by_user_id_user_id_fk" FOREIGN KEY ("granted_by_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_access_log" ADD CONSTRAINT "document_access_log_document_id_document_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."document"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_access_log" ADD CONSTRAINT "document_access_log_accessed_by_user_id_user_id_fk" FOREIGN KEY ("accessed_by_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_version" ADD CONSTRAINT "document_version_document_id_document_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."document"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document" ADD CONSTRAINT "document_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_conversation_id_conversation_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_attachment_document_id_document_id_fk" FOREIGN KEY ("attachment_document_id") REFERENCES "public"."document"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dispute" ADD CONSTRAINT "dispute_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dispute" ADD CONSTRAINT "dispute_raised_by_user_id_user_id_fk" FOREIGN KEY ("raised_by_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dispute" ADD CONSTRAINT "dispute_resolved_by_user_id_user_id_fk" FOREIGN KEY ("resolved_by_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_adviser_id_user_id_fk" FOREIGN KEY ("adviser_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_service_package_id_service_package_id_fk" FOREIGN KEY ("service_package_id") REFERENCES "public"."service_package"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_document" ADD CONSTRAINT "application_document_application_id_application_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."application"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_document" ADD CONSTRAINT "application_document_document_id_document_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."document"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_task" ADD CONSTRAINT "application_task_application_id_application_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."application"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application" ADD CONSTRAINT "application_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application" ADD CONSTRAINT "application_scholarship_id_scholarship_id_fk" FOREIGN KEY ("scholarship_id") REFERENCES "public"."scholarship"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cv_document" ADD CONSTRAINT "cv_document_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cv_version" ADD CONSTRAINT "cv_version_cv_document_id_cv_document_id_fk" FOREIGN KEY ("cv_document_id") REFERENCES "public"."cv_document"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_user_id_user_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_reporter_user_id_user_id_fk" FOREIGN KEY ("reporter_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_resolved_by_user_id_user_id_fk" FOREIGN KEY ("resolved_by_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;