'use client';
import CoverPicker from '@/components/shared/CoverPicker';
import EmojiPickerComponent from '@/components/shared/EmojiPickerComponent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/database/firebaseConfig';
import { useAuth, useUser } from '@clerk/nextjs';
import { doc, setDoc } from 'firebase/firestore';
import { Loader2Icon, SmilePlus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import uuid4 from 'uuid4';

const CreateWorkspace = () => {
  const { user } = useUser();
  const { orgId } = useAuth();
  const [coverImage, setCoverImage] = useState('/assets/cover.png');
  const [workspaceName, setWorkspaceName] = useState();
  const [emoji, setEmoji] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const OnCreateWorkspace = async () => {
    setLoading(true);
    const workspaceId = Date.now();

    const result = await setDoc(doc(db, 'Workspace', workspaceId.toString()), {
      workspaceName: workspaceName,
      emoji: emoji,
      coverImage: coverImage,
      createdBy: user?.primaryEmailAddress?.emailAddress,
      id: workspaceId,
      orgId: orgId ? orgId : user?.primaryEmailAddress?.emailAddress,
    });

    const docId = uuid4();
    await setDoc(doc(db, 'workspaceDocuments', docId.toString()), {
      workspaceId: workspaceId,
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
    router.replace(`/workspace/${workspaceId}/${docId}`);
  };

  return (
    <div className="p-10 py-28 md:px-36 lg:px-64 xl:px-96">
      <div className="shadow-2xl rounded-xl">
        <CoverPicker setNewCover={(v) => setCoverImage(v)}>
          <div className="relative group cursor-pointer">
            <h2 className="hidden absolute p-4 w-full h-full group-hover:flex items-center justify-center font-medium">
              Change Cover
            </h2>
            <div className="group-hover:opacity-40">
              <Image
                src={coverImage}
                alt="cover"
                width={400}
                height={400}
                className="w-full h-[180px] rounded-t-xl object-cover"
              />
            </div>
          </div>
        </CoverPicker>

        <div className="p-12">
          <h2 className="font-medium text-xl">Create a new workspace</h2>
          <h2>
            This is a shared space where you can collaborate with your team. You
            can always rename it later.
          </h2>
          <div className="mt-8 flex items-center gap-2">
            <EmojiPickerComponent setEmoji={(v) => setEmoji(v)}>
              <Button variant="outline">{emoji ? emoji : <SmilePlus />}</Button>
            </EmojiPickerComponent>
            <Input
              placeholder="Workspace name"
              onChange={(e) => setWorkspaceName(e.target.value)}
            />
          </div>

          <div className="mt-7 flex gap-6 items-center justify-end">
            <Button
              disabled={!workspaceName?.length || loading}
              onClick={OnCreateWorkspace}
            >
              Create {loading && <Loader2Icon className="ml-2 animate-spin" />}
            </Button>

            <Link href={`/dashboard`}>
              <Button variant="outline">Cancel</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkspace;
