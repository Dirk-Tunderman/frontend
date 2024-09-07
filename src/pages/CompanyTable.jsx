import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Navbar from '../components/Navbar';

const CompanyTable = () => {
  const [companies, setCompanies] = useState([]);
  const { templateId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulating fetching companies from an API
    const dummyCompanies = [
      { id: 1, name: 'TechCorp', website: 'techcorp.com', decisionMakers: 'John Doe', contactInfo: 'john@techcorp.com', rankingScore: 85, emailsFound: 'Yes', phoneNumber: '123-456-7890' },
      { id: 2, name: 'MediHealth', website: 'medihealth.com', decisionMakers: 'Jane Smith', contactInfo: 'jane@medihealth.com', rankingScore: 92, emailsFound: 'Yes', phoneNumber: '234-567-8901' },
      { id: 3, name: 'GreenEnergy', website: 'greenenergy.com', decisionMakers: 'Bob Green', contactInfo: 'bob@greenenergy.com', rankingScore: 78, emailsFound: 'No', phoneNumber: '345-678-9012' },
    ];
    setCompanies(dummyCompanies);
  }, []);

  const handleBack = () => {
    navigate('/email-creation');
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="p-8">
        <Button onClick={handleBack} className="mb-8 bg-orange-500 hover:bg-orange-600 text-white">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Email Templates
        </Button>
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-8">Company Details for Template {templateId}</h1>
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-orange-500">Company Name</TableHead>
                <TableHead className="text-orange-500">Website</TableHead>
                <TableHead className="text-orange-500">Decision Makers</TableHead>
                <TableHead className="text-orange-500">Contact Info</TableHead>
                <TableHead className="text-orange-500">Ranking Score</TableHead>
                <TableHead className="text-orange-500">Emails Found</TableHead>
                <TableHead className="text-orange-500">Phone Number</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="text-white">{company.name}</TableCell>
                  <TableCell className="text-white">{company.website}</TableCell>
                  <TableCell className="text-white">{company.decisionMakers}</TableCell>
                  <TableCell className="text-white">{company.contactInfo}</TableCell>
                  <TableCell className="text-white">{company.rankingScore}</TableCell>
                  <TableCell className="text-white">{company.emailsFound}</TableCell>
                  <TableCell className="text-white">{company.phoneNumber}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default CompanyTable;