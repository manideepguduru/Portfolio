-- ============================================================
-- Portfolio Database Schema
-- Run this file once in MySQL before starting the application
-- ============================================================

CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- ── Projects ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(200)  NOT NULL,
    description TEXT          NOT NULL,
    tech_stack  VARCHAR(500)  NOT NULL,
    github_url  VARCHAR(500),
    live_url    VARCHAR(500),
    image_url   VARCHAR(500),
    featured    BOOLEAN       NOT NULL DEFAULT FALSE,
    sort_order  INT           NOT NULL DEFAULT 0,
    created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Services ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(200)  NOT NULL,
    description TEXT          NOT NULL,
    icon        VARCHAR(100),
    price_range VARCHAR(100),
    sort_order  INT           NOT NULL DEFAULT 0,
    active      BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Contacts ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(150)  NOT NULL,
    email       VARCHAR(255)  NOT NULL,
    phone       VARCHAR(20),
    subject     VARCHAR(300)  NOT NULL,
    message     TEXT          NOT NULL,
    read_status BOOLEAN       NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Seed Data
-- ============================================================

-- Projects
INSERT INTO projects (title, description, tech_stack, github_url, live_url, featured, sort_order) VALUES
(
  'Air Quality Prediction System',
  'A machine learning system that predicts the Air Quality Index using Linear Regression, Decision Trees, and Random Forest. Analyses environmental sensor data to forecast pollution levels and surface health recommendations.',
  'Python,Scikit-learn,Pandas,Matplotlib,Flask',
  'https://github.com/manideep',
  NULL,
  TRUE, 1
),
(
  'Currency Converter',
  'Real-time currency converter web app that fetches live exchange rates via a public REST API. Supports 100+ currencies with an intuitive, fully-responsive interface built in JavaScript.',
  'JavaScript,HTML5,CSS3,REST API',
  'https://github.com/manideep',
  'https://currency.manideep.dev',
  TRUE, 2
),
(
  'Business Portfolio Website',
  'A full-featured business portfolio website with a React + TypeScript frontend and Spring Boot + MySQL backend. Includes a dynamic projects section, services, contact form, and admin panel.',
  'React,TypeScript,Spring Boot,MySQL',
  'https://github.com/manideep',
  NULL,
  FALSE, 3
);

-- Services
INSERT INTO services (title, description, icon, price_range, sort_order) VALUES
(
  'Business Website Development',
  'Professional, high-converting websites tailored for businesses — from startups to established brands. Includes custom design, SEO optimisation, mobile-first layout, and Google Maps/contact integration. Perfect for restaurants, shops, clinics, agencies, and any business that needs a strong online presence.',
  '🏢', '₹8,000 – ₹30,000', 1
),
(
  'Final Year Project Development',
  'Complete final year project help for B.Tech / MCA / BCA / M.Tech students. I build fully functional projects with source code, documentation, and a working demo. Topics include web applications, machine learning, automation, APIs, and more — all submission-ready.',
  '🎓', '₹2,500 – ₹8,000', 2
),
(
  'Static & Dynamic Pages with Payment Integration',
  'Build high-performance pages tailored to your needs — static for speed and SEO, dynamic for interactivity and real-time features. Full payment gateway integration (Stripe, PayPal, Razorpay) for immediate monetization. Deploy with 99.9% uptime guarantees.',
  '💳', '₹5,000 – ₹25,000', 3
),
(
  'Domain Setup & Deployment',
  'Complete end-to-end deployment with domain configuration, SSL certificates, CDN optimization, auto-scaling, and continuous monitoring. Includes 24/7 support, automatic backups, and performance optimisation. Your project goes live and stays live.',
  '🌐', '₹2,000 – ₹8,000', 4
),
(
  'Testing & QA',
  'Functional, regression, and automation testing using Selenium and JUnit to ensure your product is rock-solid before going live.',
  '🔍', '₹2,000 – ₹12,000', 5
),
(
  'Resume Consultancy',
  'ATS-optimised resume writing and career guidance tailored to your target role. Includes a LinkedIn profile review and cover letter template.',
  '📄', '₹499 – ₹999', 6
);
