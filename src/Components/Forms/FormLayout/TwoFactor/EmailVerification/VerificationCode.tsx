import { ImagePath, VerificationCodeTitle, Verify } from "@/Constant";
import Image from "next/image";
import React, { useState } from "react";
import { Button, Col, Form, Input, Row } from "reactstrap";
import { verifyOtp } from "@/actions/auth/verifyOtp";
import { useRouter } from "next/navigation";

const VerificationCode = ({ email }: { email: string }) => {
  const router = useRouter();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");

  const handleChange = (e: string, index: number) => {
    if (e.length > 1) return;
    const tempOtp = [...otp];
    tempOtp[index] = e;
    setOtp(tempOtp);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    pasteCode(e.clipboardData.getData("text").trim());
  };

  const pasteCode = async (clipboardText?: string) => {
    try {
      let pasteData = clipboardText || (await navigator.clipboard.readText()).trim();
      
      if (pasteData.length === 6 && /^\d{6}$/.test(pasteData)) {
        setOtp(pasteData.split(""));
      } else {
        setError("Invalid OTP format. Must be 6 digits.");
      }
    } catch (err) {
      console.error("Failed to read clipboard:", err);
      setError("Failed to read clipboard.");
    }
  };

  const handleVerify = async () => {
    try {
      const otpCode = otp.join("");
      const result = await verifyOtp(email, otpCode);
      console.log("OTP verified:", result);
      if (result?.success) {
        router.push("/home");
      } else {
        setError("Invalid OTP code");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
    }
  };

  return (
    <Row>
      <div className="card-wrapper h-100">
        <div className="authenticate">
          <h4>{VerificationCodeTitle}</h4>
          <Image
            className="img-fluid"
            src={`${ImagePath}/forms/authenticate.png`}
            width={197}
            height={200}
            alt="authenticate"
          />
          <span>{"We've sent a verification code to"}</span>
          <span>{email}</span>
          <Form onSubmit={(event) => event.preventDefault()}>
            <Row>
              <Col>
                <h5>{"Your OTP Code here:"}</h5>
              </Col>
              <Col className="otp-generate">
                {otp.map((value, index) => (
                  <Input
                    key={index}
                    value={value}
                    className="code-input"
                    type="number"
                    onChange={(e) => handleChange(e.target.value, index)}
                    onPaste={handlePaste}
                  />
                ))}
              </Col>
              <Col>
                <Button
                  color="primary"
                  className="w-100"
                  onClick={handleVerify}
                >
                  {Verify}
                </Button>
              </Col>
              <Col>
                <Button
                  color="secondary"
                  className="w-100 mt-2"
                  onClick={() => pasteCode()}
                >
                  Paste Code
                </Button>
              </Col>
              {error && <p className="text-danger mt-3 mb-3">{error}</p>}
              <div>
                <span>{"Not received your code?"}</span>
                <span className="text-primary cursor-pointer">Resend</span>
              </div>
            </Row>
          </Form>
        </div>
      </div>
    </Row>
  );
};

export default VerificationCode;
