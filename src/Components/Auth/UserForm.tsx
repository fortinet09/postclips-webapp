"use client";
import {
  CreateAccount,
  DontHaveAccount,
  EmailAddress,
  ForgotPassword,
  Href,
  ImagePath,
  OrSignInWith,
  Password,
  RememberPassword,
  SignIn,
  SignInToAccount,
} from "@/Constant";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import imageOne from "../../../public/assets/images/logo/logo-1.png";
import imageTwo from "../../../public/assets/images/logo/logo.png";
import { UserSocialApp } from "./UserSocialApp";
import React from "react";
import { login } from "@/actions/auth/login";
import VerificationCode from "../Forms/FormLayout/TwoFactor/EmailVerification/VerificationCode";

enum Step {
  Login = "login",
  Verification = "verification",
}

const UserForm = () => {
  const [step, setStep] = useState(Step.Login);
  const [email, setEmail] = useState("");

  const handleLogin = async (
    provider: "email" | "google" | "facebook" | "apple",
    email?: string
  ) => {
    try {
      const userData = await login(provider, email);
      setStep(Step.Verification);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
      <div>
        <Link className="logo" href="/dashboard/default">
          <Image
            priority
            width={100}
            height={34}
            className="img-fluid for-light"
            src={imageOne}
            alt="login page"
          />
          <Image
            priority
            width={100}
            height={34}
            className="img-fluid for-dark"
            src={imageTwo}
            alt="login page"
          />
        </Link>
      </div>
      <div className="login-main">
        <Form className="theme-form">
          {step === Step.Login && (
            <>
              <h4>Welcome</h4>
              <p>{"Use your email to sign in or create an account"}</p>
              <FormGroup>
                <Label className="col-form-label">{EmailAddress}</Label>
                <Input
                  type="email"
                  defaultValue={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </FormGroup>
              <div className="form-group mb-0">
                <div className="text-end mt-3">
                  <Button
                    color="primary"
                    onClick={() => handleLogin("email", email)}
                  >
                    {SignIn}
                  </Button>
                </div>
              </div>
              <h6 className="text-muted mt-4 or">Or use your</h6>
              <UserSocialApp />
            </>
          )}
          {step === Step.Verification && <VerificationCode email={email} />}
        </Form>
      </div>
    </div>
  );
};
export default UserForm;
