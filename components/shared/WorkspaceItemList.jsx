import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const WorkspaceItemList = ({ workspaceList }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
      {workspaceList.map((workspace, index) => (
        <Link href={`/workspace/${workspace.id}`} key={index}>
          <div
            className="border shadow-xl rounded-xl
        hover:scale-105 transition-all cursor-pointer"
          >
            <Image
              src={workspace?.coverImage}
              alt="cover"
              width={400}
              height={200}
              className="h-[150px] object-cover rounded-t-xl"
            />
            <div className="p-4">
              <h2 className="flex gap-2">
                {workspace.emoji} {workspace.workspaceName}
              </h2>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default WorkspaceItemList;
