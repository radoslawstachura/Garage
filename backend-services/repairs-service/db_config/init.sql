--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-08-28 10:19:35

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
-- TOC entry 220 (class 1259 OID 16622)
-- Name: repairs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.repairs (
    repair_id integer NOT NULL,
    car_id integer NOT NULL,
    mechanic_id integer NOT NULL,
    date date NOT NULL,
    description text,
    cost numeric(10,2) NOT NULL,
    work_time numeric(10,2),
    status character varying(20) NOT NULL,
    "time" time(0) without time zone NOT NULL,
    estimated_work_time numeric(10,2)
);


ALTER TABLE public.repairs OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16621)
-- Name: repairs_repair_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.repairs_repair_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.repairs_repair_id_seq OWNER TO postgres;

--
-- TOC entry 4814 (class 0 OID 0)
-- Dependencies: 219
-- Name: repairs_repair_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.repairs_repair_id_seq OWNED BY public.repairs.repair_id;


--
-- TOC entry 4657 (class 2604 OID 16625)
-- Name: repairs repair_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.repairs ALTER COLUMN repair_id SET DEFAULT nextval('public.repairs_repair_id_seq'::regclass);


--
-- TOC entry 4808 (class 0 OID 16622)
-- Dependencies: 220
-- Data for Name: repairs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.repairs (repair_id, car_id, mechanic_id, date, description, cost, work_time, status, "time", estimated_work_time) FROM stdin;
\.


--
-- TOC entry 4815 (class 0 OID 0)
-- Dependencies: 219
-- Name: repairs_repair_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

-- SELECT pg_catalog.setval('public.repairs_repair_id_seq', 3, true);


--
-- TOC entry 4659 (class 2606 OID 16630)
-- Name: repairs repairs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.repairs
    ADD CONSTRAINT repairs_pkey PRIMARY KEY (repair_id);

--INSERT INTO public.repairs(
--	car_id, mechanic_id, date, description, cost, work_time, status, "time", estimated_work_time)
--	VALUES (1, 2, '08.29.2025', 'Wymiana oleju', 500, 2, 'finished', '10:00', 2),
--        (3, 1, '08.28.2025', 'Wymiana sprzęgła', 1500, 4, 'finished', '08:00', 3),
--        (1, 2, '08.30.2025', 'Wymiana filtrów', 600, 1.5, 'pending', '12:00', 1.5);

