-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

CREATE TABLE IF NOT EXISTS public.queue
(
    id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    "user" uuid NOT NULL,
    jsonl uuid,
    status integer NOT NULL DEFAULT 0,
    status_change_at timestamp with time zone NOT NULL DEFAULT now(),
    job_type text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT queue_pkey PRIMARY KEY (id),
    CONSTRAINT queue_jsonl_fkey FOREIGN KEY (jsonl)
        REFERENCES storage.objects (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
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


CREATE POLICY "Public Insert Access"
    ON public.queue
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK (((auth.role() = 'authenticated'::text) AND ("user" = auth.uid())));



CREATE OR REPLACE FUNCTION public.request_job(
	)
    RETURNS public.queue
    LANGUAGE 'sql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
  with latest_queue as (
    select * from queue
    where (queue.status = 0)
    order by created_at asc
    limit 1
  )
  update queue q SET status = 1, status_change_at = NOW()  FROM latest_queue WHERE latest_queue.id = q.id RETURNING q.*;
$BODY$;

ALTER FUNCTION public.request_job()
    OWNER TO postgres;

GRANT EXECUTE ON FUNCTION public.request_job() TO PUBLIC;

GRANT EXECUTE ON FUNCTION public.request_job() TO anon;

GRANT EXECUTE ON FUNCTION public.request_job() TO authenticated;

GRANT EXECUTE ON FUNCTION public.request_job() TO postgres;

GRANT EXECUTE ON FUNCTION public.request_job() TO service_role;

CREATE OR REPLACE FUNCTION public.create_job(
	this_jsonl_id uuid,
	this_job_type text)
    RETURNS text
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
  IF this_jsonl_id is NULL THEN
    RETURN 'jsonl not found!';
  ELSE 
    insert into queue (job_type, jsonl, "user") 
    VALUES (this_job_type, this_jsonl_id, auth.uid());
    RETURN 'success';
  END IF;

END;
$BODY$;

ALTER FUNCTION public.create_job(uuid, text)
    OWNER TO postgres;

GRANT EXECUTE ON FUNCTION public.create_job(uuid, text) TO PUBLIC;

GRANT EXECUTE ON FUNCTION public.create_job(uuid, text) TO anon;

GRANT EXECUTE ON FUNCTION public.create_job(uuid, text) TO authenticated;

GRANT EXECUTE ON FUNCTION public.create_job(uuid, text) TO postgres;

GRANT EXECUTE ON FUNCTION public.create_job(uuid, text) TO service_role;

