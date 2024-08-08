import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import CoverOptions from '@/lib/sharedImg/CoverOptions';
import Image from 'next/image';
import { Button } from '../ui/button';

const CoverPicker = ({ children, setNewCover }) => {
  const [selectedCover, setSelectedCover] = useState();

  return (
    <Dialog>
      <DialogTrigger className="w-full">{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Cover</DialogTitle>
          <DialogDescription>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-3">
              {CoverOptions.map((cover, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedCover(cover?.imageUrl)}
                  className={`${
                    selectedCover === cover?.imageUrl &&
                    'border-2 border-primary'
                  } p-1 rounded-md`}
                >
                  <Image
                    src={cover?.imageUrl}
                    alt="cover"
                    width={200}
                    height={140}
                    className="w-full h-[70px] object cover rounded-md"
                  />
                </div>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" onClick={() => setNewCover(selectedCover)}>
              Update
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CoverPicker;
