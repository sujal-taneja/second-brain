/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog } from 'radix-ui';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Button } from './Button';
import { Copy } from 'react-feather';
import { useState } from 'react';
import { FRONTEND_URL, BACKEND_URL } from '../config';
import axios from 'axios';

async function copyLink(
  setCopied: (copied: boolean) => void,
  setError: (error: string) => void
) {
  try {
    setError('');
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/brain/share`,
      {
        share: 'true',
      },
      {
        headers: {
          authorization: 'Bearer ' + localStorage.getItem('authorization'),
        },
      }
    );
    setCopied(true);
    await navigator.clipboard.writeText(
      FRONTEND_URL + '/content/' + (response.data as { link: any }).link
    );
  } catch (error: any) {
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      const minutes = retryAfter ? Math.ceil(retryAfter / 60) : 5;
      setError(`Too many requests. Please try again in ${minutes} minutes.`);
    } else if (error.response?.data?.error) {
      setError(error.response.data.error);
    } else if (error.request) {
      setError('Network error. Please check your connection.');
    } else {
      setError('Failed to create share link. Please try again.');
    }
  }
}

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShareModal = ({ open, onOpenChange }: DialogProps) => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) {
          setCopied(false);
          setError('');
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-gray-900/40" />
        <Dialog.Content className="bg-white fixed left-1/2 top-1/2 max-h-[85vh] w-100 max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray1 p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow">
          <Dialog.Title className="m-0 text-[17px] font-medium text-mauve12">
            Share Your Second Brain
          </Dialog.Title>
          <Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal text-mauve11">
            Share your entire collection of notes, documents, tweets, and videos
            with others. They'll be able to import your content into their own
            Second Brain.
          </Dialog.Description>
          <Button
            variant={'submitSecondary'}
            size={'md'}
            text="Share Brain"
            onClick={() => copyLink(setCopied, setError)}
            startIcon={(size) => <Copy size={size} />}
          />
          <div className="text-center text-sm mt-2">
            {copied && <div className="text-green-600 font-medium">Link copied!</div>}
            {error && <div className="text-red-600 font-medium">{error}</div>}
          </div>
          <Dialog.Close asChild>
            <button
              className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-violet11 bg-gray3 hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ShareModal;
