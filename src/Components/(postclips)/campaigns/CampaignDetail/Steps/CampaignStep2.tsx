import React, { useState } from 'react';
import { Container, Form, FormGroup, Label, Input, Button, Row, Col } from 'reactstrap';
import { useCampaigns, MediaResponse } from '@/Hooks/useCampaigns';
import { toast } from 'react-toastify';

interface CampaignStep2Props {
    campaign: {
        id: string;
    };
    onNextStep: () => void;
}

const CampaignStep2: React.FC<CampaignStep2Props> = ({ campaign, onNextStep }) => {
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [uploadingMediaIndex, setUploadingMediaIndex] = useState<number | null>(null);
    const [deletingMediaId, setDeletingMediaId] = useState<string | null>(null);
    const [uploadedMedia, setUploadedMedia] = useState<MediaResponse[]>([]);

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

    return (
        <Container fluid className="campaign-detail p-4">
            <Row>
                <Col md={8}>
                    <h1 className="text-white mb-4">Upload Media</h1>

                    <Form>
                        <div className="media-upload mb-4">
                            <Label className="text-white d-flex align-items-center gap-2">
                                Media Files
                                <span>(i)</span>
                            </Label>
                            <p className="mb-3">
                                Upload media files for your campaign. You can upload up to 5 files.
                            </p>
                            <div className="d-flex gap-3">
                                {[0, 1, 2, 3, 4].map((index) => (
                                    <div
                                        key={index}
                                        className="upload-box"
                                        style={{
                                            width: '200px',
                                            height: '300px',
                                            background: '#1A1A1A',
                                            border: '1px dashed rgba(255, 255, 255, 0.1)',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: uploadingMediaIndex === index ? 'wait' : 'pointer',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
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
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
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
                                                    style={{
                                                        position: 'absolute',
                                                        top: '8px',
                                                        right: '8px',
                                                        background: 'rgba(0, 0, 0, 0.5)',
                                                        border: 'none',
                                                        borderRadius: '50%',
                                                        width: '24px',
                                                        height: '24px',
                                                        color: 'white',
                                                        cursor: deletingMediaId === uploadedMedia[index]?.id ? 'wait' : 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        opacity: deletingMediaId === uploadedMedia[index]?.id ? 0.5 : 1
                                                    }}
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

                        <div className="d-flex justify-content-between mt-5 mb-5">
                            <Button
                                className="btn-chipped btn-chipped-gray"
                                style={{
                                    maxWidth: '200px',
                                    width: '100%'
                                }}
                                onClick={() => window.history.back()}
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

export default CampaignStep2;
