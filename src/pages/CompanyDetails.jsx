import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Linkedin } from "lucide-react";
import Navbar from '../components/Navbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const CompanyDetails = () => {
  const [company, setCompany] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulating fetching company details from an API
    const dummyCompanies = [
      { id: 1, name: 'TechCorp', industry: 'Technology', location: 'San Francisco, CA', enriched: true, website: 'techcorp.com', phoneNumber: '123-456-7890', decisionMakers: 'John Doe', contactInfo: 'john@techcorp.com', rankingScore: 85, emailsFound: 'Yes' },
      { id: 2, name: 'MediHealth', industry: 'Healthcare', location: 'Boston, MA', enriched: false, website: 'medihealth.com', phoneNumber: '234-567-8901' },
    ];
    const foundCompany = dummyCompanies.find(c => c.id === parseInt(id));
    setCompany(foundCompany);
  }, [id]);

  const handleBack = () => {
    navigate('/overview');
  };

  const handleOutreachCampaign = () => {
    // Implement outreach campaign logic here
    console.log('Starting outreach campaign for', company.name);
  };

  if (!company) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="p-8">
        <Button onClick={handleBack} className="mb-4 bg-orange-500 hover:bg-orange-600 text-white">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Accumulated Companies
        </Button>
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-8">{company.name} Details</h1>
        <div className="bg-gray-800 rounded-lg overflow-hidden mb-8">
          <Table>
            <TableHeader>
              <TableRow>
                {company.enriched ? (
                  <>
                    <TableHead className="text-orange-500">Company Name</TableHead>
                    <TableHead className="text-orange-500">Website</TableHead>
                    <TableHead className="text-orange-500">Decision Makers</TableHead>
                    <TableHead className="text-orange-500">Contact Info</TableHead>
                    <TableHead className="text-orange-500">Ranking Score</TableHead>
                    <TableHead className="text-orange-500">Emails Found</TableHead>
                    <TableHead className="text-orange-500">Phone Number</TableHead>
                  </>
                ) : (
                  <>
                    <TableHead className="text-orange-500">Company Name</TableHead>
                    <TableHead className="text-orange-500">Website</TableHead>
                    <TableHead className="text-orange-500">Phone Number</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                {company.enriched ? (
                  <>
                    <TableCell className="text-white">{company.name}</TableCell>
                    <TableCell className="text-white">{company.website}</TableCell>
                    <TableCell className="text-white">{company.decisionMakers}</TableCell>
                    <TableCell className="text-white">{company.contactInfo}</TableCell>
                    <TableCell className="text-white">{company.rankingScore}</TableCell>
                    <TableCell className="text-white">{company.emailsFound}</TableCell>
                    <TableCell className="text-white">{company.phoneNumber}</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell className="text-white">{company.name}</TableCell>
                    <TableCell className="text-white">{company.website}</TableCell>
                    <TableCell className="text-white">{company.phoneNumber}</TableCell>
                  </>
                )}
              </TableRow>
            </TableBody>
          </Table>
        </div>
        {company.enriched && (
          <div className="flex justify-center">
            <Button onClick={handleOutreachCampaign} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2">
              <Mail className="mr-2 h-4 w-4" />
              <Linkedin className="mr-2 h-4 w-4" />
              Start Outreach Campaign
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetails;