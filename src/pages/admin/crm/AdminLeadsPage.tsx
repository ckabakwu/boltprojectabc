import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LeadPipeline from '../../../components/crm/LeadPipeline';
import { Lead, LeadStage } from '../../../lib/supabase';

// Mock data for leads and stages
const mockLeads: Lead[] = [
  {
    id: '1',
    first_name: 'John',
    last_name: 'Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    status: 'new',
    source: 'website',
    score: 85,
    created_at: '2025-03-15T10:00:00Z',
    updated_at: '2025-03-15T10:00:00Z',
    next_followup: '2025-03-16T14:00:00Z'
  },
  {
    id: '2',
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah.j@example.com',
    phone: '(555) 234-5678',
    status: 'contacted',
    source: 'referral',
    score: 92,
    created_at: '2025-03-14T15:30:00Z',
    updated_at: '2025-03-15T09:00:00Z',
    next_followup: '2025-03-17T11:00:00Z'
  }
];

const mockStages: LeadStage[] = [
  { id: 'new', name: 'New Leads', color: 'bg-blue-100' },
  { id: 'contacted', name: 'Contacted', color: 'bg-yellow-100' },
  { id: 'qualified', name: 'Qualified', color: 'bg-green-100' },
  { id: 'proposal', name: 'Proposal', color: 'bg-purple-100' },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-indigo-100' },
  { id: 'closed', name: 'Closed', color: 'bg-gray-100' }
];

const AdminLeadsPage = () => {
  const [leads, setLeads] = useState(mockLeads);
  const [stages] = useState(mockStages);

  const handleLeadMove = (leadId: string, sourceStage: string, targetStage: string) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === leadId ? { ...lead, status: targetStage } : lead
      )
    );
  };

  const handleLeadEdit = (lead: Lead) => {
    // Implement lead editing
    console.log('Edit lead:', lead);
  };

  const handleLeadDelete = (leadId: string) => {
    setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadId));
  };

  const handleLeadContact = (lead: Lead) => {
    // Implement lead contact functionality
    console.log('Contact lead:', lead);
  };

  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track and manage potential customers through the sales pipeline.
        </p>
      </div>

      <LeadPipeline
        leads={leads}
        stages={stages}
        onLeadMove={handleLeadMove}
        onLeadEdit={handleLeadEdit}
        onLeadDelete={handleLeadDelete}
        onLeadContact={handleLeadContact}
      />
    </div>
  );
};

export default AdminLeadsPage;