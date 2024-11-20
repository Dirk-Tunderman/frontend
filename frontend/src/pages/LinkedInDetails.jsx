//-------LINKEDINDETAILS--------//


import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Navbar from '../components/Navbar';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Database } from "lucide-react";

const LinkedInDetails = () => {
  const [linkedinData, setLinkedinData] = useState(null);
  const { filename } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLinkedInData = async () => {
      try {
        const response = await axios.get(`/api/linkedin-data/${filename}`);
        console.log("LinkedIn data response:", response.data); // Add this log
        setLinkedinData(response.data);
      } catch (error) {
        console.error("Error fetching LinkedIn data:", error.response ? error.response.data : error.message);
      }
    };
  
    fetchLinkedInData();
  }, [filename]);

  const handleBack = () => {
    navigate('/overview');
  };

  const handleSetCriteria = () => {
    navigate(`/set-linkedin-criteria/${filename}`);
  };

  if (!linkedinData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="p-8">
        <Button onClick={handleBack} className="mb-4 bg-orange-500 hover:bg-orange-600 text-white">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Accumulated Data
        </Button>
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-8">LinkedIn Data: {filename}</h1>
        <div className="bg-gray-800 rounded-lg overflow-hidden mb-8 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-orange-500">Name</TableHead>
                <TableHead className="text-orange-500">Function</TableHead>
                <TableHead className="text-orange-500">Company</TableHead>
                <TableHead className="text-orange-500">Time in Function</TableHead>
                <TableHead className="text-orange-500">Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {linkedinData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.function}</TableCell>
                  <TableCell>{item.company}</TableCell>
                  <TableCell>{item.time_in_func}</TableCell>
                  <TableCell>{item.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-center">
          <Button 
            onClick={handleSetCriteria} 
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2"
          >
            <Database className="mr-2 h-4 w-4" />
            Set Criteria for LinkedIn Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LinkedInDetails;