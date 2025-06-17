"use client";

import React, { useEffect, useCallback, useState } from 'react';
import { useCampaigns } from '@/Hooks/useCampaigns';
import EmptyCampaigns from './EmptyCampaigns';
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    CardFooter,
    CardImg,
    Button,
    Input,
    Nav,
    NavItem,
    NavLink,
    Progress,
    CardTitle,
    CardText,
    CardSubtitle,
} from 'reactstrap';
import useEmblaCarousel from 'embla-carousel-react';
import CreateCampaignModal from './CreateCampaignModal';
import { useRouter } from 'next/navigation';
import ArrowLeft from '@/Components/Icons/Custom/ArrowLeft';
import ArrowRight from '@/Components/Icons/Custom/ArrowRight';

interface CampaignsProps { }

const formatNumber = (num: number): string => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    // For numbers less than 1000, round to nearest whole number
    return Math.round(num).toString();
};

const formatAverageViews = (num: number): string => {
    // Round to nearest whole number for average views
    return Math.round(num).toString();
};

const formatPercentage = (num: number): string => {
    return num.toFixed(1) + '%';
};

const CampaignSkeleton = () => (
    <Col>
        <Card className="campaign-card skeleton-card">
            <div className="skeleton-img"></div>
            <CardBody>
                <div className="skeleton-title"></div>
                <div className="campaign-metrics">
                    <div className="metric-box metric-box-right-chip">
                        <div className="skeleton-label"></div>
                        <div className="skeleton-value"></div>
                    </div>
                    <div className="metric-box metric-box-left-chip">
                        <div className="skeleton-label"></div>
                        <div className="skeleton-value"></div>
                    </div>
                </div>
            </CardBody>
        </Card>
    </Col>
);

