-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

CREATE TABLE IF NOT EXISTS public.queue
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    "user" uuid NOT NULL,
    json_l_url text COLLATE pg_catalog."default" NOT NULL,
    status integer NOT NULL DEFAULT 0,
    CONSTRAINT queue_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.queue
    OWNER to postgres;

ALTER TABLE IF EXISTS public.queue
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.queue TO anon;

GRANT ALL ON TABLE public.queue TO authenticated;

GRANT ALL ON TABLE public.queue TO postgres;

GRANT ALL ON TABLE public.queue TO service_role;
