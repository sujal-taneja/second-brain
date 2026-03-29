import { useRef, useState } from 'react';
import { Button } from '../Button';
import { Eye, EyeOff } from 'react-feather';
import { BACKEND_URL } from '../../config';
import axios from 'axios';

function Input({
  type,
  placeholder,
  inputRef,
}: {
  type: string;
  placeholder: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputRef: any;
}) {
  return (
    <input
      type={type}
      className="w-full h-10 bg-input-div rounded-md px-4 focus:outline-0 relative text-normal-color"
      placeholder={placeholder}
      ref={inputRef}
    />
  );
}

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const errorMessageDiv = useRef<HTMLDivElement | null>(null);

  interface SignupResponse {
    error?: string;
    message?: string;
  }

  async function signupButtonHandler() {
    if (!errorMessageDiv.current) return;

    setLoading(true);
    errorMessageDiv.current.innerText = '';

    try {
      const response = await axios.post<SignupResponse>(
        `${BACKEND_URL}/api/v1/signup`,
        {
          username: usernameRef.current?.value,
          password: passwordRef.current?.value,
        }
      );

      errorMessageDiv.current.innerText = `${response.data.message}!`;
      errorMessageDiv.current.className = 'text-green-600 text-sm font-medium';
    } catch (error: any) {
      if (error.response?.status === 429) {
        const retryAfter = error.response.headers['retry-after'];
        const minutes = retryAfter ? Math.ceil(retryAfter / 60) : 15;
        errorMessageDiv.current.innerText = `Too many signup attempts. Please try again in ${minutes} minutes.`;
        errorMessageDiv.current.className = 'text-amber-600 text-sm font-medium';
      } else if (error.response?.data?.error) {
        const errorMsg = typeof error.response.data.error === 'string' 
          ? error.response.data.error 
          : 'Invalid input. Please check your details.';
        errorMessageDiv.current.innerText = errorMsg;
        errorMessageDiv.current.className = 'text-red-600 text-sm font-medium';
      } else if (error.request) {
        errorMessageDiv.current.innerText = 'Network error. Please check your connection.';
        errorMessageDiv.current.className = 'text-red-600 text-sm font-medium';
      } else {
        errorMessageDiv.current.innerText = 'An error occurred. Please try again.';
        errorMessageDiv.current.className = 'text-red-600 text-sm font-medium';
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="h-full w-full flex items-center justify-center bg-sign-bg">
      <section className="bg-body-bg w-100 flex flex-col items-center justify-center rounded-xl shadow-xl p-8 gap-4">
        <h1 className="text-3xl font-bold text-normal-color">
          Welcome to
          <span className="text-heading"> Brainly</span>
        </h1>
        <h3 className="text-subheading font-semibold -mt-3 text-md">
          Sign up to access your second brain!
        </h3>
        <div className="self-start text-md -mb-2 text-sm text-normal-color">
          Username
        </div>
        <Input type="text" placeholder="Suzie" inputRef={usernameRef} />
        <div className="self-start text-md -mb-2 text-sm text-normal-color">
          Password
        </div>
        <div className="w-full relative flex items-center mb-2">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder={showPassword ? 'Abc@123' : '••••••••'}
            inputRef={passwordRef}
          />
          <button
            className="absolute right-4"
            onClick={() => setShowPassword((t) => !t)}
          >
            {showPassword ? (
              <Eye color="#818080" />
            ) : (
              <EyeOff color="#818080" />
            )}
          </button>
        </div>
        <Button
          variant="submitSecondary"
          size="md"
          text={loading ? 'Signing up...' : 'Sign up'}
          onClick={signupButtonHandler}
          loading={loading}
        />
        <div ref={errorMessageDiv} className="text-gray-600 text-sm"></div>
      </section>
    </main>
  );
}
