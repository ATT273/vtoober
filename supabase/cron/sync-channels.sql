-- Daily YouTube channel sync, scheduled with Supabase Cron (pg_cron + pg_net).
-- Run this once in the Supabase SQL Editor after deploying the app.
-- Replace the two placeholders below before running.

-- 1. Extensions (also available under Database > Extensions in the dashboard).
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- 2. Store the app URL and the shared secret in Vault instead of in the job body.
--    The secret must equal CRON_SECRET in the app's environment variables.
select vault.create_secret('https://<your-app-domain>', 'sync_channels_app_url');
select vault.create_secret('<same value as CRON_SECRET>', 'sync_channels_cron_secret');

-- 3. Schedule: pg_cron runs in UTC, so 17:00 UTC = 00:00 Asia/Ho_Chi_Minh (UTC+7).
--    cron.schedule with an existing job name replaces that job.
select cron.schedule(
  'sync-youtube-channels',
  '0 17 * * *',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'sync_channels_app_url')
           || '/api/cron/sync-channels',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'sync_channels_cron_secret')
    ),
    body := '{}'::jsonb,
    -- The sync can take a while; pg_net's default timeout is only a few seconds.
    timeout_milliseconds := 300000
  );
  $$
);

-- Useful queries:
--   select * from cron.job;                                                  -- scheduled jobs
--   select * from cron.job_run_details order by start_time desc limit 10;   -- did the job fire?
--   select id, status_code, content, error_msg, created
--     from net._http_response order by created desc limit 10;              -- what the app answered
--   select cron.unschedule('sync-youtube-channels');                         -- remove the job
