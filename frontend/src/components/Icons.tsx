import {
  Twitter,
  Youtube,
  Link2,
  File,
  Headphones,
  Image,
  LogOut,
} from 'react-feather';

interface IconType {
  strokeWidth?: number;
  size?: number;
}

export const Icons = {
  tweet: (props: IconType) => <Twitter {...props} />,
  image: (props: IconType) => <Image {...props} />,
  video: (props: IconType) => <Youtube {...props} />,
  article: (props: IconType) => <File {...props} />,
  audio: (props: IconType) => <Headphones {...props} />,
  link: (props: IconType) => <Link2 {...props} />,
  logout: (props: IconType) => <LogOut {...props} />,
};
