import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin">
      <div className="h-12 w-12 border-4 border-woolmatt-light border-t-woolmatt-primary rounded-full"></div>
    </div>
  </div>
);