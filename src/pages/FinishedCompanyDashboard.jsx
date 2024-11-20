// src/pages/FinishedCompanyDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Building2, Users, Globe, Mail, BarChart, Phone, MapPin, Calendar, Info, Link, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from '../components/Navbar';
import ProblemSolutionSection from '../components/ProblemSolutionSection';
import FinishedComDashPt2 from '../components/FinishedComDashPt2';

const FinishedCompanyDashboard = () => {
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { filename, companyName } = useParams();

  // Move handleBack inside the component
  const handleBack = () => {
    navigate(`/finished-company-table/${filename}`);
  };

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        console.log('Fetching data with params:', { filename, companyName });
        const response = await axios.get(`/api/finished-company/${encodeURIComponent(filename)}/${encodeURIComponent(companyName)}`);
        console.log('Raw API Response:', response.data);
        
        if (response.data.error) {
          throw new Error(response.data.error);
        }

        setCompanyData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching company data:', err);
        setError('Failed to fetch company data: ' + err.message);
        setLoading(false);
      }
    };

    if (filename && companyName) {
      fetchCompanyData();
    }
  }, [filename, companyName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl font-bold text-orange-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!companyData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">No data available</div>
      </div>
    );
  }

  // Safely access nested data
  const company = companyData?.company_info?.company_info || {};
  const decisionMaker = Array.isArray(companyData?.decision_maker) ? 
    companyData.decision_maker[0] : companyData?.decision_maker || {};
  const outreachData = companyData?.outreach_data || {};
  const allDecisionMakers = companyData?.company_info?.decision_makers || [];
  const vacancies = companyData?.company_info?.company_info?.vacancies || [];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="p-8">
        {/* Back Button */}
        <Button 
          onClick={handleBack} 
          className="mb-4 bg-orange-500 hover:bg-orange-600 text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Company List
        </Button>

        {/* Company Name Banner */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center text-orange-500 mb-4">
            {company?.company_name || 'N/A'}
          </h1>

          {/* Outreach Status Grid */}
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <QuickInfoCard 
                icon={<Building2 />} 
                label="Company Type" 
                value={company?.company_type}
              />
              <QuickInfoCard 
                icon={<Users />} 
                label="Size" 
                value={company?.company_size}
              />
              <QuickInfoCard 
                icon={<MapPin />} 
                label="Location" 
                value={company?.headquarters}
              />
              <QuickInfoCard 
                icon={<Globe />} 
                label="Business Type" 
                value={company?.businesstype}
              />
            </div>

            {/* About Section */}
            <Card className="bg-gray-800 border-orange-500">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="mr-2" />
                  About Company
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{company?.about || 'N/A'}</p>
              </CardContent>
            </Card>

            {/* Description Cards */}
            <div className="grid grid-cols-1 gap-6">
              <DescriptionCard 
                title="Company Description" 
                content={company?.company_description}
                icon={<Building2 className="h-5 w-5" />}
              />
              <DescriptionCard 
                title="Services & Products" 
                content={company?.service_product_desc}
                icon={<Briefcase className="h-5 w-5" />}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Decision Maker Card */}
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
                </div>
              </CardContent>
            </Card>

            {/* Quick Facts */}
            <Card className="bg-gray-800 border-orange-500">
              <CardHeader>
                <CardTitle>Quick Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <InfoRow label="Founded" value={company?.founded} />
                <InfoRow label="Employees" value={company?.n_employees} />
                <InfoRow label="Followers" value={company?.followers} />
                <InfoRow label="Website" value={company?.url} isLink />
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Decision Makers Section */}
        <DecisionMakersSection decisionMakers={allDecisionMakers} />
        
        {/* Vacancies Section */}
        <VacanciesSection vacancies={vacancies} />
        {/* Problem Solution Section */}
        {companyData.problem_solution && (
          <ProblemSolutionSection problemSolution={companyData.problem_solution} />
        )}

        {/* Part 2 Content */}
        <FinishedComDashPt2 companyData={companyData} />
      </div>
    </div>
  );
};

// Helper Components (keep these the same)
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


// New Components - Add these right before the export default line
const DecisionMakersSection = ({ decisionMakers }) => (
  <Card className="bg-gray-800 border-orange-500 mt-8">
    <CardHeader>
      <CardTitle className="text-xl text-orange-500">All Decision Makers</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {decisionMakers?.map((dm, index) => (
          <Card key={index} className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-orange-500">{dm.full_name || 'N/A'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <InfoRow label="Position" value={dm.decision_maker_position} />
              <InfoRow label="Confidence Score" value={dm.decision_maker_confidence_score} />
              <InfoRow label="Country" value={dm.country_origins} />
              <InfoRow label="Time at Company" value={dm.time_at_company || 'N/A'} />
              <InfoRow label="Email" value={dm.personal_email || 'N/A'} />
              {dm.personal_linkedin_url && (
                <div className="flex justify-between items-center">
                  <span className="font-semibold">LinkedIn:</span>
                  <a 
                    href={dm.personal_linkedin_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-400 hover:underline"
                  >
                    View Profile
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </CardContent>
  </Card>
);

const VacanciesSection = ({ vacancies }) => (
  <Card className="bg-gray-800 border-orange-500 mt-8">
    <CardHeader>
      <CardTitle className="text-xl text-orange-500">Open Positions</CardTitle>
    </CardHeader>
    <CardContent>
      {vacancies && vacancies.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {vacancies.map((vacancy, index) => (
            <div key={index} className="bg-gray-900 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">
                {vacancy.position !== 'N/A' ? vacancy.position : 'Position Not Specified'}
              </h3>
              <p className="text-gray-300">
                {vacancy.description !== 'N/A' ? vacancy.description : 'No description available'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 bg-gray-900 rounded-lg">
          <p className="text-gray-300">No open positions available at this time</p>
        </div>
      )}
    </CardContent>
  </Card>
);

export default FinishedCompanyDashboard;