const Campaigns: React.FC<CampaignsProps> = () => {
    const router = useRouter();
    const { campaigns, topCampaigns, totalAnalytics, loading, error, refetchCampaigns, handleSearch } = useCampaigns();
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'center',
        skipSnaps: false,
        dragFree: false,
        containScroll: false
    });
    const [activeTab, setActiveTab] = useState('active');
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const scrollPrev = useCallback(() => {
        if (emblaApi) {
            emblaApi.scrollPrev();
        }
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) {
            emblaApi.scrollNext();
        }
    }, [emblaApi]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
        handleSearch(value);
    };

    // Set up selected slide tracking
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [currentStatus, setCurrentStatus] = React.useState('active');

    useEffect(() => {
        if (!emblaApi) return;

        const onSelect = () => {
            setSelectedIndex(emblaApi.selectedScrollSnap());
        };

        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
        onSelect();

        return () => {
            emblaApi.off('select', onSelect);
            emblaApi.off('reInit', onSelect);
        };
    }, [emblaApi]);

    useEffect(() => {
        if (emblaApi) {
            emblaApi.reInit();
        }
    }, [topCampaigns, emblaApi]);

    useEffect(() => {
        refetchCampaigns(currentStatus);
    }, [currentStatus]);

    const handleCampaignClick = (campaign: any) => {
        if (campaign.status === 'draft' || campaign.status === 'in_review') {
            router.push(`/brand/campaigns/detail/${campaign.id}`);
        }
    };

    // Function to get a random preview image
    const getRandomPreviewImage = (previewImages: any[]) => {
        if (!previewImages || previewImages.length === 0) return '/placeholder-campaign.jpg';
        const randomIndex = Math.floor(Math.random() * previewImages.length);
        return previewImages[randomIndex].image_url;
    };

    if (error) {
        return <Container fluid className="campaigns px-4"><div>Error: {error}</div></Container>;
    }

    return (
        <Container fluid className="campaigns px-2 px-md-4 pt-5">
            <div className="mobile-only breadcrumbs-section">
                <span>Campaigns</span>
            </div>
            {topCampaigns && topCampaigns.length > 0 && (
                <div className="top-campaigns mb-4">
                    <div className="section-title mb-3">Top performing campaigns</div>
                    <div className="carousel-container">
                        <>
                            <div className="embla" ref={emblaRef}>
                                <div className="embla__container">
                                    {topCampaigns.map((campaign, index) => (
                                        <div
                                            key={campaign.id}
                                            className={`embla__slide ${index === selectedIndex ? 'is-selected' : ''}`}
                                        >
                                            <Card className="campaign-card">
                                                <div className="overlay"></div>
                                                <CardImg top src={getRandomPreviewImage(campaign.preview_images)} alt={campaign.title} />
                                                <CardBody>
                                                    <div className="campaign-title">{campaign.title}</div>
                                                    <div className="campaign-stats">
                                                        <div>
                                                            <span>Total views</span>
                                                            <strong>{formatNumber(campaign.analytics.total_views)}</strong>
                                                        </div>
                                                        <div>
                                                            <span>Clips posted</span>
                                                            <strong>{formatNumber(campaign.analytics.total_clips)}</strong>
                                                        </div>
                                                        <div>
                                                            <span>Link clicks</span>
                                                            <strong>{formatNumber(campaign.analytics.total_likes)}</strong>
                                                        </div>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {topCampaigns.length > 1 && (
                                <>
                                    <button className="carousel-control prev" onClick={scrollPrev}>
                                        <ArrowLeft />
                                    </button>
                                    <button className="carousel-control next" onClick={scrollNext}>
                                        <ArrowRight />
                                    </button>
                                </>
                            )}
                        </>
                    </div>
                </div>
            )}

            {totalAnalytics && (
                <div className="analytics mb-4">
                    <div className="section-title d-flex justify-content-between align-items-center mb-3">
                        Analytics <span className="view-all">VIEW ALL</span>
                    </div>
                    <Row className="analytics-grid g-2">
                        <Col md={3} xs={6}>
                            <Card className="analytics-card first-card">
                                <CardBody>
                                    <div className="analytics-title">Total views generated</div>
                                    <strong>{formatNumber(totalAnalytics.total_views)}</strong>
                                    <span className="trend">23%</span>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md={3} xs={6}>
                            <Card className="analytics-card middle-card">
                                <CardBody>
                                    <div className="analytics-title">Total clips posted</div>
                                    <strong>{formatNumber(totalAnalytics.total_clips)}</strong>
                                    <span className="trend">23%</span>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md={3} xs={6}>
                            <Card className="analytics-card middle-card">
                                <CardBody>
                                    <div className="analytics-title">Average views per clip</div>
                                    <strong>{formatAverageViews(totalAnalytics.average_views_per_clip)}</strong>
                                    <span className="trend">23%</span>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md={3} xs={6}>
                            <Card className="analytics-card last-card">
                                <CardBody>
                                    <div className="analytics-title">Total link clicks</div>
                                    <strong>{formatNumber(totalAnalytics.total_link_clicks)}</strong>
                                    <span className="trend">23%</span>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            )}

            <div className="campaigns-list">
                <div className="section-title mb-3">Campaigns</div>
                <div className="campaigns-header mb-4">
                    <div className={`campaigns-filters ${(isSearchFocused || searchValue) ? 'filters-hidden' : ''}`}>
                        <Nav tabs>
                            <NavItem>
                                <NavLink
                                    className={activeTab === 'active' ? 'active' : ''}
                                    onClick={() => {
                                        setActiveTab('active');
                                        refetchCampaigns('active');
                                    }}
                                >
                                    Active
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={activeTab === 'in_review' ? 'active' : ''}
                                    onClick={() => {
                                        setActiveTab('in_review');
                                        refetchCampaigns('in_review');
                                    }}
                                >
                                    Waiting for review
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={activeTab === 'draft' ? 'active' : ''}
                                    onClick={() => {
                                        setActiveTab('draft');
                                        refetchCampaigns('draft');
                                    }}
                                >
                                    Draft
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </div>
                    <div className="actions">
                        <Input
                            type="search"
                            placeholder="Search"
                            className={`input-dark search-input me-2 ${(isSearchFocused || searchValue) ? 'search-expanded' : ''}`}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            value={searchValue}
                            onChange={handleSearchChange}
                        />
                        <Button className="btn-chipped" onClick={toggle}>
                            CREATE CAMPAIGN
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="campaigns-grid campaigns-row-scroll">
                        {[1, 2, 3].map((i) => (
                            <div className="campaigns-row-item" key={i}>
                                <CampaignSkeleton />
                            </div>
                        ))}
                    </div>
                ) : campaigns && campaigns.length > 0 ? (
                    <div className="campaigns-grid campaigns-row-scroll">
                        {campaigns.map((campaign) => (
                            <div className="campaigns-row-item" key={campaign.id}>
                                <Card
                                    className={`campaign-card ${(campaign.status === 'draft' || campaign.status === 'in_review') ? 'cursor-pointer' : ''}`}
                                    onClick={() => handleCampaignClick(campaign)}
                                    style={{ cursor: (campaign.status === 'draft' || campaign.status === 'in_review') ? 'pointer' : 'default' }}
                                >
                                    <div className="card-content">
                                        <CardImg top src={getRandomPreviewImage(campaign.preview_images)} alt={campaign.title} />
                                        <CardBody>
                                            <div className="campaign-metrics">
                                                <div className="metric-box metric-box-right-chip">
                                                    <span>Budget</span>
                                                    <strong className="d-flex align-items-center">
                                                        <span className="m-0 metric-primary-value">
                                                            {formatNumber(campaign.analytics.total_payments)}
                                                        </span>
                                                        /{formatNumber(campaign.total_budget)}
                                                    </strong>
                                                    <Progress
                                                        value={Math.min(campaign.analytics.budget_percentage, 100)}
                                                        style={{
                                                            height: '2px',
                                                            backgroundColor: '#E5E5E5',
                                                            borderRadius: 0
                                                        }}
                                                        className="metric-progress"
                                                        barStyle={{
                                                            background: 'linear-gradient(90deg, #00E7FF 0%, #003FDD 100%)'
                                                        }}
                                                    />
                                                </div>
                                                <div className="metric-box metric-box-left-chip">
                                                    <span>Views</span>
                                                    <strong className="d-flex align-items-center">
                                                        <span className="m-0 metric-primary-value">
                                                            {formatNumber(campaign.analytics.total_views)}
                                                        </span>
                                                        /{formatNumber(campaign.targeted_amount_of_views)}
                                                    </strong>
                                                    <Progress
                                                        value={Math.min(campaign.analytics.views_percentage, 100)}
                                                        style={{
                                                            height: '2px',
                                                            backgroundColor: '#E5E5E5',
                                                            borderRadius: 0
                                                        }}
                                                        className="metric-progress"
                                                        barStyle={{
                                                            background: 'linear-gradient(90deg, #00E7FF 0%, #003FDD 100%)'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </CardBody>
                                    </div>
                                    <CardFooter>
                                        <CardTitle>{campaign.title}</CardTitle>
                                        <CardSubtitle>Ends in 6 days</CardSubtitle>
                                    </CardFooter>
                                </Card>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-campaigns">
                        <div className="empty-campaigns__content">
                            <h2>No campaigns found</h2>
                            <p>There are no campaigns in this status yet</p>
                            <Button
                                className="btn-chipped"
                                onClick={toggle}
                            >
                                CREATE CAMPAIGN
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <div className="create-campaign-mobile">
                <Button className="btn-chipped" onClick={toggle}>
                    CREATE CAMPAIGN
                </Button>
            </div>

            <CreateCampaignModal modal={modal} toggle={toggle} />
        </Container>
    );
};

export default Campaigns;