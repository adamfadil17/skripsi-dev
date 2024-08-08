import DocumentHeader from '@/components/shared/DocumentHeader';
import SideNav from '@/components/shared/SideNav';
import React from 'react';

const Workspace = ({ params }) => {
  return (
    <div>
      <SideNav params={params} />
      <DocumentHeader />
    </div>
  );
};

export default Workspace;
