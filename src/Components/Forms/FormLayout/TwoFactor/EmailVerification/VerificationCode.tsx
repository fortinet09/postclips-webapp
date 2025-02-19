import { Href, ImagePath, VerificationCodeTitle, Verify } from "@/Constant";
import { otpGenerate } from "@/Data/Forms/FormLayout";
import Image from "next/image";
import React, { useState } from "react";
import { Button, Col, Form, Input, Row } from "reactstrap";
import { verifyOtp } from "@/actions/auth/verifyOtp";
import { useRouter } from "next/navigation";

const VerificationCode = ({ email }: { email: string }) => {
  const router = useRouter();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const handleChange = (e: string, index: number) => {
    if (e.length > 1) return;
    const tempOtp = [...otp];
    tempOtp[index] = e;
    setOtp(tempOtp);
  };

  const handleVerify = async () => {
    try {
      const otpCode = otp.join("");
      const result = await verifyOtp(email, otpCode);
      console.log("OTP verified:", result);
      if (result?.success) {
        router.push("/home");
        // Handle successful verification, e.g., redirect to dashboard
      } else {
        // Handle verification failure, e.g., show an error message
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
                {otp.map((_, index) => (
                  <Input
                    key={index}
                    value={otp[index]}
                    className="code-input"
                    type="number"
                    onChange={(e) => handleChange(e.target.value, index)}
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
