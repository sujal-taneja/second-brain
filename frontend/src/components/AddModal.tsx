/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog } from 'radix-ui';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Button } from './Button';
import { useRef, useState } from 'react';
import { BACKEND_URL } from '../config';
import axios from 'axios';
import { contentStateType } from './main/Main';
import { Icons } from './Icons';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  changeContentState: ({ title, type, link, tags }: contentStateType) => void;
}

const AddModal = ({ open, onOpenChange, changeContentState }: DialogProps) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const tagsRef = useRef<HTMLInputElement>(null);

  const errorDiv = useRef<HTMLDivElement>(null);
  const messageDiv = useRef<HTMLDivElement>(null);

  const [selectedType, setSelectedType] = useState('');
  const handleSelectChange = (e) => {
    setSelectedType(e.target.value);
  };

  async function addContent() {
    if (messageDiv.current == null || errorDiv.current == null) {
      return;
    }

    messageDiv.current.innerText = '';

    if (titleRef.current?.value.trim() === '') {
      errorDiv.current.innerText = 'Title can not be empty';
      return;
    } else {
      errorDiv.current.innerText = '';
    }

    const inputData = {
      title: titleRef.current?.value.trim(),
      type: selectedType.toLowerCase(),
      link: linkRef.current?.value.trim(),
      tags: tagsRef.current?.value.trim()
        ? tagsRef.current?.value.trim().split(',')
        : [],
    };

    for (const key in inputData) {
      if (inputData[key] === '') {
        delete inputData[key];
      }
    }

    const response = await axios.post(
      `${BACKEND_URL}/api/v1/content`,
      inputData,
      {
        headers: {
          authorization: 'Bearer ' + localStorage.getItem('authorization'),
        },
      }
    );

    changeContentState(inputData);

    messageDiv.current.innerText =
      (response.data as { message: any[] }).message + '!';
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-gray-900/40" />
        <Dialog.Content className="flex flex-col bg-white fixed left-1/2 top-1/2 max-h-[85vh] w-100 max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray1 p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow">
          <Dialog.Title className="m-0 text-[17px] font-medium text-mauve12">
            Add to Second Brain
          </Dialog.Title>
          <Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal text-mauve11">
            Store your thoughts, notes, or ideas for future reference.
          </Dialog.Description>
          <div
            ref={errorDiv}
            className="text-center text-red-600 text-sm"
          ></div>
          <div
            ref={messageDiv}
            className="text-center text-gray-600 text-sm"
          ></div>
          <fieldset className="mb-[15px] flex items-center gap-5 mt-3">
            <label className="w-[90px] text-right text-[15px]" htmlFor="title">
              Title
            </label>
            <input
              className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="title"
              placeholder="Title"
              ref={titleRef}
            />
          </fieldset>
          <fieldset className="mb-[15px] flex items-center gap-5">
            <label className="w-[90px] text-right text-[15px]" htmlFor="type">
              Type
            </label>
            <select
              className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-1 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="type"
              onChange={handleSelectChange}
            >
              {Object.entries(Icons).map(([key]) => (
                <option>{key.charAt(0).toUpperCase() + key.slice(1)}</option>
              ))}
            </select>
          </fieldset>
          <fieldset className="mb-[15px] flex items-center gap-5">
            <label className="w-[90px] text-right text-[15px]" htmlFor="link">
              Link
            </label>
            <input
              className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="link"
              placeholder="https://www.google.com"
              ref={linkRef}
            />
          </fieldset>
          <fieldset className="mb-[15px] flex items-center gap-5">
            <label className="w-[90px] text-right text-[15px]" htmlFor="tags">
              Tags
            </label>
            <input
              className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="tags"
              placeholder="Productivity, Music"
              ref={tagsRef}
            />
          </fieldset>
          <Button
            variant={'authPrimary'}
            size={'md'}
            text="Add Content"
            onClick={() => addContent()}
            className="self-end"
          />
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

export default AddModal;
