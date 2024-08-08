'use client';
import { useAuth, useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { AlignLeft, LayoutGrid } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import WorkspaceItemList from './WorkspaceItemList';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/database/firebaseConfig';

const WorkspaceList = () => {
  const { user } = useUser();
  const [workspaceList, setWorkspaceList] = useState([]);
  const { orgId } = useAuth();

  useEffect(() => {
    user && getWorkspaceList();
  }, [orgId, user]);

  const getWorkspaceList = async () => {
    setWorkspaceList([]);
    const fetchWorkspaceList = query(
      collection(db, 'Workspace'),
      where(
        'orgId',
        '==',
        orgId ? orgId : user?.primaryEmailAddress?.emailAddress
      )
    );

    const querySnapshot = await getDocs(fetchWorkspaceList);

    querySnapshot.forEach((doc) => {
      setWorkspaceList((prev) => [...prev, doc.data()]);
    });
  };

  return (
    <div className="my-10 p-10 md:px-24 lg:px-24 xl:px-52">
      <div className="w-full flex items-center justify-between">
        <h2 className="font-bold text-2xl">Hello, {user?.fullName}</h2>

        <Link href={'/createworkspace'}>
          <Button className="bg-primary">+</Button>
        </Link>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <div>
          <h2 className="font-medium text-xl text-primary">Workspace</h2>
        </div>

        <div className="flex gap-2">
          <LayoutGrid />
          <AlignLeft />
        </div>
      </div>

      {workspaceList?.length == 0 ? (
        <div className="flex flex-col items-center justify-center my-10">
          <Image
            src={'/assets/workspace.png'}
            alt="workspace"
            width={200}
            height={200}
          />
          <h2 className="font-medium">Create a new workspace</h2>
          <Link href={'/createworkspace'}>
            <Button variant="outline" className="my-3">
              + New workspace
            </Button>
          </Link>
        </div>
      ) : (
        <div>
          <WorkspaceItemList workspaceList={workspaceList} />
        </div>
      )}
    </div>
  );
};

export default WorkspaceList;
