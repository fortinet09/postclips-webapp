import React, { useState } from 'react'
import CommonModal from '@/Components/(postclips)/general/CommonModal';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { toast } from 'react-toastify';
import { fetchAPI } from '@/Clients/postclips/server/ApiClient';
import { useAuth } from '@/Providers/SessionProvider';
export interface CreateCampaignModalFormProps {
    modal: boolean;
    toggle: () => void;
}

const CreateCampaignModalForm: React.FC<CreateCampaignModalFormProps> = ({ modal, toggle }) => {
    const { session } = useAuth();
    const [campaign, setCampaign] = useState({
        title: '',
        description: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCampaign(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.access_token) {
            toast.error('Not authorized');
            return;
        }
        try {
            await fetchAPI(
                session?.access_token,
                'POST',
                '/campaigns/draft',
                campaign
            );

            toast.success('Campaign draft created successfully!');
            toggle(); // Close modal
        } catch (error) {
            toast.error('Failed to create campaign draft');
            console.error('Error creating campaign:', error);
        }
    };

    return (
        <CommonModal modalData={{ isOpen: modal, center: true, toggler: toggle, size: 'lg' }}>
            <div className="modal-toggle-wrapper">
                <h4 className="text-left pb-2">Create a Campaign Draft</h4>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="title">Campaign Title</Label>
                        <Input
                            type="text"
                            name="title"
                            id="title"
                            value={campaign.title}
                            onChange={handleInputChange}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="description">Description</Label>
                        <Input
                            type="textarea"
                            name="description"
                            id="description"
                            value={campaign.description}
                            onChange={handleInputChange}
                        />
                    </FormGroup>
                    <div className="d-flex justify-content-end gap-2">
                        <Button color="secondary" onClick={toggle}>Cancel</Button>
                        <Button color="primary" type="submit">Create Draft</Button>
                    </div>
                </Form>
            </div>
        </CommonModal>
    );
};

export default CreateCampaignModalForm;