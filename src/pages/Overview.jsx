import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Building2, Mail, Linkedin } from "lucide-react";
import Navbar from '../components/Navbar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Overview = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulating fetching companies from an API
    const dummyCompanies = [
      { id: 1, name: 'TechCorp', industry: 'Technology', location: 'San Francisco, CA', enriched: true, website: 'techcorp.com', phoneNumber: '123-456-7890', decisionMakers: 'John Doe', contactInfo: 'john@techcorp.com', rankingScore: 85, emailsFound: 'Yes' },
      { id: 2, name: 'MediHealth', industry: 'Healthcare', location: 'Boston, MA', enriched: false, website: 'medihealth.com', phoneNumber: '234-567-8901' },
      { id: 3, name: 'GreenEnergy', industry: 'Renewable Energy', location: 'Austin, TX', enriched: true, website: 'greenenergy.com', phoneNumber: '345-678-9012', decisionMakers: 'Jane Smith', contactInfo: 'jane@greenenergy.com', rankingScore: 92, emailsFound: 'Yes' },
      { id: 4, name: 'FinanceHub', industry: 'Finance', location: 'New York, NY', enriched: false, website: 'financehub.com', phoneNumber: '456-789-0123' },
      { id: 5, name: 'ShopNow', industry: 'E-commerce', location: 'Seattle, WA', enriched: true, website: 'shopnow.com', phoneNumber: '567-890-1234', decisionMakers: 'Bob Green', contactInfo: 'bob@shopnow.com', rankingScore: 78, emailsFound: 'Yes' },
    ];
    setCompanies(dummyCompanies);
  }, []);

  const handleCompanySelection = (company) => {
    setSelectedCompany(company);
  };

  const handleOutreachCampaign = () => {
    if (selectedCompany && selectedCompany.enriched) {
      navigate('/email-linkedin-creation');
    } else {
      alert('Please select an enriched company before starting an outreach campaign.');
    }
  };

  const filteredCompanies = companies.filter(company => {
    if (filter === 'all') return true;
    if (filter === 'enriched') return company.enriched;
    if (filter === 'not-enriched') return !company.enriched;
    return true;
  });

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="p-8">
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-8">Accumulated Companies</h1>
        <div className="mb-6 max-w-xs mx-auto">
          <Select onValueChange={setFilter} defaultValue="all">
            <SelectTrigger className="w-full bg-gray-800 text-white border-orange-500">
              <SelectValue placeholder="Filter companies" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-orange-500">
              <SelectItem value="all">All Companies</SelectItem>
              <SelectItem value="enriched">Enriched Companies</SelectItem>
              <SelectItem value="not-enriched">Not Enriched Companies</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {filteredCompanies.map((company) => (
            <Card 
              key={company.id} 
              className={`bg-gray-800 border border-orange-300 hover:shadow-lg transition-shadow duration-300 cursor-pointer ${selectedCompany?.id === company.id ? 'ring-2 ring-orange-500' : ''}`}
              onClick={() => handleCompanySelection(company)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Building2 className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="font-semibold text-white text-lg mb-1">{company.name}</h3>
                <p className="text-sm text-gray-300">{company.industry}</p>
                <p className="text-sm text-gray-300">{company.location}</p>
                <p className="text-sm text-orange-500 mt-2">
                  {company.enriched ? 'Enriched' : 'Not Enriched'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        {selectedCompany && (
          <div className="bg-gray-800 rounded-lg overflow-hidden mb-8">
            <Table>
              <TableHeader>
                <TableRow>
                  {selectedCompany.enriched ? (
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
                  {selectedCompany.enriched ? (
                    <>
                      <TableCell className="text-white">{selectedCompany.name}</TableCell>
                      <TableCell className="text-white">{selectedCompany.website}</TableCell>
                      <TableCell className="text-white">{selectedCompany.decisionMakers}</TableCell>
                      <TableCell className="text-white">{selectedCompany.contactInfo}</TableCell>
                      <TableCell className="text-white">{selectedCompany.rankingScore}</TableCell>
                      <TableCell className="text-white">{selectedCompany.emailsFound}</TableCell>
                      <TableCell className="text-white">{selectedCompany.phoneNumber}</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="text-white">{selectedCompany.name}</TableCell>
                      <TableCell className="text-white">{selectedCompany.website}</TableCell>
                      <TableCell className="text-white">{selectedCompany.phoneNumber}</TableCell>
                    </>
                  )}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
        {selectedCompany && selectedCompany.enriched && (
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

export default Overview;