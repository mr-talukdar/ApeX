-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.group_memberships (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid,
  group_id text,
  status text DEFAULT 'PENDING'::text,
  CONSTRAINT group_memberships_pkey PRIMARY KEY (id),
  CONSTRAINT group_memberships_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.groups (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text,
  is_active boolean DEFAULT true,
  join_policy text DEFAULT 'OPEN'::text,
  CONSTRAINT groups_pkey PRIMARY KEY (id)
);
CREATE TABLE public.ride_participants (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  ride_id uuid NOT NULL,
  user_id uuid NOT NULL,
  joined_at timestamp with time zone DEFAULT now(),
  status text NOT NULL,
  CONSTRAINT ride_participants_pkey PRIMARY KEY (id),
  CONSTRAINT ride_participants_ride_id_fkey FOREIGN KEY (ride_id) REFERENCES public.rides(id),
  CONSTRAINT ride_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.ride_ratings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  ride_id uuid NOT NULL,
  rider_id uuid NOT NULL,
  rated_by uuid NOT NULL,
  ratings jsonb NOT NULL,
  score integer NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ride_ratings_pkey PRIMARY KEY (id),
  CONSTRAINT ride_ratings_ride_id_fkey FOREIGN KEY (ride_id) REFERENCES public.rides(id),
  CONSTRAINT ride_ratings_rider_id_fkey FOREIGN KEY (rider_id) REFERENCES public.users(id),
  CONSTRAINT ride_ratings_rated_by_fkey FOREIGN KEY (rated_by) REFERENCES public.users(id)
);
CREATE TABLE public.rides (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  group_id bigint NOT NULL,
  title text NOT NULL,
  description text,
  start_time timestamp with time zone NOT NULL,
  status text NOT NULL,
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT rides_pkey PRIMARY KEY (id),
  CONSTRAINT rides_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id),
  CONSTRAINT rides_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id)
);
CREATE TABLE public.user_stats (
  user_id uuid NOT NULL,
  total_points integer NOT NULL,
  rides_completed integer NOT NULL,
  average_score integer NOT NULL,
  CONSTRAINT user_stats_pkey PRIMARY KEY (user_id),
  CONSTRAINT user_stats_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  email text UNIQUE,
  name text,
  avatar_url text,
  status text DEFAULT 'ACTIVE'::text,
  role text DEFAULT 'MEMBER'::text,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);