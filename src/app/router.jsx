import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MarketingLayout } from '@/layouts/MarketingLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { LandingPage } from '@/pages/LandingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { DataPage } from '@/pages/DataPage';
import { VisualizePage } from '@/pages/VisualizePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <MarketingLayout>
        <LandingPage />
      </MarketingLayout>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <DashboardLayout>
        <DashboardPage />
      </DashboardLayout>
    ),
  },
  {
    path: '/data',
    element: (
      <DashboardLayout>
        <DataPage />
      </DashboardLayout>
    ),
  },
  {
    path: '/visualize',
    element: (
      <DashboardLayout>
        <VisualizePage />
      </DashboardLayout>
    ),
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

