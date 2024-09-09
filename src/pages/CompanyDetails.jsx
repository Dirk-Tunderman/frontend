import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Database } from "lucide-react";
import Navbar from '../components/Navbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from 'sonner';

const CompanyDetails = () => {
  const [companyData, setCompanyData] = useState([]);
  const [isEnriched, setIsEnriched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enriching, setEnriching] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axios.get(`/api/company/${id}`);
        setCompanyData(response.data);
        setIsEnriched(id.startsWith('result_'));
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch company data');
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [id]);

  const handleBack = () => {
    navigate('/overview');
  };

  const handleEnrichData = async () => {
    setEnriching(true);
    try {
      const response = await axios.post('/api/run-profile', {
        file: id,
        criteria: [] // You may want to define criteria or get it from somewhere
      });
      
      if (response.data) {
        setCompanyData(response.data);
        setIsEnriched(true);
        toast.success('Data enrichment completed successfully');
      } else {
        throw new Error('No data returned from enrichment process');
      }
    } catch (error) {
      console.error('Error enriching data:', error);
      toast.error('Failed to enrich data. Please try again.');
    } finally {
      setEnriching(false);
    }
  };

  const renderTableContent = () => {
    if (isEnriched) {
      // Handle enriched data
      return Object.entries(companyData).map(([website, data]) => (
        <TableRow key={website}>
          <TableCell>{website}</TableCell>
          <TableCell>{data.company_info.n_employees}</TableCell>
          <TableCell>{data.company_info.Headquarters}</TableCell>
          <TableCell>{data.company_info.businesstype}</TableCell>
          <TableCell>{data.criteria_evaluation.total_points}</TableCell>
        </TableRow>
      ));
    } else {
      // Handle non-enriched data
      return companyData.map((company, index) => (
        <TableRow key={index}>
          {Object.values(company).map((value, cellIndex) => (
            <TableCell key={cellIndex}>{value}</TableCell>
          ))}
        </TableRow>
      ));
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="p-8">
        <Button onClick={handleBack} className="mb-4 bg-orange-500 hover:bg-orange-600 text-white">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Accumulated Companies
        </Button>
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-8">Company Details: {id.replace('.json', '')}</h1>
        <div className="bg-gray-800 rounded-lg overflow-hidden mb-8 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {isEnriched ? (
                  <>
                    <TableHead className="text-orange-500">Website</TableHead>
                    <TableHead className="text-orange-500">Employees</TableHead>
                    <TableHead className="text-orange-500">Headquarters</TableHead>
                    <TableHead className="text-orange-500">Business Type</TableHead>
                    <TableHead className="text-orange-500">Total Points</TableHead>
                  </>
                ) : (
                  Object.keys(companyData[0] || {}).map((key, index) => (
                    <TableHead key={index} className="text-orange-500">{key}</TableHead>
                  ))
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderTableContent()}
            </TableBody>
          </Table>
        </div>
        {!isEnriched && (
          <div className="flex justify-center">
            <Button 
              onClick={handleEnrichData} 
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2"
              disabled={enriching}
            >
              <Database className="mr-2 h-4 w-4" />
              {enriching ? 'Enriching...' : 'Enrich Company Data'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetails;