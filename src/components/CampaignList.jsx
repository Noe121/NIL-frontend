import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const CampaignContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const CampaignGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const CampaignCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const CampaignImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CampaignContent = styled.div`
  padding: 20px;
`;

const CampaignTitle = styled.h3`
  margin: 0 0 10px 0;
  color: #1a1a1a;
  font-size: 1.2rem;
  font-weight: 600;
`;

const CampaignDescription = styled.p`
  margin: 0 0 15px 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const CampaignMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const CampaignType = styled.span`
  background: #f0f8ff;
  color: #0066cc;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const FeaturedBadge = styled.span`
  background: #ffd700;
  color: #333;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const Hashtags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
`;

const Hashtag = styled.span`
  background: #f5f5f5;
  color: #666;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 0.75rem;
`;

const CallToAction = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  background: ${props => props.active ? '#667eea' : '#f5f5f5'};
  color: ${props => props.active ? 'white' : '#333'};
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? '#5a67d8' : '#e2e8f0'};
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #e53e3e;
  background: #fed7d7;
  border-radius: 8px;
  margin: 20px 0;
`;

const CampaignList = ({ userProfile }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    filterCampaigns();
  }, [campaigns, activeFilter]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      // In production, this would be an API call
      // For demo, we'll use sample data
      const response = await fetch('/api/campaigns/sample', { method: 'POST' });
      await response.json();

      const campaignsResponse = await fetch('/api/campaigns/');
      const data = await campaignsResponse.json();

      if (data.success) {
        setCampaigns(data.data);
      } else {
        setError('Failed to load campaigns');
      }
    } catch (err) {
      setError('Failed to load campaigns');
      console.error('Error fetching campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterCampaigns = () => {
    if (activeFilter === 'all') {
      setFilteredCampaigns(campaigns);
    } else if (activeFilter === 'featured') {
      setFilteredCampaigns(campaigns.filter(c => c.is_featured));
    } else {
      setFilteredCampaigns(campaigns.filter(c => c.type === activeFilter));
    }
  };

  const handleCampaignClick = (campaign) => {
    navigate(`/campaigns/${campaign.id}`);
  };

  const getCampaignTypeLabel = (type) => {
    const labels = {
      winter_sports: 'Winter Sports',
      college_culture: 'College Culture',
      summer_outdoors: 'Summer Outdoors',
      urban_culture: 'Urban Culture',
      beach_lifestyle: 'Beach Lifestyle',
      mountain_lifestyle: 'Mountain Lifestyle',
      professional_sports: 'Pro Sports',
      music_festival: 'Music Festival',
      food_culture: 'Food Culture',
      arts_crafts: 'Arts & Crafts'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <CampaignContainer>
        <LoadingSpinner>Loading campaigns...</LoadingSpinner>
      </CampaignContainer>
    );
  }

  if (error) {
    return (
      <CampaignContainer>
        <ErrorMessage>{error}</ErrorMessage>
      </CampaignContainer>
    );
  }

  return (
    <CampaignContainer>
      <h1>Culture Campaigns</h1>
      <p>Discover campaigns tailored to your location and interests</p>

      <FilterContainer>
        <FilterButton
          active={activeFilter === 'all'}
          onClick={() => setActiveFilter('all')}
        >
          All Campaigns
        </FilterButton>
        <FilterButton
          active={activeFilter === 'featured'}
          onClick={() => setActiveFilter('featured')}
        >
          Featured
        </FilterButton>
        <FilterButton
          active={activeFilter === 'winter_sports'}
          onClick={() => setActiveFilter('winter_sports')}
        >
          Winter Sports
        </FilterButton>
        <FilterButton
          active={activeFilter === 'college_culture'}
          onClick={() => setActiveFilter('college_culture')}
        >
          College Culture
        </FilterButton>
        <FilterButton
          active={activeFilter === 'summer_outdoors'}
          onClick={() => setActiveFilter('summer_outdoors')}
        >
          Summer Outdoors
        </FilterButton>
      </FilterContainer>

      <CampaignGrid>
        {filteredCampaigns.map(campaign => (
          <CampaignCard key={campaign.id} onClick={() => handleCampaignClick(campaign)}>
            {campaign.hero_image_url && (
              <CampaignImage
                src={campaign.hero_image_url}
                alt={campaign.title}
                onError={(e) => {
                  e.target.src = '/images/campaigns/default.jpg';
                }}
              />
            )}
            <CampaignContent>
              <CampaignMeta>
                <CampaignType>{getCampaignTypeLabel(campaign.type)}</CampaignType>
                {campaign.is_featured && <FeaturedBadge>Featured</FeaturedBadge>}
              </CampaignMeta>

              <CampaignTitle>{campaign.title}</CampaignTitle>
              <CampaignDescription>
                {campaign.short_description || campaign.description}
              </CampaignDescription>

              {campaign.hashtags && campaign.hashtags.length > 0 && (
                <Hashtags>
                  {campaign.hashtags.slice(0, 3).map((hashtag, index) => (
                    <Hashtag key={index}>{hashtag}</Hashtag>
                  ))}
                </Hashtags>
              )}

              {campaign.call_to_action && (
                <CallToAction onClick={(e) => {
                  e.stopPropagation();
                  if (campaign.cta_link) {
                    window.open(campaign.cta_link, '_blank');
                  }
                }}>
                  {campaign.call_to_action}
                </CallToAction>
              )}
            </CampaignContent>
          </CampaignCard>
        ))}
      </CampaignGrid>

      {filteredCampaigns.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No campaigns found for the selected filter.
        </div>
      )}
    </CampaignContainer>
  );
};

export default CampaignList;