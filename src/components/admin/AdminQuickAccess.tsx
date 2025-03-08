import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  Calendar,
  Users,
  DollarSign,
  Star,
  MessageSquare,
  Settings,
  GripVertical
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuickAccessItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  href: string;
}

const defaultItems: QuickAccessItem[] = [
  { id: 'bookings', name: 'Bookings', icon: <Calendar className="w-5 h-5" />, href: '/admin/bookings' },
  { id: 'customers', name: 'Customers', icon: <Users className="w-5 h-5" />, href: '/admin/customers' },
  { id: 'payments', name: 'Payments', icon: <DollarSign className="w-5 h-5" />, href: '/admin/payments' },
  { id: 'reviews', name: 'Reviews', icon: <Star className="w-5 h-5" />, href: '/admin/reviews' },
  { id: 'messages', name: 'Messages', icon: <MessageSquare className="w-5 h-5" />, href: '/admin/messages' },
  { id: 'settings', name: 'Settings', icon: <Settings className="w-5 h-5" />, href: '/admin/settings' }
];

const AdminQuickAccess = () => {
  const [items, setItems] = useState(defaultItems);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Access</h2>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="quick-access">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <motion.div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      initial={false}
                      animate={snapshot.isDragging ? { scale: 1.02 } : { scale: 1 }}
                      className={`
                        flex items-center p-2 rounded-lg border
                        ${snapshot.isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}
                      `}
                    >
                      <div {...provided.dragHandleProps} className="mr-2 text-gray-400">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <Link
                        to={item.href}
                        className="flex items-center flex-1 text-gray-700 hover:text-gray-900"
                      >
                        {item.icon}
                        <span className="ml-3 text-sm font-medium">{item.name}</span>
                      </Link>
                    </motion.div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default AdminQuickAccess;