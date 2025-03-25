"use client";

import { useState } from 'react';
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import { fetchAPI } from '@/Clients/postclips/server/ApiClient';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ 
    type: null, 
    message: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetchAPI(
        '',
        'POST',
        '/contact/submit',
        formData
      );

      setStatus({
        type: 'success',
        message: '🎉 Thank you for reaching out! We will get back to you as soon as possible.',
      });
      setFormData({ name: '', email: '', message: '' });

    } catch (error: unknown) {
      let errorMessage = 'Sorry, there was an error sending your message. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }
      setStatus({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <CardBody>
              <h2 className="text-center mb-4">Contact Us</h2>
              {status.type && (
                <Alert color={status.type === 'success' ? 'success' : 'danger'} className="mb-4">
                  {status.message}
                </Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="name">Name</Label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="message">Message</Label>
                  <Input
                    type="textarea"
                    name="message"
                    id="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    style={{ minHeight: '150px' }}
                    required
                    disabled={isSubmitting}
                  />
                </FormGroup>
                <Button
                  color="primary"
                  type="submit"
                  block
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </Form>

              <div className="text-center mt-4">
                <p>Or email us directly at:</p>
                <a href="mailto:pablo@postclips.com" className="text-primary">
                  pablo@postclips.com
                </a>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactUs;