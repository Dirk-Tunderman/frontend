import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Linkedin, Database } from "lucide-react";
import Navbar from '../components/Navbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const CompanyDetails = () => {
  const [companies, setCompanies] = useState([]);
  const [isEnriched, setIsEnriched] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      // Simulating API call to fetch company details
      const dummyCompanies = [
        { id: '1', name: 'TechCorp', industry: 'Technology', location: 'San Francisco, CA', website: 'techcorp.com', phoneNumber: '123-456-7890' },
        { id: '2', name: 'MediHealth', industry: 'Healthcare', location: 'Boston, MA', website: 'medihealth.com', phoneNumber: '234-567-8901' },
        { id: '3', name: 'GreenEnergy', industry: 'Renewable Energy', location: 'Austin, TX', website: 'greenenergy.com', phoneNumber: '345-678-9012' },
      ];
      setCompanies(dummyCompanies);

      // Check if the company is enriched (this would typically come from your API)
      const enrichedStatus = ['1', '3'].includes(id); // Dummy logic for demonstration
      setIsEnriched(enrichedStatus);
    };

    fetchCompanyDetails();
  }, [id]);

  const handleBack = () => {
    navigate('/overview');
  };

  const handleEnrichData = () => {
    console.log('Enriching data for all companies');
    setIsEnriched(true);
  };

  const handleStartCampaign = () => {
    console.log('Starting outreach campaign');
    // Implement campaign logic here
  };

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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-center">
          {!isEnriched ? (
            <Button onClick={handleEnrichData} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2">
              <Database className="mr-2 h-4 w-4" />
              Enrich All Companies
            </Button>
          ) : (
            <Button onClick={handleStartCampaign} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2">
              <Mail className="mr-2 h-4 w-4" />
              <Linkedin className="mr-2 h-4 w-4" />
              Start Outreach Campaign
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;