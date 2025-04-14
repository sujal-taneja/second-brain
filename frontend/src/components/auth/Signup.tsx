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

  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const errorMessageDiv = useRef<HTMLDivElement | null>(null);

  interface SignupResponse {
    error?: string;
    message?: string;
  }

  async function signupButtonHandler() {
    try {
      const response = await axios.post<SignupResponse>(
        `${BACKEND_URL}/api/v1/signup`,
        {
          username: usernameRef.current?.value,
          password: passwordRef.current?.value,
        }
      );

      errorMessageDiv.current!.innerText = `${response.data.message}!`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      errorMessageDiv.current!.innerText = `${error.response.data.error}!`;
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
          text="Sign up"
          onClick={signupButtonHandler}
        />
        <div ref={errorMessageDiv} className="text-gray-600 text-sm"></div>
      </section>
    </main>
  );
}
