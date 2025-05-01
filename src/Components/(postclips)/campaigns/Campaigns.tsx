"use client";

import React, { useEffect, useCallback } from 'react';
import { useCampaigns } from '@/Hooks/useCampaigns';
import EmptyCampaigns from './EmptyCampaigns';
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    CardImg,
    Button,
    Input,
    Nav,
    NavItem,
    NavLink,
    Progress,
} from 'reactstrap';
import { ChevronLeft, ChevronRight } from 'react-feather';
import useEmblaCarousel from 'embla-carousel-react';

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

const Campaigns: React.FC<CampaignsProps> = () => {
    const { campaigns, topCampaigns, totalAnalytics, loading, error, refetchCampaigns } = useCampaigns();
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'center',
        loop: true,
        startIndex: 1,
        containScroll: 'trimSnaps'
    });

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

    // Set up selected slide tracking
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const [currentStatus, setCurrentStatus] = React.useState('active');

    useEffect(() => {
        if (!emblaApi) return;

        // Update selected index when slide changes
        const onSelect = () => {
            setSelectedIndex(emblaApi.selectedScrollSnap());
        };

        emblaApi.on('select', onSelect);
        // Initialize it
        onSelect();

        return () => {
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi]);

    useEffect(() => {
        refetchCampaigns(currentStatus);
    }, [currentStatus]);

    if (loading) {
        return <Container fluid className="campaigns px-4"><div>Loading...</div></Container>;
    }

    if (error) {
        return <Container fluid className="campaigns px-4"><div>Error: {error}</div></Container>;
    }

    if (!campaigns || !Array.isArray(campaigns) || campaigns.length === 0) {
        return <EmptyCampaigns />;
    }

    return (
        <Container fluid className="campaigns px-4">
            <div className="top-campaigns mb-4">
                <div className="section-title mb-3">Top performing campaigns</div>
                <div className="carousel-container">
                    {topCampaigns.length > 0 && (
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
                                                <CardImg top src={campaign.profile_picture || '/placeholder-campaign.jpg'} alt={campaign.title} />
                                                <CardBody>
                                                    <div className="campaign-title">{campaign.title}</div>
                                                    <div className="campaign-stats">
                                                        <div>
                                                            <span>Total views</span>
                                                            <strong>{formatNumber(campaign.analytics.total_views)}</strong>
                                                        </div>
                                                        <div>
                                                            <span>Clips</span>
                                                            <strong>{formatNumber(campaign.analytics.total_clips)}</strong>
                                                        </div>
                                                        <div>
                                                            <span>Likes</span>
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
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button className="carousel-control next" onClick={scrollNext}>
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="analytics mb-4">
                <div className="section-title d-flex justify-content-between align-items-center mb-3">
                    Analytics <span className="view-all">VIEW ALL</span>
                </div>
                <Row className="analytics-grid">
                    <Col md={3}>
                        <Card className="analytics-card first-card">
                            <CardBody>
                                <div className="analytics-title">Total views generated</div>
                                <strong>{formatNumber(totalAnalytics.total_views)}</strong>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="analytics-card middle-card">
                            <CardBody>
                                <div className="analytics-title">Total clips posted</div>
                                <strong>{formatNumber(totalAnalytics.total_clips)}</strong>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="analytics-card middle-card">
                            <CardBody>
                                <div className="analytics-title">Average views per clip</div>
                                <strong>{formatAverageViews(totalAnalytics.average_views_per_clip)}</strong>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="analytics-card last-card">
                            <CardBody>
                                <div className="analytics-title">Total link clicks</div>
                                <strong>{formatNumber(totalAnalytics.total_link_clicks)}</strong>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>

            <div className="campaigns-list">
                <div className="section-title mb-3">Campaigns</div>
                <div className="campaigns-header mb-4">
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                active={currentStatus === 'active'}
                                onClick={() => setCurrentStatus('active')}
                            >
                                Active
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                active={currentStatus === 'in_review'}
                                onClick={() => setCurrentStatus('in_review')}
                            >
                                Waiting for approval
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                active={currentStatus === 'draft'}
                                onClick={() => setCurrentStatus('draft')}
                            >
                                Drafts
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <div className="actions">
                        <Input type="search" placeholder="Search" className="search-input me-2" />
                        <Button
                            color="primary"
                            className="btn-chipped"
                        >
                            CREATE CAMPAIGN
                        </Button>
                    </div>
                </div>

                <Row className="campaigns-grid">
                    {campaigns.map((campaign) => (
                        <Col key={campaign.id}>
                            <Card className="campaign-card">
                                <CardImg top src={campaign.profile_picture || '/placeholder-campaign.jpg'} alt={campaign.title} />
                                <CardBody>
                                    <h3>{campaign.title}</h3>
                                    <div className="campaign-metrics">
                                        <div className="metric-box metric-box-right-chip">
                                            <span>Budget</span>
                                            <strong>$0k/0k</strong>
                                            {/* <Progress
                                                value={0}
                                                className="campaign-progress"
                                                style={{ height: '1px' }}
                                            /> */}
                                        </div>
                                        <div className="metric-box metric-box-left-chip">
                                            <span>Views</span>
                                            <strong className="d-flex align-items-center">
                                                <span className="m-0" style={{ fontSize: '16px' }}>
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
                                            />
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </Container>
    );
};

export default Campaigns;