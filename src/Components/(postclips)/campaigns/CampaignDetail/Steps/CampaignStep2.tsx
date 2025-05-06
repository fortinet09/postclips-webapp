import React, { useState, useCallback, useEffect } from 'react';
import { Container, Form, FormGroup, Label, Input, Button, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Spinner } from 'reactstrap';
import { useCampaigns, CampaignContent } from '@/Hooks/useCampaigns';
import { toast } from 'react-toastify';
import { Campaign } from '@/Types/(postclips)/Campaign';
import Image from 'next/image';
import AddCampaignContentModal from '../Content/AddCampaignContentModal';
import { Edit2, Trash2, Move } from 'react-feather';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CampaignStep2Props {
    campaign: Campaign;
    handleSaveDraft: () => void;
    onNextStep: () => void;
    onPreviousStep: () => void;
}

interface SortableItemProps {
    id: string;
    children: React.ReactNode;
}

const SortableItem = ({ id, children }: SortableItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    );
};

const CampaignStep2: React.FC<CampaignStep2Props> = ({ campaign, handleSaveDraft, onNextStep, onPreviousStep }) => {
    const [uploadedContent, setUploadedContent] = useState<CampaignContent[]>([]);
    const [contentLoading, setContentLoading] = useState(true);
    const [uploadingContentIndex, setUploadingContentIndex] = useState<number | null>(null);
    const [deletingContentId, setDeletingContentId] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkTitle, setLinkTitle] = useState('');
    const [linkDescription, setLinkDescription] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [isVideo, setIsVideo] = useState(true);

    const { uploadCampaignContent, deleteCampaignContent, fetchCampaignContent, reorderCampaignContent } = useCampaigns();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const fetchAndSetCampaignContent = useCallback(async () => {
        setContentLoading(true);
        const content = await fetchCampaignContent(campaign.id);
        setUploadedContent(content);
        setContentLoading(false);
    }, [campaign.id, fetchCampaignContent]);

    const handleUploadResult = (result: { success: boolean }) => {
        if (result.success) {
            fetchAndSetCampaignContent();
        }
    };

    useEffect(() => {
        fetchAndSetCampaignContent();
    }, [fetchAndSetCampaignContent]);

    const handleMediaChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setUploadingContentIndex(index);

            uploadCampaignContent(campaign.id, {
                title: file.name,
                content_type: 'file',
                file: file
            }).then((response) => {
                if (response.success && response.data?.data) {
                    const content = response.data.data;
                    setUploadedContent(prev => {
                        const newContent = [...prev];
                        newContent[index] = content;
                        return newContent;
                    });
                    toast.success('Content uploaded successfully');
                }
            }).catch((error: Error) => {
                toast.error('Error uploading content');
                console.error('Error uploading content:', error);
            }).finally(() => {
                setUploadingContentIndex(null);
            });
        }
    };

    const handleAddLink = async () => {
        if (!linkUrl || !linkTitle) {
            toast.error('Please provide both title and URL');
            return;
        }

        try {
            const response = await uploadCampaignContent(campaign.id, {
                title: linkTitle,
                description: linkDescription,
                content_type: 'link',
                content_url: linkUrl
            });

            if (response.success && response.data?.data) {
                const content = response.data.data;
                setUploadedContent(prev => [...prev, content]);
                toast.success('Link added successfully');
                setShowLinkInput(false);
                setLinkUrl('');
                setLinkTitle('');
                setLinkDescription('');
            }
        } catch (error) {
            toast.error('Error adding link');
            console.error('Error adding link:', error);
        }
    };

    const handleDeleteContent = async (index: number, e?: React.MouseEvent) => {
        if (e) e.preventDefault();
        const content = uploadedContent[index];
        if (!content || deletingContentId === content.id) return;

        try {
            setDeletingContentId(content.id);
            const response = await deleteCampaignContent(content.id);
            if (response.success) {
                await fetchAndSetCampaignContent();
                toast.success('Content deleted successfully');
            } else {
                toast.error('Error deleting content');
            }
        } catch (error) {
            toast.error('Error deleting content');
            console.error('Error deleting content:', error);
        } finally {
            setDeletingContentId(null);
        }
    };

    const handleAddContent = async (data: any) => {
        if (isVideo) {
            return await uploadCampaignContent(campaign.id, {
                title: data.title,
                description: data.description,
                content_type: 'file',
                file: data.video,
                season: data.season,
            });
        } else {
            return await uploadCampaignContent(campaign.id, {
                title: data.title,
                content_type: 'link',
                content_url: data.content_url,
                thumbnail_url: data.thumbnail_url,
                season: data.season,
            });
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        
        if (over && active.id !== over.id) {
            setUploadedContent((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                
                const newItems = arrayMove(items, oldIndex, newIndex);
                
                // Update ordering in backend
                const contentIds = newItems.map(item => item.id);
                reorderCampaignContent(campaign.id, contentIds);
                
                return newItems;
            });
        }
    };

    return (
        <Container fluid className="campaign-detail p-4">
            <Row>
                <Col md={12}>
                    <h1 className="text-white mb-4">Upload Media</h1>

                    <Form>
                        {contentLoading ? (
                            <div className="campaign-content-loading">
                                <Spinner color="light" />
                            </div>
                        ) : uploadedContent.length > 0 ? (
                            <div className="media-list">
                                <div className="media-list-header">
                                    <div className="media-list-header__drag"></div>
                                    <div className="media-list-header__thumb">Video</div>
                                    <div className="media-list-header__spacer"></div>
                                    <div className="media-list-header__season">Season</div>
                                    <div className="media-list-header__actions"></div>
                                </div>
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={uploadedContent.map(item => item.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {uploadedContent.map((item) => (
                                            <SortableItem key={item.id} id={item.id}>
                                                <div className="media-list-row">
                                                    <div className="media-list-row__drag">
                                                        <Move size={20} />
                                                    </div>
                                                    <div className="media-list-row__thumb">
                                                        <img
                                                            src={item.thumbnail_url || '/assets/images/default-thumb.jpg'}
                                                            alt={item.title}
                                                            className="media-list-row__img"
                                                        />
                                                    </div>
                                                    <div className="media-list-row__info">
                                                        <div className="media-list-row__title">{item.title}</div>
                                                        <div className="media-list-row__desc">{item.description}</div>
                                                    </div>
                                                    <div className="media-list-row__season">{item.season || 'Not assigned'}</div>
                                                    <div className="media-list-row__actions">
                                                        <button className="icon-btn" onClick={e => handleDeleteContent(uploadedContent.findIndex(i => i.id === item.id), e)}>
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </SortableItem>
                                        ))}
                                    </SortableContext>
                                </DndContext>
                                <div className="media-list-add">
                                    <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
                                        <DropdownToggle className="add-video-btn">
                                            ADD VIDEO <span className="add-video-btn__arrow">▼</span>
                                        </DropdownToggle>
                                        <DropdownMenu dark>
                                            <DropdownItem onClick={() => { setIsVideo(true); setModalOpen(true); }}>
                                                UPLOAD FILE
                                            </DropdownItem>
                                            <DropdownItem onClick={() => { setIsVideo(false); setModalOpen(true); }}>
                                                ADD VIA LINK
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                            </div>
                        ) : (
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
                                            <DropdownItem onClick={() => { setIsVideo(true); setModalOpen(true); }}>
                                                UPLOAD FILE
                                            </DropdownItem>
                                            <DropdownItem onClick={() => { setIsVideo(false); setModalOpen(true); }}>
                                                ADD VIA LINK
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                            </>
                        )}

                        {showLinkInput && (
                            <div className="link-input-container mb-4">
                                <FormGroup>
                                    <Label for="linkTitle">Title</Label>
                                    <Input
                                        type="text"
                                        id="linkTitle"
                                        value={linkTitle}
                                        onChange={(e) => setLinkTitle(e.target.value)}
                                        placeholder="Enter title"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="linkUrl">URL</Label>
                                    <Input
                                        type="url"
                                        id="linkUrl"
                                        value={linkUrl}
                                        onChange={(e) => setLinkUrl(e.target.value)}
                                        placeholder="Enter video URL"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="linkDescription">Description (Optional)</Label>
                                    <Input
                                        type="textarea"
                                        id="linkDescription"
                                        value={linkDescription}
                                        onChange={(e) => setLinkDescription(e.target.value)}
                                        placeholder="Enter description"
                                    />
                                </FormGroup>
                                <div className="d-flex gap-2">
                                    <Button
                                        color="primary"
                                        onClick={handleAddLink}
                                    >
                                        Add Link
                                    </Button>
                                    <Button
                                        color="secondary"
                                        onClick={() => {
                                            setShowLinkInput(false);
                                            setLinkUrl('');
                                            setLinkTitle('');
                                            setLinkDescription('');
                                        }}
                                    >
                                        Cancel
                                    </Button>
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
            <AddCampaignContentModal
                isOpen={modalOpen}
                toggle={() => setModalOpen(false)}
                onSave={handleAddContent}
                isVideo={isVideo}
                onUploadResult={handleUploadResult}
            />
        </Container>
    );
};

export default CampaignStep2;
