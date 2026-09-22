'use client';

import React, { useState } from 'react';
import { DashboardProvider } from '@/context/DashboardContext';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProductsView } from '@/components/admin/ProductsView';
import { CategoriesView } from '@/components/admin/CategoriesView';
import { StoresView } from '@/components/admin/StoresView';
import { OrdersView } from '@/components/admin/OrdersView';
import { UsersView } from '@/components/admin/UsersView';
import { CashiersView } from '@/components/admin/CashiersView';
import { AdsView } from '@/components/admin/AdsView';
import { HomepageSectionsView } from '@/components/admin/HomepageSectionsView';
import { OverviewView } from '@/components/admin/OverviewView';
import { DeliveryView } from '@/components/admin/DeliveryView';
import { AuditLogsView } from '@/components/admin/AuditLogsView';
import { TagsView } from '@/components/admin/TagsView';
import { Box, Typography, Alert } from '@mui/material';

export default function AdminDashboardPage() {
  const [activeView, setActiveView] = useState('overview');

  const renderView = () => {
    switch (activeView) {
      case 'overview':
        return <OverviewView />;
      case 'products':
        return <ProductsView />;
      case 'categories':
        return <CategoriesView />;
      case 'stores':
        return <StoresView />;
      case 'orders':
        return <OrdersView />;
      case 'users':
        return <UsersView />;
      case 'ads':
        return <AdsView />;
      case 'cashiers':
        return <CashiersView />;
      case 'homepage':
        return <HomepageSectionsView />;
      case 'tags':
        return <TagsView />;
      case 'delivery':
        return <DeliveryView />;
      case 'audit-logs':
        return <AuditLogsView />;
      default:
        return (
          <Box sx={{ p: 3 }}>
            <Alert severity="info">This module is under development.</Alert>
          </Box>
        );
    }
  };

  return (
    <AdminLayout activeView={activeView} onViewChange={setActiveView}>
      {renderView()}
    </AdminLayout>
  );
}
