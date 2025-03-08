import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Star,
  MoreVertical,
  Edit,
  Trash2,
  MessageSquare
} from 'lucide-react';
import type { Lead, LeadStage } from '../../lib/supabase';

interface LeadPipelineProps {
  leads: Lead[];
  stages: LeadStage[];
  onLeadMove: (leadId: string, sourceStage: string, targetStage: string) => void;
  onLeadEdit: (lead: Lead) => void;
  onLeadDelete: (leadId: string) => void;
  onLeadContact: (lead: Lead) => void;
}

const LeadPipeline: React.FC<LeadPipelineProps> = ({
  leads,
  stages,
  onLeadMove,
  onLeadEdit,
  onLeadDelete,
  onLeadContact
}) => {
  const [groupedLeads, setGroupedLeads] = useState<Record<string, Lead[]>>({});
  const [activeStage, setActiveStage] = useState<string | null>(null);

  useEffect(() => {
    // Group leads by stage
    const grouped = leads.reduce((acc, lead) => {
      const stage = lead.status;
      if (!acc[stage]) {
        acc[stage] = [];
      }
      acc[stage].push(lead);
      return acc;
    }, {} as Record<string, Lead[]>);
    
    setGroupedLeads(grouped);
  }, [leads]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceStage = result.source.droppableId;
    const targetStage = result.destination.droppableId;
    const leadId = result.draggableId;

    if (sourceStage !== targetStage) {
      onLeadMove(leadId, sourceStage, targetStage);
    }
  };

  const getStageColor = (stage: LeadStage) => {
    return stage.color || 'bg-gray-100';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="h-full">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className="flex-shrink-0 w-80"
            >
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${getStageColor(stage)} mr-2`} />
                      <h3 className="font-medium text-gray-900">{stage.name}</h3>
                    </div>
                    <span className="text-sm text-gray-500">
                      {groupedLeads[stage.id]?.length || 0}
                    </span>
                  </div>
                </div>

                <Droppable droppableId={stage.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="p-2 min-h-[200px]"
                    >
                      {groupedLeads[stage.id]?.map((lead, index) => (
                        <Draggable
                          key={lead.id}
                          draggableId={lead.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <motion.div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              initial={false}
                              animate={snapshot.isDragging ? { scale: 1.05 } : { scale: 1 }}
                              className={`bg-white rounded-lg shadow-sm p-4 mb-2 ${
                                snapshot.isDragging ? 'shadow-md' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-gray-500" />
                                  </div>
                                  <div className="ml-3">
                                    <h4 className="font-medium text-gray-900">
                                      {lead.first_name} {lead.last_name}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                      {lead.source || 'Direct'}
                                    </p>
                                  </div>
                                </div>
                                <div className="relative">
                                  <button
                                    onClick={() => setActiveStage(activeStage === lead.id ? null : lead.id)}
                                    className="text-gray-400 hover:text-gray-600"
                                  >
                                    <MoreVertical className="w-5 h-5" />
                                  </button>
                                  {activeStage === lead.id && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                      <div className="py-1">
                                        <button
                                          onClick={() => onLeadEdit(lead)}
                                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        >
                                          <Edit className="w-4 h-4 mr-2" />
                                          Edit Lead
                                        </button>
                                        <button
                                          onClick={() => onLeadContact(lead)}
                                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        >
                                          <MessageSquare className="w-4 h-4 mr-2" />
                                          Contact
                                        </button>
                                        <button
                                          onClick={() => onLeadDelete(lead.id)}
                                          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                        >
                                          <Trash2 className="w-4 h-4 mr-2" />
                                          Delete
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-2 text-sm">
                                {lead.email && (
                                  <div className="flex items-center text-gray-500">
                                    <Mail className="w-4 h-4 mr-2" />
                                    {lead.email}
                                  </div>
                                )}
                                {lead.phone && (
                                  <div className="flex items-center text-gray-500">
                                    <Phone className="w-4 h-4 mr-2" />
                                    {lead.phone}
                                  </div>
                                )}
                                {lead.city && lead.state && (
                                  <div className="flex items-center text-gray-500">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    {lead.city}, {lead.state}
                                  </div>
                                )}
                              </div>

                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center text-gray-500">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {formatDate(lead.created_at)}
                                  </div>
                                  <div className="flex items-center">
                                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                    <span className="text-gray-700">{lead.score}</span>
                                  </div>
                                  {lead.next_followup && (
                                    <div className="flex items-center text-gray-500">
                                      <Clock className="w-4 h-4 mr-1" />
                                      {formatDate(lead.next_followup)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default LeadPipeline;