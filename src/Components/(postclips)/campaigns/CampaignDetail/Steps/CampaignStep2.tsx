import React, { useState } from 'react';
import { Container, Form, FormGroup, Label, Input, Button, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { useCampaigns, MediaResponse } from '@/Hooks/useCampaigns';
import { toast } from 'react-toastify';
import { Campaign } from '@/Types/(postclips)/Campaign';
import Image from 'next/image';

interface CampaignStep2Props {
    campaign: Campaign;
    handleSaveDraft: () => void;
    onNextStep: () => void;
    onPreviousStep: () => void;
}

const CampaignStep2: React.FC<CampaignStep2Props> = ({ campaign, handleSaveDraft, onNextStep, onPreviousStep }) => {
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [uploadingMediaIndex, setUploadingMediaIndex] = useState<number | null>(null);
    const [deletingMediaId, setDeletingMediaId] = useState<string | null>(null);
    const [uploadedMedia, setUploadedMedia] = useState<MediaResponse[]>([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const { uploadMedia, deleteMedia } = useCampaigns();

    const handleMediaChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setMediaFiles(prev => {
                const newFiles = [...prev];
                newFiles[index] = file;
                return newFiles;
            });

            setUploadingMediaIndex(index);
            uploadMedia(campaign.id, file).then((response: { success: boolean; data?: { data: MediaResponse } }) => {
                if (response.success && response.data?.data) {
                    const media = response.data.data;
                    setUploadedMedia(prev => {
                        const newMedia = [...prev];
                        newMedia[index] = media;
                        return newMedia;
                    });
                    toast.success('Media uploaded successfully');
                }
            }).catch((error: Error) => {
                toast.error('Error uploading media');
                console.error('Error uploading media:', error);
            }).finally(() => {
                setUploadingMediaIndex(null);
            });
        }
    };

    const handleDeleteMedia = async (index: number) => {
        const media = uploadedMedia[index];
        if (!media || deletingMediaId === media.id) return;

        try {
            setDeletingMediaId(media.id);
            await deleteMedia(media.id);
            setUploadedMedia(prev => {
                const newMedia = [...prev];
                newMedia.splice(index, 1);
                return newMedia;
            });
            toast.success('Media deleted successfully');
        } catch (error) {
            toast.error('Error deleting media');
            console.error('Error deleting media:', error);
        } finally {
            setDeletingMediaId(null);
        }
    };

    // Placeholder for Add via Link (to be implemented)
    const handleAddViaLink = () => {
        toast.info('Add via link not implemented yet.');
    };

    return (
        <Container fluid className="campaign-detail p-4">
            <Row>
                <Col md={12}>
                    <h1 className="text-white mb-4">Upload Media</h1>

                    <Form>
                        {uploadedMedia.length === 0 ? (
                            <>
                                {/* Info Banner */}
                                <div className="media-upload-info-banner">
                                    <span className="media-upload-info-banner__icon">
                                        <Image
                                            src="/assets/images/(postclips)/campaigns/step2/shield.svg"
                                            alt="!"
                                            className="next-image-full"
                                            width={28}
                                            height={28}
                                            priority
                                        />
                                    </span>
                                    <div className="media-upload-info-banner__text">
                                        <div className="media-upload-info-banner__title">Post Clips is an end-to-end closed system</div>
                                        <div className="media-upload-info-banner__desc">
                                            Users can watch, edit, and post content—all without ever leaving the platform. Content is fully protected and cannot be downloaded, screen-recorded, exported, or accessed externally, ensuring complete security and control
                                        </div>
                                    </div>
                                </div>
                                <div className="media-upload-placeholder">
                                    {/* Headline */}
                                    <div className="media-upload-headline">
                                        Uploaded videos will be used by clippers to create clips
                                    </div>
                                    <div className="media-upload-description">
                                        You can upload content as files or links for streaming. Organize videos into seasons for better accessibility.
                                    </div>
                                    {/* Add Video Button with Dropdown */}
                                    <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)} className="media-upload-dropdown">
                                        <DropdownToggle caret>
                                            ADD VIDEO
                                        </DropdownToggle>
                                        <DropdownMenu dark>
                                            <DropdownItem onClick={() => document.getElementById('media-0')?.click()}>
                                                UPLOAD FILE
                                            </DropdownItem>
                                            <DropdownItem onClick={handleAddViaLink}>
                                                ADD VIA LINK
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                    {/* Hidden file input for upload */}
                                    <input
                                        type="file"
                                        id="media-0"
                                        accept="video/*"
                                        style={{ display: 'none' }}
                                        onChange={handleMediaChange(0)}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="media-upload mb-4">
                                <Label className="text-white d-flex align-items-center gap-2">
                                    Media Files
                                    <span>(i)</span>
                                </Label>
                                <p className="mb-3">
                                    Upload media files for your campaign. You can upload up to 5 files.
                                </p>
                                <div className="media-upload-grid">
                                    {[0, 1, 2, 3, 4].map((index) => (
                                        <div
                                            key={index}
                                            className="upload-box"
                                        >
                                            {uploadingMediaIndex === index ? (
                                                <div className="uploading-indicator">
                                                    <div className="spinner-border text-light" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                    <div className="mt-2">Uploading...</div>
                                                </div>
                                            ) : uploadedMedia[index]?.url ? (
                                                <>
                                                    <video
                                                        src={uploadedMedia[index].url}
                                                        className="uploaded-media-video"
                                                        muted
                                                        loop
                                                        playsInline
                                                        autoPlay
                                                    />
                                                    <button
                                                        type="button"
                                                        className="delete-media-btn"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleDeleteMedia(index);
                                                        }}
                                                        disabled={deletingMediaId === uploadedMedia[index]?.id}
                                                    >
                                                        {deletingMediaId === uploadedMedia[index]?.id ? (
                                                            <div className="spinner-border spinner-border-sm" role="status">
                                                                <span className="visually-hidden">Loading...</span>
                                                            </div>
                                                        ) : (
                                                            '×'
                                                        )}
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <Input
                                                        type="file"
                                                        id={`media-${index}`}
                                                        accept="video/*"
                                                        onChange={handleMediaChange(index)}
                                                        style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            width: '100%',
                                                            height: '100%',
                                                            opacity: 0,
                                                            cursor: 'pointer'
                                                        }}
                                                    />
                                                    <div className="upload-content">
                                                        <div className="upload-icon d-flex align-items-center justify-content-center mb-2">
                                                            ↑
                                                        </div>
                                                        <div>Upload media</div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

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
        </Container >
    );
};

export default CampaignStep2;
