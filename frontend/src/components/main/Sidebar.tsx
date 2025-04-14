import { Icons } from '../Icons';
import { Button } from '../Button';
import { useNavigate } from 'react-router-dom';

// const sidebarItemClickHandler = () => {};

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="sm:flex h-full sticky top-0 min-h-screen bg-sign-bg hidden ">
      <div className="flex flex-col m-6 mr-12 h-full">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="font-bold text-2xl text-normal-color">Second Brain</h1>
        </div>
        <div className="text-gray-mid flex flex-col gap-3 ml-4">
          {Object.entries(Icons).map(([key, Icon]) => (
            <button
              key={key}
              className="flex items-center gap-4 cursor-pointer"
            >
              <Icon strokeWidth={2} size={18} />
              <div className="capitalize">{key}</div>
            </button>
          ))}
        </div>
        <div className="mt-auto ml-4 absolute bottom-10">
          <Button
            variant={'primary'}
            size={'md'}
            text={'Log out'}
            onClick={() => {
              localStorage.removeItem('authorization');
              navigate('/signup');
            }}
          />
        </div>
      </div>
      {/* <hr className="border-0 outline-gray-200 outline-1 h-full" /> */}
    </aside>
  );
}
