import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Linkedin } from "lucide-react";
import Navbar from '../components/Navbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const CompanyDetails = () => {
  const [companies, setCompanies] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulating fetching company details from an API
    const fetchCompanyDetails = async () => {
      // In a real application, you would fetch data from your API here
      const dummyCompanies = [
        { id: '1', name: 'TechCorp', industry: 'Technology', location: 'San Francisco, CA', enriched: true, website: 'techcorp.com', phoneNumber: '123-456-7890', decisionMakers: 'John Doe', contactInfo: 'john@techcorp.com', rankingScore: 85, emailsFound: 'Yes' },
        { id: '2', name: 'MediHealth', industry: 'Healthcare', location: 'Boston, MA', enriched: false, website: 'medihealth.com', phoneNumber: '234-567-8901' },
        { id: '3', name: 'GreenEnergy', industry: 'Renewable Energy', location: 'Austin, TX', enriched: true, website: 'greenenergy.com', phoneNumber: '345-678-9012', decisionMakers: 'Jane Smith', contactInfo: 'jane@greenenergy.com', rankingScore: 92, emailsFound: 'Yes' },
        { id: '4', name: 'FinanceHub', industry: 'Finance', location: 'New York, NY', enriched: false, website: 'financehub.com', phoneNumber: '456-789-0123' },
        { id: '5', name: 'ShopNow', industry: 'E-commerce', location: 'Seattle, WA', enriched: true, website: 'shopnow.com', phoneNumber: '567-890-1234', decisionMakers: 'Bob Johnson', contactInfo: 'bob@shopnow.com', rankingScore: 78, emailsFound: 'Yes' },
      ];
      setCompanies(dummyCompanies);
    };

    fetchCompanyDetails();
  }, [id]);

  const handleBack = () => {
    navigate('/overview');
  };

  const handleOutreachCampaign = () => {
    // Implement outreach campaign logic here
    console.log('Starting outreach campaign for selected companies');
  };

  const handleAccumulateData = () => {
    // Implement data accumulation logic here
    console.log('Starting data accumulation for selected companies');
  };

  if (companies.length === 0) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="p-8">
        <Button onClick={handleBack} className="mb-4 bg-orange-500 hover:bg-orange-600 text-white">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Accumulated Companies
        </Button>
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-8">Company Details</h1>
        <div className="bg-gray-800 rounded-lg overflow-hidden mb-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-orange-500">Company Name</TableHead>
                <TableHead className="text-orange-500">Industry</TableHead>
                <TableHead className="text-orange-500">Location</TableHead>
                <TableHead className="text-orange-500">Website</TableHead>
                <TableHead className="text-orange-500">Phone Number</TableHead>
                {companies.some(c => c.enriched) && (
                  <>
                    <TableHead className="text-orange-500">Decision Makers</TableHead>
                    <TableHead className="text-orange-500">Contact Info</TableHead>
                    <TableHead className="text-orange-500">Ranking Score</TableHead>
                    <TableHead className="text-orange-500">Emails Found</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="text-white">{company.name}</TableCell>
                  <TableCell className="text-white">{company.industry}</TableCell>
                  <TableCell className="text-white">{company.location}</TableCell>
                  <TableCell className="text-white">{company.website}</TableCell>
                  <TableCell className="text-white">{company.phoneNumber}</TableCell>
                  {company.enriched && (
                    <>
                      <TableCell className="text-white">{company.decisionMakers}</TableCell>
                      <TableCell className="text-white">{company.contactInfo}</TableCell>
                      <TableCell className="text-white">{company.rankingScore}</TableCell>
                      <TableCell className="text-white">{company.emailsFound}</TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-center space-x-4">
          <Button onClick={handleOutreachCampaign} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2">
            <Mail className="mr-2 h-4 w-4" />
            <Linkedin className="mr-2 h-4 w-4" />
            Start Outreach Campaign
          </Button>
          <Button onClick={handleAccumulateData} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2">
            Start Accumulating Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;