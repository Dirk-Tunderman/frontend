import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Building2, Users, Globe, Mail, BarChart, Phone, MapPin, Calendar, Info, Link, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from '../components/Navbar';

const FinishedCompanyDashboard = () => {
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { filename, companyName } = useParams();

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        console.log('Fetching data for:', filename, companyName);
        const response = await axios.get(`/api/finished-company/${encodeURIComponent(filename)}/${encodeURIComponent(companyName)}`);
        console.log('API Response:', response.data);
        
        if (response.data.error) {
          throw new Error(response.data.error);
        }
        
        // Extract the nested company_info structure
        const formattedData = {
          company_info: response.data.company_info?.company_info || {},
          decision_maker: response.data.company_info?.decision_maker || response.data.decision_maker || [],
          email: response.data.company_info?.email || response.data.email || {},
          outreach_data: response.data.company_info?.outreach_data || response.data.outreach_data || {}
        };
        
        setCompanyData(formattedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching company data:', err);
        setError('Failed to fetch company data: ' + err.message);
        setLoading(false);
      }
    };
  
    fetchCompanyData();
  }, [filename, companyName]);

  const handleBack = () => {
    navigate(`/finished-company-table/${filename}`);
  };

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!companyData) return <div className="text-white">No data available</div>;

  const company = companyData.company_info || {};
  const decisionMaker = Array.isArray(companyData.decision_maker) ? 
    companyData.decision_maker[0] : companyData.decision_maker || {};
  const email = companyData.email || {};
  const outreachData = companyData.outreach_data || {};

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="p-8">
        {/* Back Button */}
        <Button onClick={handleBack} className="mb-4 bg-orange-500 hover:bg-orange-600 text-white">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Company List
        </Button>

        {/* Company Name and Outreach Status Banner */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center text-orange-500 mb-4">{company.company_name || 'N/A'}</h1>
          
          {/* Outreach Status Cards - Prominent Position */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-800 p-4 rounded-lg border border-orange-500">
            <StatusCard 
              title="Email Found" 
              value={outreachData?.email_dm_found} 
              icon={<Mail className="h-5 w-5" />}
            />
            <StatusCard 
              title="LinkedIn Found" 
              value={outreachData?.linkedin_dm_found}
              icon={<Link className="h-5 w-5" />}
            />
            <StatusCard 
              title="Email Sent" 
              value={outreachData?.email_send}
              icon={<Mail className="h-5 w-5" />}
            />
            <StatusCard 
              title="Call Made" 
              value={outreachData?.cold_call_made}
              icon={<Phone className="h-5 w-5" />}
            />
          </div>
        </div>

        {/* Key Company Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <QuickInfoCard 
            icon={<Building2 />} 
            label="Company Type" 
            value={company.company_type}
          />
          <QuickInfoCard 
            icon={<Users />} 
            label="Size" 
            value={company.company_size}
          />
          <QuickInfoCard 
            icon={<MapPin />} 
            label="Location" 
            value={company.headquarters}
          />
          <QuickInfoCard 
            icon={<Briefcase />} 
            label="Business Type" 
            value={company.businesstype}
          />
        </div>

        {/* Two Column Layout for Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Company Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card className="bg-gray-800 border-orange-500">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="mr-2" />
                  About Company
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{company.about || 'N/A'}</p>
              </CardContent>
            </Card>

            {/* Description and Services */}
            <div className="grid grid-cols-1 gap-6">
              <DescriptionCard 
                title="Company Description" 
                content={company.company_description}
                icon={<Building2 className="h-5 w-5" />}
              />
              <DescriptionCard 
                title="Services & Products" 
                content={company.service_product_desc}
                icon={<Briefcase className="h-5 w-5" />}
              />
            </div>

            {/* Recent News */}
            {company.recent_news && company.recent_news.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-orange-500">Recent News</h2>
                <div className="grid grid-cols-1 gap-4">
                  {company.recent_news.map((news, index) => (
                    <NewsCard key={index} news={news} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Decision Maker and Contact */}
          <div className="space-y-8">
            {/* Decision Maker Card - Prominent */}
            <Card className="bg-gray-800 border-orange-500">
              <CardHeader>
                <CardTitle className="text-xl text-orange-500">Key Decision Maker</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-2xl font-bold">{decisionMaker?.full_name || 'N/A'}</div>
                <div className="space-y-2">
                  <InfoRow label="Position" value={decisionMaker?.decision_maker_position} />
                  <InfoRow label="Confidence" value={decisionMaker?.decision_maker_confidence_score} />
                  <InfoRow label="Email" value={decisionMaker?.personal_email?.trim()} />
                  {decisionMaker?.personal_linkedin_url && (
                    <div>
                      <span className="font-semibold">LinkedIn: </span>
                      <a 
                        href={decisionMaker.personal_linkedin_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-400 hover:underline"
                      >
                        View Profile
                      </a>
                    </div>
                  )}
                  {decisionMaker?.general_description_profile && (
                    <div className="mt-4">
                      <span className="font-semibold block mb-1">Profile:</span>
                      <p className="text-sm text-gray-300">{decisionMaker.general_description_profile}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact & Quick Facts */}
            <Card className="bg-gray-800 border-orange-500">
              <CardHeader>
                <CardTitle>Quick Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <InfoRow label="Founded" value={company.founded} />
                <InfoRow label="Employees" value={company.n_employees} />
                <InfoRow label="Followers" value={company.followers} />
                <InfoRow label="Website" value={company.url} isLink />
              </CardContent>
            </Card>

            {/* Generated Email Preview */}
            <EmailPreviewCard email={email} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const StatusCard = ({ title, value, icon }) => (
  <div className="text-center p-3 bg-gray-900 rounded-lg">
    <div className="flex justify-center mb-2">{icon}</div>
    <div className="text-sm font-medium mb-1">{title}</div>
    <div className="text-xl font-bold text-orange-500">{value ? 'Yes' : 'No'}</div>
  </div>
);

const QuickInfoCard = ({ icon, label, value }) => (
  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center space-x-3">
    <div className="text-orange-500">{icon}</div>
    <div>
      <div className="text-sm text-gray-400">{label}</div>
      <div className="font-semibold">{value || 'N/A'}</div>
    </div>
  </div>
);

const DescriptionCard = ({ title, content, icon }) => (
  <Card className="bg-gray-800 border-orange-500">
    <CardHeader>
      <CardTitle className="flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p>{content || 'N/A'}</p>
    </CardContent>
  </Card>
);

const NewsCard = ({ news }) => (
  <Card className="bg-gray-800 border-orange-500">
    <CardHeader>
      <CardTitle>{news.title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p><strong>Date:</strong> {news.date}</p>
      <p className="mt-2">{news.summary}</p>
    </CardContent>
  </Card>
);

const InfoRow = ({ label, value, isLink }) => (
  <div className="flex justify-between items-center">
    <span className="font-semibold">{label}:</span>
    {isLink && value && value !== 'N/A' ? (
      <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
        {value}
      </a>
    ) : (
      <span>{value || 'N/A'}</span>
    )}
  </div>
);

const EmailPreviewCard = ({ email }) => (
  <Card className="bg-gray-800 border-orange-500">
    <CardHeader>
      <CardTitle className="flex items-center">
        <Mail className="mr-2" />
        Email Preview
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div>
        <span className="font-semibold">To:</span> {Array.isArray(email?.email_reciever) ? email.email_reciever.join(', ') : email?.email_reciever || 'N/A'}
      </div>
      <div>
        <span className="font-semibold">Subject:</span> {email?.subjectline || 'N/A'}
      </div>
      <div className="mt-4 p-3 bg-gray-900 rounded-md whitespace-pre-wrap text-sm">
        {email?.email?.replace(/\\n/g, '\n') || 'No email content available'}
      </div>
      <div className="mt-2 text-sm text-gray-400">
        <span className="font-semibold">Timezone:</span> {email?.timezone || 'N/A'}
      </div>
    </CardContent>
  </Card>
);

export default FinishedCompanyDashboard;