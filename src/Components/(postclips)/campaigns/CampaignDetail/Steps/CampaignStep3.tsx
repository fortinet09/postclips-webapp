import React, { useState, useEffect } from 'react';
import { Container, Form, FormGroup, Label, Input, Button, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Badge, Spinner } from 'reactstrap';
import { Campaign } from '@/Types/(postclips)/Campaign';
import { useCampaigns } from '@/Hooks/useCampaigns';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { Plus } from 'react-feather';
// import PhoneMockup from "@/Components/PhoneMockup";

const PLATFORMS = [
    { key: 'tiktok', label: 'TikTok', icon: '/assets/images/(postclips)/socials/pc_tiktok.svg' },
    { key: 'instagram', label: 'Instagram', icon: '/assets/images/(postclips)/socials/pc_instagram.svg' },
    { key: 'facebook', label: 'Facebook', icon: '/assets/images/(postclips)/socials/pc_facebook.svg' },
    { key: 'twitter', label: 'X (Twitter)', icon: '/assets/images/(postclips)/socials/pc_twitter.svg' },
    { key: 'youtube', label: 'YouTube', icon: '/assets/images/(postclips)/socials/pc_youtube.svg' },
];

interface CampaignStep3Props {
    campaign: Campaign;
    handleSaveDraft: () => void;
    onNextStep: () => void;
    onPreviousStep: () => void;
}

interface BioLink {
    bio: string;
    link: string;
}

interface BrandAccountPicture {
    id: string;
    picture_url: string;
}

const MAX_USERNAMES = 20;
const MAX_BIOS = 20;
const MAX_PICTURES = 20;

// Platform-specific UI components
const ProfilePicture = ({ src }: { src: string }) => (
    <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        overflow: 'hidden',
        border: '2px solid #232323',
        flexShrink: 0
    }}>
        <Image
            src={src}
            alt="Profile"
            width={64}
            height={64}
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
            }}
        />
    </div>
);

