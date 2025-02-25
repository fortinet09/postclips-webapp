import React, { useState } from 'react'
import { Card, CardBody, Collapse } from 'reactstrap';
import { Filter } from 'react-feather';
import { ProductListHeaderProp } from '@/Types/ECommerce.type';
import { Href } from '@/Constant';
import Link from 'next/link';
import CampaignList  from './CampaignList';

const CampaignHeader = ({ linkTitle }: ProductListHeaderProp) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const handleFilterToggle = () => {
        setIsFilterOpen((prevState) => !prevState);
    };
    return (
        <div className="list-product-header">
            <div>
                <div className="light-box">
                    <a href={Href} onClick={handleFilterToggle}>
                        {isFilterOpen ? <i className='icon-close filter-close' /> : <Filter className='filter-icon' />}
                    </a>
                </div>
                <Link className="btn btn-primary" href={'/campaigns/create'}>
                    <i className="fa fa-plus me-2" /> {linkTitle}
                </Link>
            </div>
            <Collapse className={isFilterOpen ? "show" : ""}>
                <Card className="list-product-body">
                    <CardBody>
                        <CampaignList />
                    </CardBody>
                </Card>
            </Collapse>
        </div>
    )
}
export default CampaignHeader;