import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AdminDashboardStats from './AdminDashboardStats';
import AdminQuickAccess from './AdminQuickAccess';
import AdminSystemConfig from './AdminSystemConfig';
import AdminDataExport from './AdminDataExport';
import AdminMaintenanceMode from './AdminMaintenanceMode';
import AdminDataPurge from './AdminDataPurge';

const AdminDashboard = () => {
  // Mock stats data
  const stats = {
    totalCustomers: 1250,
    totalPros: 85,
    activeBookings: 42,
    completedBookings: 156,
    revenue: 25680,
    averageRating: 4.8,
    customerGrowth: 15,
    proGrowth: 8
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <AdminDashboardStats stats={stats} />

      {/* Quick Access */}
      <AdminQuickAccess />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Configuration */}
        <AdminSystemConfig />

        {/* Data Export */}
        <AdminDataExport />
      </div>

      {/* Data Purge */}
      <AdminDataPurge />

      {/* Maintenance Mode */}
      <AdminMaintenanceMode />
    </div>
  );
};

export default AdminDashboard;