const TikTokPreview = ({ username, bio, link, picture }: { username: string; bio: string; link: string; picture: string }) => (
    <div style={{
        width: '100%', height: '100%', background: '#000', color: '#fff',
        borderRadius: 32,
        overflow: 'hidden'
    }}>
        {/* Status Bar */}
        <div className="phone-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'white',
            fontSize: '14px',
            padding: '5px 12px',
            marginBottom: '12px'
        }}>
            <span>9:41</span>
            <div style={{
                display: 'flex',
                gap: '5px',
                alignItems: 'center'
            }}>
                <span style={{ fontSize: '12px' }}>●</span>
                <span style={{ fontSize: '12px' }}>📶</span>
                <span style={{ fontSize: '12px' }}>🔋</span>
            </div>
        </div>

        {/* Profile Section */}
        <div style={{ padding: '0 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                <ProfilePicture src={picture} />
                <div style={{ marginLeft: 12 }}>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>{username}</div>
                    <div style={{ fontSize: 13, color: '#888' }}>{bio}</div>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
                <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>0</div>
                    <div style={{ fontSize: 14, color: '#888' }}>Following</div>
                </div>
                <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>0</div>
                    <div style={{ fontSize: 14, color: '#888' }}>Followers</div>
                </div>
                <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>0</div>
                    <div style={{ fontSize: 14, color: '#888' }}>Likes</div>
                </div>
            </div>

            {/* Video Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} style={{ aspectRatio: '9/16', background: '#232323', borderRadius: 4 }} />
                ))}
            </div>
        </div>
    </div>
);

const InstagramPreview = ({ username, bio, link, picture }: { username: string; bio: string; link: string; picture: string }) => (
    <div style={{ width: '100%', height: '100%', background: '#000', color: '#fff',
        borderRadius: 32,
        overflow: 'hidden'
    }}>
        {/* Status Bar */}
        <div className="phone-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'white',
            fontSize: '14px',
            padding: '5px 12px',
            marginBottom: '12px'
        }}>
            <span>9:41</span>
            <div style={{
                display: 'flex',
                gap: '5px',
                alignItems: 'center'
            }}>
                <span style={{ fontSize: '12px' }}>●</span>
                <span style={{ fontSize: '12px' }}>📶</span>
                <span style={{ fontSize: '12px' }}>🔋</span>
            </div>
        </div>

        {/* Profile Section */}
        <div style={{ padding: '0 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                <ProfilePicture src={picture} />
                <div style={{ marginLeft: 12 }}>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>{username}</div>
                    <div style={{ fontSize: 13, color: '#888' }}>{bio}</div>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
                <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>0</div>
                    <div style={{ fontSize: 14, color: '#888' }}>Posts</div>
                </div>
                <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>0</div>
                    <div style={{ fontSize: 14, color: '#888' }}>Followers</div>
                </div>
                <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>0</div>
                    <div style={{ fontSize: 14, color: '#888' }}>Following</div>
                </div>
            </div>

            {/* Photo Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} style={{ aspectRatio: '1/1', background: '#232323' }} />
                ))}
            </div>
        </div>
    </div>
);

const FacebookPreview = ({ username, bio, link, picture }: { username: string; bio: string; link: string; picture: string }) => (
    <div style={{ width: '100%', height: '100%', background: '#18191A', color: '#fff',
        borderRadius: 32,
        overflow: 'hidden'
    }}>
        {/* Status Bar */}
        <div className="phone-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'white',
            fontSize: '14px',
            padding: '5px 12px',
            marginBottom: '12px'
        }}>
            <span>9:41</span>
            <div style={{
                display: 'flex',
                gap: '5px',
                alignItems: 'center'
            }}>
                <span style={{ fontSize: '12px' }}>●</span>
                <span style={{ fontSize: '12px' }}>📶</span>
                <span style={{ fontSize: '12px' }}>🔋</span>
            </div>
        </div>

        {/* Profile Section */}
        <div style={{ padding: '0 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                <ProfilePicture src={picture} />
                <div style={{ marginLeft: 12 }}>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>{username}</div>
                    <div style={{ fontSize: 13, color: '#888' }}>{bio}</div>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <div style={{ flex: 1, background: '#232323', borderRadius: 8, padding: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>Posts</div>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>0</div>
                </div>
                <div style={{ flex: 1, background: '#232323', borderRadius: 8, padding: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>Friends</div>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>0</div>
                </div>
            </div>

            {/* Recent Posts */}
            <div style={{ background: '#232323', borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Recent Posts</div>
                <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                    No posts yet
                </div>
            </div>
        </div>
    </div>
);

const TwitterPreview = ({ username, bio, link, picture }: { username: string; bio: string; link: string; picture: string }) => (
    <div style={{ width: '100%', height: '100%', background: '#000', color: '#fff',
        borderRadius: 32,
        overflow: 'hidden'
    }}>
        {/* Status Bar */}
        <div className="phone-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'white',
            fontSize: '14px',
            padding: '5px 12px',
            marginBottom: '12px'
        }}>
            <span>9:41</span>
            <div style={{
                display: 'flex',
                gap: '5px',
                alignItems: 'center'
            }}>
                <span style={{ fontSize: '12px' }}>●</span>
                <span style={{ fontSize: '12px' }}>📶</span>
                <span style={{ fontSize: '12px' }}>🔋</span>
            </div>
        </div>

        {/* Profile Section */}
        <div style={{ padding: '0 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                <ProfilePicture src={picture} />
                <div style={{ marginLeft: 12 }}>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>{username}</div>
                    <div style={{ fontSize: 13, color: '#888' }}>{bio}</div>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 14 }}>
                    <span style={{ fontWeight: 600 }}>0</span> Following
                </div>
                <div style={{ fontSize: 14 }}>
                    <span style={{ fontWeight: 600 }}>0</span> Followers
                </div>
            </div>

            {/* Tweets */}
            <div style={{ background: '#232323', borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 14, color: '#888', textAlign: 'center' }}>
                    No tweets yet
                </div>
            </div>
        </div>
    </div>
);

const YouTubePreview = ({ username, bio, link, picture }: { username: string; bio: string; link: string; picture: string }) => (
    <div style={{ width: '100%', height: '100%', background: '#0F0F0F', color: '#fff',
        borderRadius: 32,
        overflow: 'hidden'
    }}>
        {/* Status Bar */}
        <div className="phone-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'white',
            fontSize: '14px',
            padding: '5px 12px',
            marginBottom: '12px'
        }}>
            <span>9:41</span>
            <div style={{
                display: 'flex',
                gap: '5px',
                alignItems: 'center'
            }}>
                <span style={{ fontSize: '12px' }}>●</span>
                <span style={{ fontSize: '12px' }}>📶</span>
                <span style={{ fontSize: '12px' }}>🔋</span>
            </div>
        </div>

        {/* Profile Section */}
        <div style={{ padding: '0 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                <ProfilePicture src={picture} />
                <div style={{ marginLeft: 12 }}>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>{username}</div>
                    <div style={{ fontSize: 13, color: '#888' }}>{bio}</div>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 14 }}>
                    <span style={{ fontWeight: 600 }}>0</span> subscribers
                </div>
                <div style={{ fontSize: 14 }}>
                    <span style={{ fontWeight: 600 }}>0</span> videos
                </div>
            </div>

            {/* Video Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{ aspectRatio: '16/9', background: '#232323', borderRadius: 8 }} />
                ))}
            </div>
        </div>
    </div>
);

const CampaignStep3: React.FC<CampaignStep3Props> = ({ campaign, handleSaveDraft, onNextStep, onPreviousStep }) => {
    const {
        getBrandAccountUsernames,
        addBrandAccountUsername,
        deleteBrandAccountUsername,
        getBrandAccountBios,
        setBrandAccountBios,
        getBrandAccountPictures,
        addBrandAccountPicture,
        deleteBrandAccountPicture,
    } = useCampaigns();
    const brandId = campaign.brand_id;

    // Loading state
    const [loading, setLoading] = useState(true);

    // Usernames
    const [usernames, setUsernames] = useState<string[]>([]);
    const [usernameInput, setUsernameInput] = useState('');

    // Bios
    const [useSameBio, setUseSameBio] = useState(true);
    const [bios, setBios] = useState<BioLink[]>([{ bio: '', link: '' }]);
    const [platformBios, setPlatformBios] = useState<Record<string, BioLink[]>>({
        tiktok: [{ bio: '', link: '' }],
        instagram: [{ bio: '', link: '' }],
        facebook: [{ bio: '', link: '' }],
        twitter: [{ bio: '', link: '' }],
        youtube: [{ bio: '', link: '' }],
    });
    const [bioModalOpen, setBioModalOpen] = useState(false);
    const [bioModalData, setBioModalData] = useState<Record<string, BioLink[]>>({
        tiktok: [{ bio: '', link: '' }],
        instagram: [{ bio: '', link: '' }],
        facebook: [{ bio: '', link: '' }],
        twitter: [{ bio: '', link: '' }],
        youtube: [{ bio: '', link: '' }],
    });
    const [bioModalSame, setBioModalSame] = useState(true);

    // Profile pictures
    const [pictures, setPictures] = useState<BrandAccountPicture[]>([]);
    const [pictureFiles, setPictureFiles] = useState<File[]>([]);
    const [uploadingPicture, setUploadingPicture] = useState(false);
    const [deletingPictureId, setDeletingPictureId] = useState<string | null>(null);

    // Preview state
    const [preview, setPreview] = useState({
        username: '',
        bio: '',
        link: '',
        picture: '',
        platform: 'tiktok' // Default platform
    });

    // Fetch all data on mount
    useEffect(() => {
        if (!brandId) return;
        setLoading(true);
        Promise.all([
            getBrandAccountUsernames(brandId),
            getBrandAccountBios(brandId),
            getBrandAccountPictures(brandId)
        ]).then(([usernamesRes, biosRes, picturesRes]) => {
            if (usernamesRes.success && Array.isArray(usernamesRes.data)) {
                setUsernames(usernamesRes.data.map((u: any) => u.username));
            }
            if (biosRes.success && biosRes.data) {
                setUseSameBio(biosRes.data.use_same_bio ?? true);
                if (biosRes.data.use_same_bio) {
                    setBios([{ bio: biosRes.data.global_bio || '', link: biosRes.data.global_link || '' }]);
                } else {
                    setPlatformBios({
                        tiktok: [{ bio: biosRes.data.tiktok_bio || '', link: biosRes.data.tiktok_link || '' }],
                        instagram: [{ bio: biosRes.data.instagram_bio || '', link: biosRes.data.instagram_link || '' }],
                        facebook: [{ bio: biosRes.data.facebook_bio || '', link: biosRes.data.facebook_link || '' }],
                        twitter: [{ bio: biosRes.data.twitter_bio || '', link: biosRes.data.twitter_link || '' }],
                        youtube: [{ bio: biosRes.data.youtube_bio || '', link: biosRes.data.youtube_link || '' }],
                    });
                }
            }
            if (picturesRes.success && Array.isArray(picturesRes.data)) {
                setPictures(picturesRes.data);
            }
        }).finally(() => setLoading(false));
    }, [brandId]);

    // Username tag input logic
    const handleUsernameInput = (e: React.ChangeEvent<HTMLInputElement>) => setUsernameInput(e.target.value);
    const handleUsernameKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === 'Enter' || e.key === ',' || e.key === 'Tab') && usernameInput.trim()) {
            e.preventDefault();
            if (usernames.length < MAX_USERNAMES && !usernames.includes(usernameInput.trim())) {
                if (brandId) {
                    const res = await addBrandAccountUsername(brandId, usernameInput.trim());
                    if (res.success) {
                        setUsernames([...usernames, usernameInput.trim()]);
                    }
                }
            }
            setUsernameInput('');
        }
    };

    const removeUsername = async (idx: number) => {
        if (!brandId) return;
        const usernameToRemove = usernames[idx];
        const res = await deleteBrandAccountUsername(brandId, usernameToRemove);
        if (res.success) {
            setUsernames(usernames.filter((_, i) => i !== idx));
        }
    };

    const updateBio = (idx: number, field: keyof BioLink, value: string) => {
        setBios(bios.map((b, i) => i === idx ? { ...b, [field]: value } : b));
    };

    // Profile picture logic
    const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && pictures.length < MAX_PICTURES && brandId) {
            setUploadingPicture(true);
            const file = e.target.files[0];
            const res = await addBrandAccountPicture(brandId, file);
            if (res.success && res.data && res.data.picture_url) {
                setPictures([...pictures, res.data]);
                setPictureFiles([...pictureFiles, file]);
            }
            setUploadingPicture(false);
        }
    };

    const handleDeletePicture = async (idx: number) => {
        if (!brandId) return;
        const picture = pictures[idx];
        if (!picture || deletingPictureId === picture.id) return;

        setDeletingPictureId(picture.id);
        try {
            const res = await deleteBrandAccountPicture(brandId, picture.id);
            if (res.success) {
                setPictures(pictures.filter((_, i) => i !== idx));
                setPictureFiles(pictureFiles.filter((_, i) => i !== idx));
            }
        } catch (error) {
            toast.error('An error occurred while deleting the picture');
        } finally {
            setDeletingPictureId(null);
        }
    };

    // Modal bio logic
    const handleModalBioChange = (platform: string, idx: number, field: keyof BioLink, value: string) => {
        setBioModalData(prev => ({
            ...prev,
            [platform]: prev[platform].map((b, i) => i === idx ? { ...b, [field]: value } : b)
        }));
    };

    const handleModalSave = async () => {
        if (!brandId) return;

        try {
            const biosData = bioModalSame ? {
                use_same_bio: true,
                global_bio: bioModalData.tiktok[0]?.bio || '',
                global_link: bioModalData.tiktok[0]?.link || '',
            } : {
                use_same_bio: false,
                tiktok_bio: bioModalData.tiktok[0]?.bio || '',
                tiktok_link: bioModalData.tiktok[0]?.link || '',
                instagram_bio: bioModalData.instagram[0]?.bio || '',
                instagram_link: bioModalData.instagram[0]?.link || '',
                facebook_bio: bioModalData.facebook[0]?.bio || '',
                facebook_link: bioModalData.facebook[0]?.link || '',
                twitter_bio: bioModalData.twitter[0]?.bio || '',
                twitter_link: bioModalData.twitter[0]?.link || '',
                youtube_bio: bioModalData.youtube[0]?.bio || '',
                youtube_link: bioModalData.youtube[0]?.link || '',
            };

            const res = await setBrandAccountBios(brandId, biosData);
            if (res.success) {
                setPlatformBios(bioModalData);
                setUseSameBio(bioModalSame);
                setBioModalOpen(false);
            }
        } catch (error) {
            toast.error('An error occurred while saving bios');
        }
    };

    // Modal open handler
    const openBioModal = () => {
        setBioModalData(platformBios);
        setBioModalSame(useSameBio);
        setBioModalOpen(true);
    };

    const closeBioModal = () => setBioModalOpen(false);

    // Save all changes before proceeding
    const handleSaveAndNext = async () => {
        if (!brandId) return;

        try {
            // Save bios
            const biosData = useSameBio ? {
                use_same_bio: true,
                global_bio: bios[0]?.bio || '',
                global_link: bios[0]?.link || '',
            } : {
                use_same_bio: false,
                tiktok_bio: platformBios.tiktok[0]?.bio || '',
                tiktok_link: platformBios.tiktok[0]?.link || '',
                instagram_bio: platformBios.instagram[0]?.bio || '',
                instagram_link: platformBios.instagram[0]?.link || '',
                facebook_bio: platformBios.facebook[0]?.bio || '',
                facebook_link: platformBios.facebook[0]?.link || '',
                twitter_bio: platformBios.twitter[0]?.bio || '',
                twitter_link: platformBios.twitter[0]?.link || '',
                youtube_bio: platformBios.youtube[0]?.bio || '',
                youtube_link: platformBios.youtube[0]?.link || '',
            };

            const res = await setBrandAccountBios(brandId, biosData);
            if (res.success) {
                onNextStep();
            }
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    };

    // Helper to get a random item from an array
    const getRandom = (arr: any[]) => arr.length ? arr[Math.floor(Math.random() * arr.length)] : '';

    const randomizePreview = () => {
        // Username
        const username = getRandom(usernames) || 'username';
        // Picture
        const picture = getRandom(pictures)?.picture_url || '/assets/images/(postclips)/profile-placeholder.png';

        let bio = '';
        let link = '';
        let platform = 'tiktok';

        if (useSameBio) {
            // If using global bio, pick a random platform
            platform = getRandom(PLATFORMS.map(p => p.key));
            bio = getRandom(bios.map(b => b.bio).filter(Boolean)) || 'Your bio here';
            link = getRandom(bios.map(b => b.link).filter(Boolean)) || '';
        } else {
            // If using platform-specific bios, pick a random platform and its bio
            platform = getRandom(PLATFORMS.map(p => p.key));
            const currentPlatformBios = platformBios[platform as keyof typeof platformBios] || [];
            bio = getRandom(currentPlatformBios.map((b: BioLink) => b.bio).filter(Boolean)) || 'Your bio here';
            link = getRandom(currentPlatformBios.map((b: BioLink) => b.link).filter(Boolean)) || '';
        }

        setPreview({ username, bio, link, picture, platform });
    };

    // Initialize preview on load or when data changes
    useEffect(() => {
        randomizePreview();
        // eslint-disable-next-line
    }, [usernames, bios, platformBios, pictures, useSameBio]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 400 }}>
                <Spinner color="primary" />
            </div>
        );
    }

    return (
        <Container fluid className="campaign-detail p-4">
            <Row>
                <Col md={8} xs={12}>
                    <h1 className="text-white mb-4">Design your accounts</h1>
                    <div className="mb-4">
                        <div className="campaign-label mb-1">Accounts usernames</div>
                        <div className="mb-2 text-secondary" style={{ fontSize: 14 }}>Add up to 20 unique usernames</div>
                        <div className="input-dark d-flex flex-wrap align-items-center" style={{ minHeight: 48, gap: 8, padding: 8, height: "auto" }}>
                            {usernames.map((u, idx) => (
                                <Badge key={u} color="primary" pill style={{ background: '#232323', color: '#fff', fontWeight: 600, fontSize: 15, padding: '8px 12px' }}>
                                    {u} <span style={{ cursor: 'pointer', marginLeft: 8 }} onClick={() => removeUsername(idx)}>&times;</span>
                                </Badge>
                            ))}
                            {usernames.length < MAX_USERNAMES && (
                                <Input
                                    type="text"
                                    value={usernameInput}
                                    onChange={handleUsernameInput}
                                    onKeyDown={handleUsernameKeyDown}
                                    placeholder="Add username"
                                    style={{ background: 'transparent', border: 'none', color: '#fff', minWidth: 120, height: 'auto' }}
                                    className="shadow-none"
                                />
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="d-flex align-items-center justify-content-between mb-1">
                            <div className="campaign-label">Bio & link in bio</div>
                            <div className="form-switch">
                                <Input type="switch" checked={useSameBio} onChange={() => setUseSameBio(!useSameBio)} id="sameBioSwitch" />
                                <Label for="sameBioSwitch" className="ms-2" style={{ color: '#fff', fontWeight: 400, fontSize: 15 }}>Use same bio for all platforms</Label>
                            </div>
                        </div>
                        <div className="mb-2 text-secondary" style={{ fontSize: 14 }}>Add up to 20 unique bios & links in bio</div>
                        {useSameBio ? (
                            <FormGroup>
                                <Label className="campaign-label">Bio</Label>
                                <Input
                                    type="textarea"
                                    placeholder="Bio text"
                                    value={bios[0]?.bio || ''}
                                    onChange={e => updateBio(0, 'bio', e.target.value)}
                                    className="input-dark mb-2"
                                    maxLength={40}
                                />
                                <div className="text-end mb-2" style={{ color: '#00E7FF', fontSize: 13 }}>{(bios[0]?.bio?.length || 0)}/40</div>
                                <Label className="campaign-label">Link in bio</Label>
                                <Input
                                    type="text"
                                    placeholder="Link in bio"
                                    value={bios[0]?.link || ''}
                                    onChange={e => updateBio(0, 'link', e.target.value)}
                                    className="input-dark"
                                />
                            </FormGroup>
                        ) : (
                            <>
                                <Button color="dark" outline className="w-100" style={{ borderRadius: 8, border: '1px solid #232323', color: '#fff', fontWeight: 600 }} onClick={openBioModal}>
                                    Add bio
                                </Button>
                                {/* Modal for per-platform bios */}
                                <Modal isOpen={bioModalOpen} toggle={closeBioModal} size="lg" centered>
                                    <ModalHeader toggle={closeBioModal}>Add bio</ModalHeader>
                                    <ModalBody>
                                        {PLATFORMS.map(platform => (
                                            <div key={platform.key} className="mb-4">
                                                <div className="d-flex align-items-center mb-2">
                                                    <Image
                                                        src={platform.icon}
                                                        alt={platform.label}
                                                        width={24}
                                                        height={24}
                                                        className="me-2"
                                                    />
                                                    <span style={{ fontWeight: 600, color: '#fff' }}>{platform.label}</span>
                                                </div>
                                                <Label className="campaign-label">Bio</Label>
                                                <Input
                                                    type="textarea"
                                                    maxLength={40}
                                                    className="input-dark mb-2"
                                                    placeholder="Bio text"
                                                    value={bioModalData[platform.key]?.[0]?.bio || ''}
                                                    onChange={e => handleModalBioChange(platform.key, 0, 'bio', e.target.value)}
                                                />
                                                <div className="text-end mb-2" style={{ color: '#00E7FF', fontSize: 13 }}>{(bioModalData[platform.key]?.[0]?.bio?.length || 0)}/40</div>
                                                <Label className="campaign-label">Link in bio</Label>
                                                <Input
                                                    type="text"
                                                    className="input-dark"
                                                    placeholder="Link in bio"
                                                    value={bioModalData[platform.key]?.[0]?.link || ''}
                                                    onChange={e => handleModalBioChange(platform.key, 0, 'link', e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </ModalBody>
                                    <ModalFooter className="d-flex justify-content-between">
                                        <Button color="secondary" className="btn-chipped btn-chipped-gray" onClick={closeBioModal} style={{ maxWidth: '200px', width: '100%' }}>Back</Button>
                                        <Button color="primary" className="btn-chipped btn-chipped-white" onClick={handleModalSave} style={{ maxWidth: '200px', width: '100%' }}>Save</Button>
                                    </ModalFooter>
                                </Modal>
                            </>
                        )}
                    </div>

                    {!useSameBio && (
                        <div className="mb-4">
                            <div className="campaign-label mb-3">Platform-specific bios</div>
                            <div>
                                {PLATFORMS.map((platform, idx) => (
                                    <div key={platform.key} style={{
                                        background: '#232323',
                                        borderRadius: 8,
                                        width: '100%',
                                        padding: '18px 20px',
                                        marginBottom: idx !== PLATFORMS.length - 1 ? 16 : 0,
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 16
                                    }}>
                                        <Image
                                            src={platform.icon}
                                            alt={platform.label}
                                            width={28}
                                            height={28}
                                            style={{ marginRight: 12, flexShrink: 0 }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ color: '#fff', fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{platform.label}</div>
                                            <div style={{ color: '#888', fontSize: 13 }}>Bio</div>
                                            <div style={{ color: '#fff', fontSize: 14, marginBottom: 6 }}>{platformBios[platform.key]?.[0]?.bio || 'No bio set'}</div>
                                            <div style={{ color: '#888', fontSize: 13 }}>Link in bio</div>
                                            <div style={{ color: '#fff', fontSize: 14 }}>{platformBios[platform.key]?.[0]?.link || 'No link set'}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mb-4">
                        <div className="campaign-label mb-1">Profile pictures</div>
                        <div className="mb-2 text-secondary" style={{ fontSize: 14 }}>Add up to 20 unique profile pictures</div>
                        <div className="d-flex align-items-center" style={{ gap: 12 }}>
                            {pictures.map((pic, idx) => (
                                <div key={idx} style={{ position: 'relative' }}>
                                    <Image src={pic.picture_url} alt="Profile" width={56} height={56} style={{ borderRadius: '50%', objectFit: 'cover', border: '2px solid #232323' }} />
                                    <Button
                                        color="link"
                                        className="p-0"
                                        style={{ position: 'absolute', top: -8, right: -8 }}
                                        onClick={() => handleDeletePicture(idx)}
                                        disabled={deletingPictureId === pic.id}
                                    >
                                        {deletingPictureId === pic.id ? (
                                            <Spinner size="sm" color="primary" />
                                        ) : (
                                            <span style={{ color: '#fff', fontSize: 18 }}>&times;</span>
                                        )}
                                    </Button>
                                </div>
                            ))}
                            {pictures.length < MAX_PICTURES && (
                                <label style={{ width: 56, height: 56, borderRadius: '50%', background: '#232323', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: uploadingPicture ? 'wait' : 'pointer', fontSize: 32, color: '#888', position: 'relative' }}>
                                    {uploadingPicture ? (
                                        <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                                            <Spinner size="sm" color="primary" />
                                        </span>
                                    ) : (
                                        <Plus size={24} />
                                    )}
                                    <Input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePictureChange} disabled={uploadingPicture} />
                                </label>
                            )}
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
                            onClick={handleSaveAndNext}
                        >
                            SAVE & NEXT
                        </Button>
                    </div>
                </Col>
                <Col md={4} xs={12} className="mt-4 mt-md-0">
                    <div
                        className="preview-container"
                        style={{
                            position: typeof window !== 'undefined' && window.innerWidth >= 768 ? 'sticky' : 'static',
                            top: typeof window !== 'undefined' && window.innerWidth >= 768 ? '100px' : undefined,
                            background: '#181818',
                            borderRadius: 24,
                            padding: 16,
                            minHeight: 0,
                            width: '100%',
                            maxWidth: 420,
                            margin: '0 auto',
                            boxSizing: 'border-box',
                        }}
                    >
                        <div style={{ color: '#fff', fontWeight: 600, marginBottom: 12 }}>Clipper's account preview</div>
                        <div style={{ marginBottom: 16 }}>
                            <div className="d-flex align-items-center gap-2">
                                <Image
                                    src={PLATFORMS.find(p => p.key === preview.platform)?.icon || ''}
                                    alt={PLATFORMS.find(p => p.key === preview.platform)?.label || ''}
                                    width={24}
                                    height={24}
                                />
                                <span style={{ color: '#fff', fontSize: 14 }}>
                                    {PLATFORMS.find(p => p.key === preview.platform)?.label || ''}
                                </span>
                            </div>
                        </div>
                        <div className="preview-phone-inner" style={{
                            width: '100%',
                            maxWidth: 340,
                            height: '440px',
                            backgroundColor: '#181818',
                            borderRadius: '32px',
                            boxShadow: '0 0 16px #0008',
                            padding: '5px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            overflow: 'hidden',
                            margin: '0 auto'
                        }}>
                            {preview.platform === 'tiktok' && <TikTokPreview {...preview} />}
                            {preview.platform === 'instagram' && <InstagramPreview {...preview} />}
                            {preview.platform === 'facebook' && <FacebookPreview {...preview} />}
                            {preview.platform === 'twitter' && <TwitterPreview {...preview} />}
                            {preview.platform === 'youtube' && <YouTubePreview {...preview} />}
                        </div>
                        <div className="mt-3 text-secondary" style={{ fontSize: 14 }}>Different combinations can be generated</div>
                        <Button color="link" className="p-0 mt-1" style={{ color: '#00E7FF', fontWeight: 600, fontSize: 15 }} onClick={randomizePreview}>
                            <span style={{ textDecoration: 'underline' }}>RANDOMIZE</span>
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default CampaignStep3; 