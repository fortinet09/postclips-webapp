import React, { useState } from 'react';
import { Container, Form, FormGroup, Label, Input, Button, Row, Col } from 'reactstrap';
import { Campaign } from '@/Types/(postclips)/Campaign';
import { useCampaigns } from '@/Hooks/useCampaigns';
import { toast } from 'react-toastify';
import Image from 'next/image';

interface CampaignStep5Props {
    campaign: Campaign;
    handleSaveDraft: () => void;
    onPreviousStep: () => void;
}

interface PaymentInfo {
    card_number: string;
    expiry_date: string;
    cvv: string;
    name_on_card: string;
}

const CampaignStep5: React.FC<CampaignStep5Props> = ({ campaign, handleSaveDraft, onPreviousStep }) => {
    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
        card_number: '',
        expiry_date: '',
        cvv: '',
        name_on_card: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const { updateCampaignDraft } = useCampaigns();

    const handlePaymentChange = (field: keyof PaymentInfo, value: string) => {
        setPaymentInfo(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            const response = await updateCampaignDraft(campaign.id, {
                payment_info: paymentInfo,
                status: 'active'
            });
            if (response.success) {
                toast.success('Campaign submitted successfully!');
                // Redirect to campaign list or dashboard
            }
        } catch (error) {
            toast.error('Error submitting campaign');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container fluid className="campaign-detail p-4">
            <Row>
                <Col md={8}>
                    <h1 className="text-white mb-4">Payment & Submit</h1>

                    <Form>
                        <div className="media-upload-info-banner mb-4">
                            <span className="media-upload-info-banner__icon">
                                <i className="icofont-info-circle"></i>
                            </span>
                            <div className="media-upload-info-banner__text">
                                <div className="media-upload-info-banner__title">Payment Information</div>
                                <div className="media-upload-info-banner__desc">
                                    Your payment will be processed securely. You will only be charged when clips are created and approved.
                                </div>
                            </div>
                        </div>

                        <div className="payment-card mb-4 p-4" style={{ background: '#1A1A1A', borderRadius: '8px' }}>
                            <h3 className="text-white mb-3">Payment Details</h3>
                            <Row>
                                <Col md={12}>
                                    <FormGroup>
                                        <Label className="campaign-label">Name on Card</Label>
                                        <Input
                                            type="text"
                                            className="input-dark"
                                            value={paymentInfo.name_on_card}
                                            onChange={(e) => handlePaymentChange('name_on_card', e.target.value)}
                                            placeholder="Enter name as it appears on card"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={12}>
                                    <FormGroup>
                                        <Label className="campaign-label">Card Number</Label>
                                        <Input
                                            type="text"
                                            className="input-dark"
                                            value={paymentInfo.card_number}
                                            onChange={(e) => handlePaymentChange('card_number', e.target.value)}
                                            placeholder="1234 5678 9012 3456"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label className="campaign-label">Expiry Date</Label>
                                        <Input
                                            type="text"
                                            className="input-dark"
                                            value={paymentInfo.expiry_date}
                                            onChange={(e) => handlePaymentChange('expiry_date', e.target.value)}
                                            placeholder="MM/YY"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label className="campaign-label">CVV</Label>
                                        <Input
                                            type="text"
                                            className="input-dark"
                                            value={paymentInfo.cvv}
                                            onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                                            placeholder="123"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </div>

                        <div className="payment-summary mb-4 p-4" style={{ background: '#1A1A1A', borderRadius: '8px' }}>
                            <h3 className="text-white mb-3">Payment Summary</h3>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-white">Campaign Budget</span>
                                <span className="text-white">${campaign.total_budget}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-white">Platform Fee (5%)</span>
                                <span className="text-white">${(campaign.total_budget * 0.05).toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
                                <span className="text-white fw-bold">Total</span>
                                <span className="text-white fw-bold">${(campaign.total_budget * 1.05).toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="d-flex justify-content-between mt-5 mb-5">
                            <Button
                                className="btn-chipped btn-chipped-gray"
                                style={{
                                    maxWidth: '200px',
                                    width: '100%'
                                }}
                                onClick={onPreviousStep}
                            >
                                BACK
                            </Button>
                            <Button
                                className="btn-chipped btn-chipped-white"
                                style={{
                                    maxWidth: '200px',
                                    width: '100%'
                                }}
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT CAMPAIGN'}
                            </Button>
                        </div>
                    </Form>
                </Col>

                <Col md={4}>
                    <div className="payment-security p-4" style={{ background: '#1A1A1A', borderRadius: '8px', position: 'sticky', top: '100px' }}>
                        <h3 className="text-white mb-3">Secure Payment</h3>
                        <div className="security-features">
                            <div className="d-flex align-items-center mb-3">
                                <Image
                                    src="/assets/images/(postclips)/campaigns/step5/shield.svg"
                                    alt="Security"
                                    width={24}
                                    height={24}
                                    className="me-3"
                                />
                                <span className="text-white">256-bit SSL Encryption</span>
                            </div>
                            <div className="d-flex align-items-center mb-3">
                                <Image
                                    src="/assets/images/(postclips)/campaigns/step5/lock.svg"
                                    alt="Security"
                                    width={24}
                                    height={24}
                                    className="me-3"
                                />
                                <span className="text-white">Secure Payment Processing</span>
                            </div>
                            <div className="d-flex align-items-center">
                                <Image
                                    src="/assets/images/(postclips)/campaigns/step5/check.svg"
                                    alt="Security"
                                    width={24}
                                    height={24}
                                    className="me-3"
                                />
                                <span className="text-white">PCI DSS Compliant</span>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default CampaignStep5; 