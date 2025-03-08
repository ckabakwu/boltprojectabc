import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import PaymentIntegration from '../../components/admin/integrations/PaymentIntegration';
import MapIntegration from '../../components/admin/integrations/MapIntegration';
import AnalyticsIntegration from '../../components/admin/integrations/AnalyticsIntegration';

const IntegrationsPage: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and configure third-party service integrations
        </p>
      </div>

      <Tabs defaultValue="payment" className="space-y-6">
        <TabsList>
          <TabsTrigger value="payment">Payment Processing</TabsTrigger>
          <TabsTrigger value="maps">Maps & Location</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="payment">
          <PaymentIntegration />
        </TabsContent>

        <TabsContent value="maps">
          <MapIntegration />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsIntegration />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationsPage;