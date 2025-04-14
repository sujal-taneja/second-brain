/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogOut, Plus, Share2 } from 'react-feather';
import { Button } from '../Button';
import ShareModal from '../ShareModal';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../config';
import AddModal from '../AddModal';
import CardSection from './CardSection';
import { useNavigate } from 'react-router-dom';

export interface contentStateType {
  title: string;
  type?: string;
  link?: string;
  tags?: Array<string>;
}

function ShareBrainHandler({
  open,
  setIsOpen,
}: {
  open: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  return <ShareModal open={open} onOpenChange={setIsOpen} />;
}

function AddContentHandler({
  open,
  setIsOpen,
  changeContentState,
}: {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  changeContentState: ({ title, type, link, tags }: contentStateType) => void;
}) {
  return (
    <AddModal
      open={open}
      onOpenChange={setIsOpen}
      changeContentState={changeContentState}
    />
  );
}

function useContent() {
  const [content, setContent] = useState([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/content`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('authorization'),
        },
      })
      .then((response) =>
        setContent((response.data as { content: any[] }).content)
      );
  }, []);

  const removeContent = (id: string) => {
    setContent((prev) => prev.filter((item) => item._id !== id));
  };

  const addContent = (newContent) => {
    setContent((prev) => [...prev, newContent]);
  };

  return { content, removeContent, addContent };
}

export default function Main() {
  const navigate = useNavigate();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const { content, removeContent, addContent } = useContent();

  return (
    <main className="bg-main-bg p-10 py-6 flex-1 h-full min-h-screen">
      <section className="sm:flex sm:items-center sm:gap-6 gap-4 mb-6 flex items-center">
        <div className="mr-auto text-xl font-bold text-normal-color">
          All Notes
        </div>
        <Button
          variant={'primary'}
          size={'md'}
          text={'Share Brain'}
          onClick={() => setShareModalOpen(true)}
          startIcon={(size) => <Share2 size={size} />}
          className="hidden md:flex"
        />
        <Button
          variant={'secondary'}
          size={'md'}
          text={'Add Content'}
          onClick={() => setAddModalOpen(true)}
          startIcon={(size) => <Plus size={size} />}
          className="hidden md:flex"
        />
        <Button
          variant={'secondaryIcon'}
          size={'icon'}
          text={''}
          onClick={() => setShareModalOpen(true)}
          startIcon={(size) => <Share2 size={size} />}
          className="md:hidden flex"
        />
        <Button
          variant={'secondaryIcon'}
          size={'icon'}
          text={''}
          onClick={() => setAddModalOpen(true)}
          startIcon={(size) => <Plus size={size} />}
          className="md:hidden flex"
        />
        <Button
          variant={'primaryIcon'}
          size={'icon'}
          text={''}
          onClick={() => {
            localStorage.removeItem('authorization');
            navigate('/signup');
          }}
          startIcon={(size) => <LogOut size={size} />}
          className="sm:hidden flex"
        />
      </section>
      <ShareBrainHandler open={shareModalOpen} setIsOpen={setShareModalOpen} />
      <AddContentHandler
        open={addModalOpen}
        setIsOpen={setAddModalOpen}
        changeContentState={addContent}
      />

      <CardSection content={content} removeContent={removeContent} />
    </main>
  );
}
