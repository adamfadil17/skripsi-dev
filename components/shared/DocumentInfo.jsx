'use client';
import React, { useEffect, useState } from 'react';
import CoverPicker from './CoverPicker';
import Image from 'next/image';
import { SmilePlus } from 'lucide-react';
import EmojiPickerComponent from './EmojiPickerComponent';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/database/firebaseConfig';
import { toast } from 'sonner';

const DocumentInfo = ({ params }) => {
  const [coverImage, setCoverImage] = useState('/assets/cover.png');
  const [emoji, setEmoji] = useState();
  const [documentInfo, setDocumentInfo] = useState();

  useEffect(() => {
    params && getDocumentInfo();
  }, [params]);

  const getDocumentInfo = async () => {
    const docRef = doc(db, 'workspaceDocuments', params?.documentid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setDocumentInfo(docSnap.data());
      setEmoji(docSnap?.data()?.emoji);
      docSnap.data()?.coverImage && setCoverImage(docSnap.data()?.coverImage);
    }
  };

  const updateDocumentInfo = async (key, value) => {
    const docRef = doc(db, 'workspaceDocuments', params?.documentid);
    await updateDoc(docRef, {
      [key]: value,
    });
    toast('Document Updated!');
  };

  return (
    <div>
      {/* Cover */}
      <CoverPicker
        setNewCover={(cover) => {
          setCoverImage(cover);
          updateDocumentInfo('coverImage', cover);
        }}
      >
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
              className="w-full h-[200px] object-cover"
            />
          </div>
        </div>
      </CoverPicker>

      {/* Emoji Picker */}

      <div className="absolute ml-10 mt-[-40px] cursor-pointer">
        <EmojiPickerComponent
          setEmoji={(emoji) => {
            setEmoji(emoji);
            updateDocumentInfo('emoji', emoji);
          }}
        >
          <div className="bg-[#ffffffb0] p-4 rounded-md">
            {emoji ? (
              <span className="text-5xl">{emoji}</span>
            ) : (
              <SmilePlus className="h-10 w-10 text-gray-500" />
            )}
          </div>
        </EmojiPickerComponent>
      </div>

      {/* File Name */}

      <div className="mt-10 px-20 ml-10 p-10">
        <input
          type="text"
          placeholder="Untitled Document"
          defaultValue={documentInfo?.documentName}
          className="font-bold text-4xl outline-none"
          onBlur={(event) =>
            updateDocumentInfo('documentName', event.target.value)
          }
        />
      </div>
    </div>
  );
};

export default DocumentInfo;
