import { useRef, useState } from 'react';
import { Button } from '../Button';
import { Eye, EyeOff } from 'react-feather';
import { BACKEND_URL } from '../../config';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

interface InputType {
  type: 'text' | 'password';
  placeholder: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputRef: any;
}

function Input(props: InputType) {
  return (
    <input
      type={props.type}
      className="w-full h-10 bg-input-div rounded-md px-4 focus:outline-0 relative text-normal-color"
      placeholder={props.placeholder}
      ref={props.inputRef}
    />
  );
}

export default function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const errorMessageDiv = useRef<HTMLDivElement | null>(null);

  interface SigninResponse {
    error?: string;
    message?: string;
  }

  async function signinButtonHandler() {
    // try {
    const response = await axios.post<SigninResponse>(
      `${BACKEND_URL}/api/v1/signin`,
      {
        username: usernameRef.current?.value,
        password: passwordRef.current?.value,
      }
    );

    errorMessageDiv.current!.innerText = `${response.data.message}!`;

    const authHeader = response.headers['authorization'];

    localStorage.setItem('authorization', authHeader.replace('Bearer ', ''));

    setRedirect(true);

    // } catch (error: any) {
    //   errorMessageDiv.current!.innerText = `${error.response.data.error}!`;
    //   localStorage.removeItem('authorization');
    // }
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <main className="h-full w-full flex items-center justify-center bg-sign-bg">
      <section className="bg-body-bg w-100 flex flex-col items-center justify-center rounded-xl shadow-xl p-8 gap-4">
        <h1 className="text-3xl font-bold text-normal-color">
          Welcome to
          <span className="text-heading"> Brainly</span>
        </h1>
        <h3 className="text-subheading font-semibold -mt-3 text-md">
          Sign in to access your second brain!
        </h3>
        <div className="self-start text-md -mb-2 text-sm text-normal-color">
          Username
        </div>
        <Input type="text" placeholder="Suzie" inputRef={usernameRef} />
        <div className="self-start text-md -mb-2 text-sm  text-normal-color">
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
          text="Sign in"
          onClick={signinButtonHandler}
        />
        <div ref={errorMessageDiv} className="text-gray-600 text-sm"></div>
      </section>
    </main>
  );
}
