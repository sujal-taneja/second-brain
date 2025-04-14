import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';
import { Button } from '../Button';

export default function Header({
  shareLink = undefined,
}: {
  shareLink?: boolean | undefined;
}) {
  const navigate = useNavigate();

  return (
    <header className="h-18 bg-sign-bg flex items-center relative shadow px-5 box-border sm:px-20">
      <h1 className="text-3xl font-bold text-heading mr-auto">Brainly</h1>
      {!isAuthenticated() ? (
        <div className="flex gap-6">
          <Button
            variant={'authSecondary'}
            size={'md'}
            text="Sign up"
            onClick={() => navigate('/signup')}
          />
          <Button
            variant={'authPrimary'}
            size={'md'}
            text="Sign in"
            onClick={() => navigate('/signin')}
          />
        </div>
      ) : null}
      {shareLink !== undefined && isAuthenticated() ? (
        <Button
          variant={'authPrimary'}
          size={'md'}
          text="Go to main content"
          onClick={() => navigate('/')}
        />
      ) : null}
    </header>
  );
}
