/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from './Card';
import { FileText } from 'react-feather';

export default function CardSection({ content, removeContent }) {
  if (!content || content.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-20">
        <FileText size={64} color="#9CA3AF" strokeWidth={1.5} />
        <h2 className="text-2xl font-semibold text-gray-600">No Content Yet</h2>
        <p className="text-gray-500 text-center max-w-md">
          Start building your second brain by adding your first note, article, video, or tweet.
        </p>
        <p className="text-gray-400 text-sm">
          Click the "+ Add Content" button to get started
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-wrap gap-4">
      {content.map((card: any, index) => (
        <Card
          key={index}
          content={card.content}
          type={card.type}
          title={card.title}
          tags={card.tags}
          link={card.link}
          id={card._id}
          removeContent={removeContent}
        />
      ))}
    </section>
  );
}
