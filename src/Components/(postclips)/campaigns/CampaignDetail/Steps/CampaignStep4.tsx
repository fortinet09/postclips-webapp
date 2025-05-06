import React, { useState } from 'react';
import { Container, Form, FormGroup, Label, Input, Button, Row, Col } from 'reactstrap';
import { Campaign } from '@/Types/(postclips)/Campaign';
import { useCampaigns } from '@/Hooks/useCampaigns';
import { toast } from 'react-toastify';

interface CampaignStep4Props {
    campaign: Campaign;
    handleSaveDraft: () => void;
    onNextStep: () => void;
    onPreviousStep: () => void;
}

interface ClipPreferences {
    min_duration: string;
    max_duration: string;
    aspect_ratio: string;
    include_watermark: boolean;
    include_caption: boolean;
    include_music: boolean;
    target_platform: string[];
}

const CampaignStep4: React.FC<CampaignStep4Props> = ({ campaign, handleSaveDraft, onNextStep, onPreviousStep }) => {
    const [preferences, setPreferences] = useState<ClipPreferences>({
        min_duration: '',
        max_duration: '',
        aspect_ratio: '9:16',
        include_watermark: true,
        include_caption: true,
        include_music: true,
        target_platform: ['instagram', 'tiktok']
    });

    const { updateCampaignDraft } = useCampaigns();

    const handlePreferenceChange = (field: keyof ClipPreferences, value: any) => {
        setPreferences(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePlatformToggle = (platform: string) => {
        setPreferences(prev => ({
            ...prev,
            target_platform: prev.target_platform.includes(platform)
                ? prev.target_platform.filter(p => p !== platform)
                : [...prev.target_platform, platform]
        }));
    };

    const handleSave = async () => {
        try {
            const response = await updateCampaignDraft(campaign.id, {
                clip_preferences: preferences
            });
            if (response.success) {
                toast.success('Clip preferences saved successfully');
                onNextStep();
            }
        } catch (error) {
            toast.error('Error saving clip preferences');
        }
    };

    return (
        <Container fluid className="campaign-detail p-4">
            <Row>
                <Col md={12}>
                    <h1 className="text-white mb-4">Customize Your Clips</h1>

                    <Form>
                        <div className="media-upload-info-banner mb-4">
                            <span className="media-upload-info-banner__icon">
                                <i className="icofont-info-circle"></i>
                            </span>
                            <div className="media-upload-info-banner__text">
                                <div className="media-upload-info-banner__title">Clip Preferences</div>
                                <div className="media-upload-info-banner__desc">
                                    Set your preferences for how you want your clips to be created and formatted.
                                </div>
                            </div>
                        </div>

                        <div className="preferences-card mb-4 p-4" style={{ background: '#1A1A1A', borderRadius: '8px' }}>
                            <h3 className="text-white mb-3">Duration & Format</h3>
                            <Row>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label className="campaign-label">Minimum Duration (seconds)</Label>
                                        <Input
                                            type="number"
                                            className="input-dark"
                                            value={preferences.min_duration}
                                            onChange={(e) => handlePreferenceChange('min_duration', e.target.value)}
                                            placeholder="e.g. 15"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label className="campaign-label">Maximum Duration (seconds)</Label>
                                        <Input
                                            type="number"
                                            className="input-dark"
                                            value={preferences.max_duration}
                                            onChange={(e) => handlePreferenceChange('max_duration', e.target.value)}
                                            placeholder="e.g. 60"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label className="campaign-label">Aspect Ratio</Label>
                                        <Input
                                            type="select"
                                            className="input-dark"
                                            value={preferences.aspect_ratio}
                                            onChange={(e) => handlePreferenceChange('aspect_ratio', e.target.value)}
                                        >
                                            <option value="9:16">9:16 (Vertical)</option>
                                            <option value="16:9">16:9 (Horizontal)</option>
                                            <option value="1:1">1:1 (Square)</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </div>

                        <div className="preferences-card mb-4 p-4" style={{ background: '#1A1A1A', borderRadius: '8px' }}>
                            <h3 className="text-white mb-3">Content Features</h3>
                            <Row>
                                <Col md={4}>
                                    <FormGroup check>
                                        <Label check className="text-white">
                                            <Input
                                                type="checkbox"
                                                checked={preferences.include_watermark}
                                                onChange={(e) => handlePreferenceChange('include_watermark', e.target.checked)}
                                            />
                                            Include Watermark
                                        </Label>
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup check>
                                        <Label check className="text-white">
                                            <Input
                                                type="checkbox"
                                                checked={preferences.include_caption}
                                                onChange={(e) => handlePreferenceChange('include_caption', e.target.checked)}
                                            />
                                            Include Captions
                                        </Label>
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup check>
                                        <Label check className="text-white">
                                            <Input
                                                type="checkbox"
                                                checked={preferences.include_music}
                                                onChange={(e) => handlePreferenceChange('include_music', e.target.checked)}
                                            />
                                            Include Music
                                        </Label>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </div>

                        <div className="preferences-card mb-4 p-4" style={{ background: '#1A1A1A', borderRadius: '8px' }}>
                            <h3 className="text-white mb-3">Target Platforms</h3>
                            <Row>
                                <Col md={4}>
                                    <FormGroup check>
                                        <Label check className="text-white">
                                            <Input
                                                type="checkbox"
                                                checked={preferences.target_platform.includes('instagram')}
                                                onChange={() => handlePlatformToggle('instagram')}
                                            />
                                            Instagram
                                        </Label>
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup check>
                                        <Label check className="text-white">
                                            <Input
                                                type="checkbox"
                                                checked={preferences.target_platform.includes('tiktok')}
                                                onChange={() => handlePlatformToggle('tiktok')}
                                            />
                                            TikTok
                                        </Label>
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup check>
                                        <Label check className="text-white">
                                            <Input
                                                type="checkbox"
                                                checked={preferences.target_platform.includes('youtube')}
                                                onChange={() => handlePlatformToggle('youtube')}
                                            />
                                            YouTube
                                        </Label>
                                    </FormGroup>
                                </Col>
                            </Row>
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
                                onClick={onNextStep}
                            >
                                NEXT
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default CampaignStep4; 