INSERT INTO public.repairs
(car_id, mechanic_id, date, description, cost, work_time, status, "time", estimated_work_time)
VALUES
(3, 2, '2025-01-05', 'Wymiana oleju i filtrów', 450.00, 2.00, 'finished', '10:00:00', 2.00),
(1, 1, '2025-01-20', 'Naprawa hamulców', 850.00, 4.50, 'finished', '13:00:00', 4.00),
(2, 1, '2025-01-28', 'Wymiana akumulatora', 600.00, 1.50, 'finished', '09:00:00', 1.00),
(1, 2, '2025-02-03', 'Wymiana sprzęgła', 1200.00, 6.00, 'finished', '11:00:00', 5.50),
(3, 1, '2025-02-18', 'Diagnostyka silnika', 700.00, 3.00, 'finished', '14:00:00', 2.50),
(2, 2, '2025-03-10', 'Naprawa zawieszenia', 1100.00, 5.00, 'finished', '12:00:00', 4.50),
(1, 1, '2025-03-25', 'Wymiana klocków hamulcowych', 500.00, 2.00, 'finished', '15:00:00', 1.50),
(3, 1, '2025-03-30', 'Czyszczenie EGR', 400.00, 1.50, 'finished', '10:30:00', 1.50),
(2, 2, '2025-04-02', 'Naprawa układu chłodzenia', 950.00, 3.50, 'finished', '09:30:00', 3.00),
(3, 1, '2025-04-16', 'Wymiana świec zapłonowych', 350.00, 1.00, 'finished', '11:00:00', 1.00),
(1, 2, '2025-04-27', 'Czyszczenie przepustnicy', 400.00, 1.50, 'finished', '10:00:00', 1.50),
(2, 1, '2025-05-08', 'Naprawa alternatora', 800.00, 3.50, 'finished', '09:00:00', 3.00),
(3, 2, '2025-05-20', 'Wymiana paska rozrządu', 1500.00, 6.00, 'finished', '10:30:00', 5.50),
(1, 1, '2025-05-29', 'Wymiana amortyzatorów', 900.00, 4.00, 'finished', '13:00:00', 4.00),
(2, 2, '2025-06-04', 'Wymiana tarcz hamulcowych', 700.00, 3.00, 'finished', '10:00:00', 3.00),
(3, 1, '2025-06-18', 'Serwis klimatyzacji', 500.00, 2.00, 'finished', '11:30:00', 2.00),
(2, 2, '2025-07-09', 'Naprawa przekładni kierowniczej', 1300.00, 5.50, 'finished', '09:00:00', 5.00),
(3, 1, '2025-07-25', 'Wymiana pompy wody', 650.00, 2.50, 'finished', '14:00:00', 2.00),
(1, 2, '2025-08-02', 'Wymiana uszczelki pod głowicą', 1600.00, 7.00, 'finished', '08:00:00', 6.50),
(2, 1, '2025-08-17', 'Regeneracja turbiny', 1700.00, 7.50, 'finished', '10:00:00', 7.00),
(3, 2, '2025-08-29', 'Wymiana rozrusznika', 500.00, 2.00, 'finished', '13:00:00', 2.00),
(1, 1, '2025-09-07', 'Wymiana czujnika ABS', 400.00, 1.50, 'finished', '11:00:00', 1.50),
(2, 2, '2025-09-15', 'Naprawa układu wydechowego', 850.00, 3.50, 'finished', '10:30:00', 3.00),
(3, 1, '2025-09-28', 'Wymiana reflektora', 450.00, 1.00, 'finished', '12:00:00', 1.00),
(1, 2, '2024-06-10', 'Wymiana opon letnich', 300.00, 1.00, 'finished', '09:00:00', 1.00),
(2, 1, '2024-06-25', 'Wymiana klocków hamulcowych', 450.00, 2.00, 'finished', '11:00:00', 1.50),
(3, 2, '2024-07-05', 'Wymiana tarcz hamulcowych', 700.00, 3.00, 'finished', '10:00:00', 3.00),
(1, 1, '2024-07-22', 'Czyszczenie klimatyzacji', 250.00, 1.00, 'finished', '13:00:00', 1.00),
(3, 1, '2024-08-09', 'Wymiana filtrów powietrza', 200.00, 0.80, 'finished', '09:30:00', 0.80),
(2, 2, '2024-08-27', 'Naprawa zawieszenia', 1100.00, 5.00, 'finished', '10:00:00', 4.50),
(1, 2, '2024-09-10', 'Wymiana paska klinowego', 450.00, 2.00, 'finished', '09:00:00', 2.00),
(3, 1, '2024-09-29', 'Wymiana amortyzatorów', 950.00, 4.00, 'finished', '12:00:00', 3.50),
(2, 2, '2024-10-05', 'Wymiana świec zapłonowych', 350.00, 1.20, 'finished', '10:30:00', 1.00),
(1, 1, '2024-10-20', 'Naprawa alternatora', 800.00, 3.50, 'finished', '14:00:00', 3.00),
(3, 2, '2024-11-08', 'Wymiana akumulatora', 600.00, 1.50, 'finished', '09:00:00', 1.00),
(2, 1, '2024-11-25', 'Diagnostyka silnika', 700.00, 3.00, 'finished', '10:00:00', 2.50),
(1, 1, '2024-12-05', 'Naprawa układu wydechowego', 850.00, 3.00, 'finished', '11:00:00', 2.50),
(3, 2, '2024-12-18', 'Wymiana reflektora', 400.00, 1.00, 'finished', '15:00:00', 1.00);


-- Completed on 2025-08-28 10:19:35

--
-- PostgreSQL database dump complete
--

