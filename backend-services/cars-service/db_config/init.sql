--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-08-27 20:34:34

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
-- TOC entry 218 (class 1259 OID 16614)
-- Name: cars; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cars (
    car_id integer NOT NULL,
    registration_number character varying(15) NOT NULL,
    brand character varying(30) NOT NULL,
    model character varying(30) NOT NULL,
    production_year integer NOT NULL,
    mileage integer NOT NULL,
    owner_id integer NOT NULL,
    vin character varying(17),
    last_update_date date DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_deleted boolean DEFAULT FALSE NOT NULL,
    deleted_at TIMESTAMP NULL
);


ALTER TABLE public.cars OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16613)
-- Name: cars_car_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cars_car_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cars_car_id_seq OWNER TO postgres;

--
-- TOC entry 4814 (class 0 OID 0)
-- Dependencies: 217
-- Name: cars_car_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cars_car_id_seq OWNED BY public.cars.car_id;


--
-- TOC entry 4657 (class 2604 OID 16617)
-- Name: cars car_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cars ALTER COLUMN car_id SET DEFAULT nextval('public.cars_car_id_seq'::regclass);


--
-- TOC entry 4808 (class 0 OID 16614)
-- Dependencies: 218
-- Data for Name: cars; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cars (car_id, registration_number, brand, model, production_year, mileage, owner_id, vin, last_update_date) FROM stdin;
\.


--
-- TOC entry 4815 (class 0 OID 0)
-- Dependencies: 217
-- Name: cars_car_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

-- SELECT pg_catalog.setval('public.cars_car_id_seq', 0, true);


--
-- TOC entry 4660 (class 2606 OID 16620)
-- Name: cars cars_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cars
    ADD CONSTRAINT cars_pkey PRIMARY KEY (car_id);

INSERT INTO public.cars(
	registration_number, brand, model, production_year, mileage, owner_id, is_deleted)
	VALUES ('KK12345', 'Honda', 'Accord', 2011, 235000, 1, FALSE),
        ('KK10100', 'BMW', '3', 1996, 86500, 1, FALSE),
        ('KMY99000', 'Ford', 'Bronco', 1977, 310000, 2, FALSE),
        ('KWA55111', 'Honda', 'Civic', 2015, 135000, 1, TRUE),
        ('KCH22222', 'BMW', 'M5', 2018, 186500, 1, TRUE),
        ('KTY00012', 'Ford', 'Mondeo', 2007, 210000, 2, TRUE)
    ;

-- Completed on 2025-08-27 20:34:34

--
-- PostgreSQL database dump complete
--

