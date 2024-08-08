'use client';
import { Bell, Loader2Icon } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Progress } from '@/components/ui/progress';

import {
  collection,
  doc,
  onSnapshot,
  query,
  querySnapshot,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/database/firebaseConfig';
import DocumentList from './DocumentList';
import uuid4 from 'uuid4';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

const MAX_FILE = process.env.NEXT_PUBLIC_MAX_FILE_COUNT;

const SideNav = ({ params }) => {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [documentList, setDocumentList] = useState([]);

  useEffect(() => {
    params && getDocumentsList();
  }, [params]);

  const getDocumentsList = () => {
    const fetchDocument = query(
      collection(db, 'workspaceDocuments'),
      where('workspaceId', '==', Number(params?.workspaceid))
    );
    const unsubscribe = onSnapshot(fetchDocument, (querySnapshot) => {
      setDocumentList([]);
      querySnapshot.forEach((doc) => {
        setDocumentList((documentList) => [...documentList, doc.data()]);
      });
    });
  };

  const CreateNewDocument = async () => {
    if (documentList?.length >= MAX_FILE) {
      toast('Upgrade to add new file', {
        description:
          'You reach max file, Please upgrad for unlimited file creation',
        action: {
          label: 'Upgrade',
          onClick: () => console.log('Undo'),
        },
      });
      return;
    }

    setLoading(true);
    const docId = uuid4();
    await setDoc(doc(db, 'workspaceDocuments', docId.toString()), {
      workspaceId: Number(params?.workspaceid),
      createdBy: user?.primaryEmailAddress?.emailAddress,
      coverImage: null,
      emoji: null,
      id: docId,
      documentName: 'Untitled Document',
      documentOutput: [],
    });

    await setDoc(doc(db, 'documentOutput', docId.toString()), {
      docId: docId,
      output: [],
    });

    setLoading(false);
    router.replace(`/workspace/${params?.workspaceid}/${docId}`);
  };
  return (
    <div className="h-screen p-5 shadow-md md:w-72 md:block hidden fixed bg-white">
      <div className="flex items-center justify-between">
        <Link href={`/dashboard`}>
          <Image src={'/assets/logo.png'} alt="Logo" width={30} height={30} />
        </Link>
        <Bell className="h-5 w-5 text-gray-500" />
      </div>
      <hr className="my-5"></hr>
      <div className="flex items-center justify-between py-2">
        <h2 className="font-medium">Workspace Name</h2>
        <Button size="sm" onClick={CreateNewDocument}>
          {loading ? <Loader2Icon className="h-4 w-4 animate-spin" /> : '+'}
        </Button>
      </div>

      {/* Document List */}
      <DocumentList documentList={documentList} params={params} />

      {/* Progress Bar */}
      <div className="absolute bottom-10 w-[85%]">
        <Progress value={(documentList?.length / MAX_FILE) * 100} />
        <h2 className="font-light text-sm my-2">
          <strong>{documentList?.length}</strong> Out of <strong>5</strong>{' '}
          files used
        </h2>
        <h2 className="font-light text-sm">
          Upgrade your plane for unlimited access
        </h2>
      </div>
    </div>
  );
};

export default SideNav;
