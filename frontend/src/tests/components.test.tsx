import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ContactForm from '../components/sections/ContactForm';
import ProjectCard from '../components/common/ProjectCard';
import ServiceCard from '../components/common/ServiceCard';
import type { Project, Service } from '../types';

// ── Mock the API module ───────────────────────────────────────
vi.mock('../services/api', () => ({
  contactApi: {
    submit: vi.fn(),
  },
}));

import { contactApi } from '../services/api';

// ── helpers ───────────────────────────────────────────────────
const mockProject: Project = {
  id: 1,
  title: 'Air Quality Prediction',
  description: 'ML project using Random Forest',
  techStack: 'Python,Scikit-learn,Flask',
  githubUrl: 'https://github.com/test',
  liveUrl: 'https://demo.test',
  imageUrl: null,
  featured: true,
  sortOrder: 1,
  createdAt: '2024-01-01T00:00:00',
  updatedAt: '2024-01-01T00:00:00',
};

const mockService: Service = {
  id: 1,
  title: 'Business Website Development',
  description: 'Professional websites for businesses',
  icon: '🏢',
  priceRange: '₹8,000 – ₹30,000',
  techStack: 'React,TypeScript,Node.js',
  githubUrl: 'https://github.com/test/service',
  liveUrl: 'https://demo.test/service',
  sortOrder: 1,
  active: true,
  createdAt: '2024-01-01T00:00:00',
  updatedAt: '2024-01-01T00:00:00',
};

const wrap = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}<Toaster /></MemoryRouter>);

// ════════════════════════════════════════════════
// ProjectCard tests
// ════════════════════════════════════════════════
describe('ProjectCard', () => {
  it('renders project title and description', () => {
    wrap(<ProjectCard project={mockProject} />);
    expect(screen.getByText('Air Quality Prediction')).toBeInTheDocument();
    expect(screen.getByText('ML project using Random Forest')).toBeInTheDocument();
  });

  it('renders tech stack tags', () => {
    wrap(<ProjectCard project={mockProject} />);
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('Scikit-learn')).toBeInTheDocument();
    expect(screen.getByText('Flask')).toBeInTheDocument();
  });

  it('renders GitHub link when provided', () => {
    wrap(<ProjectCard project={mockProject} />);
    const link = screen.getByText('🐱 GitHub').closest('a');
    expect(link).toHaveAttribute('href', 'https://github.com/test');
  });

  it('renders Live Demo link when provided', () => {
    wrap(<ProjectCard project={mockProject} />);
    const link = screen.getByText('🚀 Live Demo').closest('a');
    expect(link).toHaveAttribute('href', 'https://demo.test');
  });

  it('shows Featured badge when project is featured', () => {
    wrap(<ProjectCard project={mockProject} />);
    expect(screen.getByText('⭐ Featured')).toBeInTheDocument();
  });

  it('shows first letter placeholder when no imageUrl', () => {
    wrap(<ProjectCard project={{ ...mockProject, imageUrl: null }} />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('does NOT show GitHub link when githubUrl is null', () => {
    wrap(<ProjectCard project={{ ...mockProject, githubUrl: null }} />);
    expect(screen.queryByText('🐱 GitHub')).not.toBeInTheDocument();
  });
});

// ════════════════════════════════════════════════
// ServiceCard tests
// ════════════════════════════════════════════════
describe('ServiceCard', () => {
  it('renders service title and description', () => {
    wrap(<ServiceCard service={mockService} />);
    expect(screen.getByText('Business Website Development')).toBeInTheDocument();
    expect(screen.getByText('Professional websites for businesses')).toBeInTheDocument();
  });

  it('renders icon', () => {
    wrap(<ServiceCard service={mockService} />);
    expect(screen.getByText('🏢')).toBeInTheDocument();
  });

  it('renders price range', () => {
    wrap(<ServiceCard service={mockService} />);
    expect(screen.getByText('₹8,000 – ₹30,000')).toBeInTheDocument();
  });

  it('renders Get Started link pointing to /contact', () => {
    wrap(<ServiceCard service={mockService} />);
    const link = screen.getByText('Get Started →').closest('a');
    expect(link).toHaveAttribute('href', '/contact');
  });

  it('shows default icon when icon is null', () => {
    wrap(<ServiceCard service={{ ...mockService, icon: null }} />);
    expect(screen.getByText('⚡')).toBeInTheDocument();
  });
});

// ════════════════════════════════════════════════
// ContactForm tests
// ════════════════════════════════════════════════
describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields', () => {
    wrap(<ContactForm />);
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Subject')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
  });

  it('shows validation errors when submitted empty', async () => {
    wrap(<ContactForm />);
    fireEvent.click(screen.getByText('📨 Send Message'));
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });

  it('shows email validation error for invalid email', async () => {
    wrap(<ContactForm />);
    fireEvent.change(screen.getByLabelText('Full Name'),    { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'not-an-email' } });
    fireEvent.click(screen.getByText('📨 Send Message'));
    await waitFor(() => {
      expect(screen.getByText('Enter a valid email')).toBeInTheDocument();
    });
  });

  it('calls contactApi.submit with correct data on valid submit', async () => {
    (contactApi.submit as ReturnType<typeof vi.fn>).mockResolvedValue({
      success: true,
      message: 'Message sent!',
      data: {},
    });

    wrap(<ContactForm />);
    fireEvent.change(screen.getByLabelText('Full Name'),    { target: { value: 'Manideep' } });
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Message'),       { target: { value: 'I need a website for my business.' } });

    // Select subject from dropdown
    const select = screen.getByLabelText('Subject') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'Business Website Development' } });

    fireEvent.click(screen.getByText('📨 Send Message'));

    await waitFor(() => {
      expect(contactApi.submit).toHaveBeenCalledWith({
        name: 'Manideep',
        email: 'test@example.com',
        subject: 'Business Website Development',
        message: 'I need a website for my business.',
      });
    });
  });

  it('shows success state after successful submission', async () => {
    (contactApi.submit as ReturnType<typeof vi.fn>).mockResolvedValue({
      success: true,
      message: 'Thank you Manideep! Your message has been received.',
      data: { id: 1 },
    });

    wrap(<ContactForm />);
    fireEvent.change(screen.getByLabelText('Full Name'),    { target: { value: 'Manideep' } });
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Message'),       { target: { value: 'Hello from my business.' } });
    const select = screen.getByLabelText('Subject') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'Business Website Development' } });

    fireEvent.click(screen.getByText('📨 Send Message'));

    await waitFor(() => {
      expect(screen.getByText('Message Sent!')).toBeInTheDocument();
    });
  });
});
