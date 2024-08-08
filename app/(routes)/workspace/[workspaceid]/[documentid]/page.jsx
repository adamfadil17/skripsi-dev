import { Room } from '@/app/Room';
import DocumentEditorSection from '@/components/shared/DocumentEditorSection';
import SideNav from '@/components/shared/SideNav';
import React from 'react';

const WorkspaceDocument = ({ params }) => {
  return (
    <Room params={params}>
      <div>
        {/* SideNav */}
        <div className="">
          <SideNav params={params} />
        </div>
        {/* Document*/}
        <div className="md:ml-72">
          <DocumentEditorSection params={params} />
        </div>
      </div>
    </Room>
  );
};

export default WorkspaceDocument;
