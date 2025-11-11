import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';

const CampaignDetailContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
`;

const HeroSection = styled.div`
  position: relative;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 30px;
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 100%);
  display: flex;
  align-items: flex-end;
  padding: 40px;
`;

const HeroContent = styled.div`
  color: white;
  max-width: 600px;
`;

const HeroTitle = styled.h1`
  margin: 0 0 10px 0;
  font-size: 2.5rem;
  font-weight: 700;
`;

const HeroDescription = styled.p`
  margin: 0 0 20px 0;
  font-size: 1.1rem;
  line-height: 1.6;
  opacity: 0.9;
`;

const HeroMeta = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const CampaignTypeBadge = styled.span`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
`;

const FeaturedBadge = styled.span`
  background: #ffd700;
  color: #333;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
`;

const ContentSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div``;

const Sidebar = styled.div``;

const SectionTitle = styled.h2`
  color: #1a1a1a;
  font-size: 1.8rem;
  margin: 0 0 20px 0;
  font-weight: 600;
`;

const Description = styled.div`
  color: #333;
  line-height: 1.7;
  font-size: 1.1rem;
  margin-bottom: 30px;
`;

const Hashtags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
`;

const Hashtag = styled.span`
  background: #f0f8ff;
  color: #0066cc;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const TargetingInfo = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const TargetingTitle = styled.h3`
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.1rem;
`;

const TargetingList = styled.ul`
  margin: 0;
  padding-left: 20px;
`;

const TargetingItem = styled.li`
  color: #666;
  margin-bottom: 5px;
`;

const EngagementSection = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const EngagementStats = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-top: 5px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const SecondaryButton = styled.button`
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 15px 30px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #667eea;
    color: white;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
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

const BackButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    text-decoration: underline;
  }
`;

const CampaignDetail = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCampaignDetail();
  }, [campaignId]);

  const fetchCampaignDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/campaigns/${campaignId}`);
      const data = await response.json();

      if (data.success) {
        setCampaign(data.data);
      } else {
        setError('Campaign not found');
      }
    } catch (err) {
      setError('Failed to load campaign details');
      console.error('Error fetching campaign:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEngagement = async (engagementType) => {
    try {
      await fetch(`/api/campaigns/${campaignId}/engage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: engagementType }),
      });
      // In production, update local state with new engagement counts
    } catch (err) {
      console.error('Error recording engagement:', err);
    }
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
      <CampaignDetailContainer>
        <LoadingSpinner>Loading campaign details...</LoadingSpinner>
      </CampaignDetailContainer>
    );
  }

  if (error) {
    return (
      <CampaignDetailContainer>
        <ErrorMessage>{error}</ErrorMessage>
        <BackButton onClick={() => navigate('/campaigns')}>
          ← Back to Campaigns
        </BackButton>
      </CampaignDetailContainer>
    );
  }

  if (!campaign) {
    return (
      <CampaignDetailContainer>
        <ErrorMessage>Campaign not found</ErrorMessage>
        <BackButton onClick={() => navigate('/campaigns')}>
          ← Back to Campaigns
        </BackButton>
      </CampaignDetailContainer>
    );
  }

  return (
    <CampaignDetailContainer>
      <BackButton onClick={() => navigate('/campaigns')}>
        ← Back to Campaigns
      </BackButton>

      <HeroSection>
        <HeroImage
          src={campaign.hero_image_url || '/images/campaigns/default.jpg'}
          alt={campaign.title}
          onError={(e) => {
            e.target.src = '/images/campaigns/default.jpg';
          }}
        />
        <HeroOverlay>
          <HeroContent>
            <HeroTitle>{campaign.title}</HeroTitle>
            <HeroDescription>{campaign.description}</HeroDescription>
            <HeroMeta>
              <CampaignTypeBadge>{getCampaignTypeLabel(campaign.type)}</CampaignTypeBadge>
              {campaign.is_featured && <FeaturedBadge>Featured</FeaturedBadge>}
            </HeroMeta>
          </HeroContent>
        </HeroOverlay>
      </HeroSection>

      <ContentSection>
        <MainContent>
          <SectionTitle>About This Campaign</SectionTitle>
          <Description>{campaign.description}</Description>

          {campaign.hashtags && campaign.hashtags.length > 0 && (
            <>
              <SectionTitle>Tags</SectionTitle>
              <Hashtags>
                {campaign.hashtags.map((hashtag, index) => (
                  <Hashtag key={index}>{hashtag}</Hashtag>
                ))}
              </Hashtags>
            </>
          )}

          <ActionButtons>
            {campaign.call_to_action && (
              <PrimaryButton onClick={() => {
                if (campaign.cta_link) {
                  window.open(campaign.cta_link, '_blank');
                }
              }}>
                {campaign.call_to_action}
              </PrimaryButton>
            )}
            <SecondaryButton onClick={() => handleEngagement('participate')}>
              Join Campaign
            </SecondaryButton>
          </ActionButtons>
        </MainContent>

        <Sidebar>
          <TargetingInfo>
            <TargetingTitle>Campaign Targeting</TargetingTitle>
            <TargetingList>
              <TargetingItem>
                <strong>User Types:</strong> {campaign.targeting.user_types.join(', ')}
              </TargetingItem>
              {campaign.targeting.sports && campaign.targeting.sports.length > 0 && (
                <TargetingItem>
                  <strong>Sports:</strong> {campaign.targeting.sports.join(', ')}
                </TargetingItem>
              )}
              {campaign.targeting.interests && campaign.targeting.interests.length > 0 && (
                <TargetingItem>
                  <strong>Interests:</strong> {campaign.targeting.interests.join(', ')}
                </TargetingItem>
              )}
              {campaign.targeting.locations && campaign.targeting.locations.length > 0 && (
                <TargetingItem>
                  <strong>Locations:</strong> {campaign.targeting.locations.map(loc =>
                    `${loc.city || loc.county || loc.state || 'Various'}`).join(', ')}
                </TargetingItem>
              )}
            </TargetingList>
          </TargetingInfo>

          <EngagementSection>
            <TargetingTitle>Community Engagement</TargetingTitle>
            <EngagementStats>
              <StatItem>
                <StatNumber>{campaign.engagement.likes_count}</StatNumber>
                <StatLabel>Likes</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>{campaign.engagement.shares_count}</StatNumber>
                <StatLabel>Shares</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>{campaign.engagement.comments_count}</StatNumber>
                <StatLabel>Comments</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>{campaign.engagement.participants_count}</StatNumber>
                <StatLabel>Participants</StatLabel>
              </StatItem>
            </EngagementStats>

            <ActionButtons>
              <SecondaryButton onClick={() => handleEngagement('like')}>
                👍 Like
              </SecondaryButton>
              <SecondaryButton onClick={() => handleEngagement('share')}>
                📤 Share
              </SecondaryButton>
            </ActionButtons>
          </EngagementSection>
        </Sidebar>
      </ContentSection>
    </CampaignDetailContainer>
  );
};

export default CampaignDetail;