--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-08-28 07:41:48

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
-- TOC entry 222 (class 1259 OID 16637)
-- Name: owners; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.owners (
    owner_id integer NOT NULL,
    firstname character varying(40) NOT NULL,
    lastname character varying(60) NOT NULL,
    email character varying(200),
    phone_number character varying(10) NOT NULL,
    address character varying(100)
);


ALTER TABLE public.owners OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16636)
-- Name: owners_owner_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.owners_owner_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.owners_owner_id_seq OWNER TO postgres;

--
-- TOC entry 4812 (class 0 OID 0)
-- Dependencies: 221
-- Name: owners_owner_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.owners_owner_id_seq OWNED BY public.owners.owner_id;


--
-- TOC entry 4657 (class 2604 OID 16640)
-- Name: owners owner_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.owners ALTER COLUMN owner_id SET DEFAULT nextval('public.owners_owner_id_seq'::regclass);


--
-- TOC entry 4806 (class 0 OID 16637)
-- Dependencies: 222
-- Data for Name: owners; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.owners (owner_id, firstname, lastname, email, phone_number, address) FROM stdin;
\.


--
-- TOC entry 4813 (class 0 OID 0)
-- Dependencies: 221
-- Name: owners_owner_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

-- SELECT pg_catalog.setval('public.owners_owner_id_seq', 5, true);


--
-- TOC entry 4659 (class 2606 OID 16642)
-- Name: owners owners_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.owners
    ADD CONSTRAINT owners_pkey PRIMARY KEY (owner_id);

INSERT INTO public.owners(
	firstname, lastname, email, phone_number, address)
	VALUES ('Jan', 'Kowalski', 'j.kowalski@gmail.com', '135135135', 'ul. Kwiatowa 10 Gdańsk'),
        ('Andrzej', 'Nowak', 'a.nowak@gmail.com', '531531531', 'ul. Królewska 100 Kraków');

-- Completed on 2025-08-28 07:41:49

--
-- PostgreSQL database dump complete
--

