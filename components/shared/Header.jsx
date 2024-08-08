'use client';
import { db } from '@/lib/database/firebaseConfig';
import { OrganizationSwitcher, UserButton, useUser } from '@clerk/nextjs';
import { doc, setDoc } from 'firebase/firestore';
import Image from 'next/image';
import React, { useEffect } from 'react';

const Header = () => {
  const { user } = useUser();

  useEffect(() => {
    user && saveUserData();
  }, [user]);

  /**
   * Used to save user data
   */
  const saveUserData = async () => {
    const docId = user?.primaryEmailAddress?.emailAddress;
    try {
      await setDoc(doc(db, 'LoopUsers', docId), {
        name: user?.fullName,
        avatar: user?.imageUrl,
        email: user?.primaryEmailAddress?.emailAddress,
      });
    } catch (e) {
      throw new Error(`${e.message}`);
    }
  };
  return (
    <div className="flex items-center justify-between px-4 py-5 shadow-sm bg-white">
      <div className="flex items-center gap-2">
        <Image src={'/assets/logo.png'} alt="Logo" width={30} height={30} />
        <h2 className="font-bold text-xl">Loop</h2>
      </div>

      <OrganizationSwitcher
        afterCreateOrganizationUrl={'/dashboard'}
        afterLeaveOrganizationUrl={'/dashboard'}
      />
      <UserButton />
    </div>
  );
};

export default Header;
