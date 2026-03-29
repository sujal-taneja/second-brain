/* eslint-disable @typescript-eslint/no-explicit-any */
import { Share2, Trash2 } from 'react-feather';
import { Icons } from '../Icons';
import axios from 'axios';
import { BACKEND_URL } from '../../config';

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: () => void;
      };
    };
  }
}

function VideoPreviewer({ url }: { url: string }) {
  return (
    <div className="rounded-lg overflow-hidden">
      <iframe
        width="100%"
        height="auto"
        src={url}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </div>
  );
}

function Tag({ tag }: { tag: string }) {
  return (
    <div className="rounded-xl text-xs bg-[#EFF3FC] text-[#645CC3] px-2 py-1">
      {'#' + tag}
    </div>
  );
}

function TweetEmbed({ url }: { url: string }) {
  return (
    <blockquote className="twitter-tweet">
      <a href={url}></a>
    </blockquote>
  );
}

interface CardType {
  link?: string;
  content: string;
  title: string;
  tags: {
    _id: string;
    title: string;
  }[];
  type: string;
  id?: string;
  removeContent?: (id: string) => void;
}

export default function Card(props: CardType) {
  const IconComponent = Icons[props.type as keyof typeof Icons];

  async function deleteContent(props: {
    id: string;
    removeContent: (id: string) => void;
  }) {
    try {
      const config: Record<string, any> = {
        headers: {
          authorization: 'Bearer ' + localStorage.getItem('authorization'),
        },
        data: { contentId: props.id },
      };

      await axios.delete(`${BACKEND_URL}/api/v1/content/`, config);

      props.removeContent(props.id);
    } catch (error: any) {
      console.error('Failed to delete content:', error);
      
      if (error.response?.status === 429) {
        alert('Too many requests. Please wait a moment before trying again.');
      } else if (error.request) {
        alert('Network error. Please check your connection.');
      } else {
        alert('Failed to delete content. Please try again.');
      }
    }
  }

  return (
    <article className="rounded-lg w-70 bg-white shadow-md p-4 flex flex-col gap-2 max-h-80 overflow-y-auto overflow-x-hidden scrollbar-hide">
      <div className="flex items-center gap-2">
        {IconComponent && <IconComponent strokeWidth={1.5} size={18} />}
        <div className="mr-auto font-normal text-lg">{props.title}</div>
        {props.link && (
          <Share2
            strokeWidth={1.5}
            color={'#464c59'}
            size={18}
            onClick={(e) => {
              e.stopPropagation();
              let url = props.link.trim();

              if (!/^https?:\/\//i.test(url)) {
                url = 'https://' + url;
              }

              window.open(url, '_blank', 'noopener,noreferrer');
            }}
          />
        )}
        {props.removeContent && props.id && (
          <Trash2
            strokeWidth={1.5}
            color={'#464c59'}
            size={18}
            onClick={() =>
              deleteContent({
                id: props.id,
                removeContent: props.removeContent,
              })
            }
          />
        )}
      </div>
      <div>{props.content}</div>
      {props.link && props.type == 'video' && (
        <VideoPreviewer url={props.link.replace('watch?v=', 'embed/')} />
      )}
      {props.link && props.type == 'image' && (
        <img src={props.link} alt="" className="w-full" />
      )}
      {props.link && props.type == 'tweet' && (
        <TweetEmbed url={props.link.replace('x.com', 'twitter.com')} />
      )}
      <div className="flex gap-2 mt-2">
        {props.tags &&
          props.tags.map((tag) => <Tag key={tag._id} tag={tag.title} />)}
      </div>
    </article>
  );
}
