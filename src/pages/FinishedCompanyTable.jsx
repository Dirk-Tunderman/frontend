import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail } from "lucide-react";
import Navbar from '../components/Navbar';
import { Check, X } from "lucide-react"; // Keep this import at the top

import { Switch } from "../components/ui/switch"; // Add this import at the top

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

const FinishedCompanyTable = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [campaignRunning, setCampaignRunning] = useState(false);
  const navigate = useNavigate();
  const { filename } = useParams();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        console.log('Fetching data for filename:', filename);
        const response = await axios.get(`/api/finished-company/${filename}`);
        console.log('Raw API Response:', response.data);

        if (!response.data) {
          throw new Error('No data received from the API');
        }

        // Transform the data according to the specified requirements
        const transformedData = response.data.map(companyObj => {
          // Get the company name and data from the object
          const companyName = Object.keys(companyObj)[0];
          const companyData = companyObj[companyName];

          // Get the correct nested data
          const info = companyData.company_info;
          const outreachData = companyData.outreach_data;
          
          return {
            name: companyName,
            about: info.company_type || 'N/A',
            n_employees: info.n_employees === 'Not provided' ? info.company_size : info.n_employees || 'N/A',
            url: info.url || 'N/A',
            headquarters: info.headquarters || 'N/A',
            total_points: companyData.evaluation_criteria?.total_points || 0,
            email_send: outreachData?.email_send || 0,
            cold_call_made: outreachData?.cold_call_made || 0
          };
        });

        console.log('Final transformed data:', transformedData);
        setCompanies(transformedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching company data:', err);
        setError(`Failed to fetch company data: ${err.message}`);
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [filename]);

  const handleBack = () => {
    navigate('/finished-companies');
  };

  const handleRowClick = (companyName) => {
    navigate(`/finished-company-dashboard/${filename}/${encodeURIComponent(companyName)}`);
  };

  const handleCallStatusChange = async (companyName, newStatus) => {
    try {
      await axios.post('/api/update-call-status', {
        filename,
        companyName,
        status: newStatus ? 1 : 0  // Convert boolean to 1 or 0
      });
      
      // Update local state
      setCompanies(companies.map(company => {
        if (company.name === companyName) {
          return { ...company, cold_call_made: newStatus ? 1 : 0 };
        }
        return company;
      }));
      
      toast.success(`Call status ${newStatus ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error('Error updating call status:', error);
      toast.error('Failed to update call status');
    }
  };

  const handleSendEmails = async () => {
    try {
      setCampaignRunning(true);
      console.log('Sending request to /api/send-emails');
      console.log('Data being sent:', { filename, companies });
      const response = await axios.post('/api/send-emails', { filename, companies });
      console.log('Response:', response);
      toast.success('Email campaign started successfully');
    } catch (error) {
      console.error('Error starting email campaign:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      toast.error('Failed to start email campaign');
    } finally {
      setCampaignRunning(false);
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="p-8">
        <Button onClick={handleBack} className="mb-4 bg-orange-500 hover:bg-orange-600 text-white">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Finished Company Lists
        </Button>
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-8">Finished Companies: {filename}</h1>
        
        {companies.length === 0 ? (
          <p className="text-white text-center">No companies found.</p>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden mb-8 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-orange-500">Company Name</TableHead>
                  <TableHead className="text-orange-500">Business Type</TableHead>
                  <TableHead className="text-orange-500">Size</TableHead>
                  <TableHead className="text-orange-500">Website</TableHead>
                  <TableHead className="text-orange-500">Location</TableHead>
                  <TableHead className="text-orange-500">Score</TableHead>
                  <TableHead className="text-orange-500">Email Sent</TableHead>
                  <TableHead className="text-orange-500">Call Made</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company, index) => (
                  <TableRow 
                    key={index}
                    className="hover:bg-gray-700 cursor-pointer transition-colors"
                    onClick={() => handleRowClick(company.name)}
                  >
                    <TableCell className="text-white">{company.name || 'N/A'}</TableCell>
                    <TableCell className="text-white">{company.about || 'N/A'}</TableCell>
                    <TableCell className="text-white">{company.n_employees || 'N/A'}</TableCell>
                    <TableCell>
                      {company.url !== 'N/A' ? (
                        <a 
                          href={company.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-400 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {company.url}
                        </a>
                      ) : (
                        <span className="text-white">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="text-white">{company.headquarters || 'N/A'}</TableCell>
                    <TableCell className="text-white">{company.total_points}</TableCell>
                    <TableCell className="text-white">
                        <div className="flex items-center justify-center">
                            {company.email_send === 1 ? (
                            <Check className="h-5 w-5 text-green-500" />
                            ) : (
                            <X className="h-5 w-5 text-red-500" />
                            )}
                        </div>
                        </TableCell>
                    <TableCell className="text-white">
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <Switch
                            checked={company.cold_call_made === 1}
                            onCheckedChange={(checked) => handleCallStatusChange(company.name, checked)}
                            className="data-[state=checked]:bg-orange-500"
                            />
                            <span>{company.cold_call_made === 1 ? 'Yes' : 'No'}</span>
                        </div>
                        </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex justify-center mt-8">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                className="bg-green-500 hover:bg-green-600 text-white"
                disabled={campaignRunning}
              >
                <Mail className="mr-2 h-4 w-4" />
                {campaignRunning ? 'Campaign Running' : 'Send All Emails'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will send out emails to all companies in this list. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSendEmails}>Send Emails</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default FinishedCompanyTable;