/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import Card from './main/Card';
import Header from './main/Header';
import { BACKEND_URL } from '../config';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function useContent(shareLink) {
  const [content, setContent] = useState([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/brain/${shareLink}`)
      .then((response: any) => setContent(response.data));
  }, [shareLink]);

  return content;
}

function GetShareLink() {
  const { shareLink } = useParams();
  const content = useContent(shareLink);

  return (
    <div className="flex flex-col w-full h-full min-h-screen">
      <Header shareLink={true} />
      <main className="bg-main-bg p-10 py-6 flex-1 h-full">
        <section className="flex flex-wrap gap-4">
          {content.map((card: any, index) => (
            <Card
              key={index}
              content={card.content}
              type={card.type}
              title={card.title}
              tags={card.tags}
              link={card.link}
            />
          ))}
        </section>
      </main>
    </div>
  );
}

export default GetShareLink;
