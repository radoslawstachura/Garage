--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-08-28 07:11:10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 16644)
-- Name: mechanics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mechanics (
    mechanic_id integer NOT NULL,
    firstname character varying(40) NOT NULL,
    lastname character varying(60) NOT NULL,
    specialization character varying(50) NOT NULL,
    phone_number character varying(10) NOT NULL,
    email character varying(200) NOT NULL
);


ALTER TABLE public.mechanics OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16643)
-- Name: mechanics_mechanic_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mechanics_mechanic_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mechanics_mechanic_id_seq OWNER TO postgres;

--
-- TOC entry 4813 (class 0 OID 0)
-- Dependencies: 223
-- Name: mechanics_mechanic_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mechanics_mechanic_id_seq OWNED BY public.mechanics.mechanic_id;


--
-- TOC entry 4657 (class 2604 OID 16647)
-- Name: mechanics mechanic_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mechanics ALTER COLUMN mechanic_id SET DEFAULT nextval('public.mechanics_mechanic_id_seq'::regclass);


--
-- TOC entry 4807 (class 0 OID 16644)
-- Dependencies: 224
-- Data for Name: mechanics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mechanics (mechanic_id, firstname, lastname, specialization, phone_number, email) FROM stdin;
\.


--
-- TOC entry 4814 (class 0 OID 0)
-- Dependencies: 223
-- Name: mechanics_mechanic_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

-- SELECT pg_catalog.setval('public.mechanics_mechanic_id_seq', 0, true);


--
-- TOC entry 4659 (class 2606 OID 16649)
-- Name: mechanics mechanics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mechanics
    ADD CONSTRAINT mechanics_pkey PRIMARY KEY (mechanic_id);

INSERT INTO public.mechanics(
	firstname, lastname, specialization, phone_number, email)
	VALUES ('Waldemar', 'Specowski', 'engines', '123456798', 'w.specowski@garage.com'),
        ('Tomasz', 'Sprzęgłowski', 'clutch', '111222333', 't.sprzeglowski@garage.com');

--
-- TOC entry 4660 (class 2620 OID 16696)
-- Name: mechanics create_user_after_mechanic_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

-- Completed on 2025-08-28 07:11:10

--
-- PostgreSQL database dump complete
--

