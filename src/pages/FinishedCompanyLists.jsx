import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import createAxiosInstance from '../config/axios';
import { Trash2 } from "lucide-react";
import Navbar from '../components/Navbar';
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const FinishedCompanyLists = () => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const axiosInstance = await createAxiosInstance();
        const response = await axiosInstance.get('/finished-companies');
        setFiles(response.data);
      } catch (error) {
        console.error('Error details:', error.response || error);
        setError('Failed to fetch finished companies. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const formatDisplayName = (filename) => {
    let name = filename.replace('complete_', '').replace('.json', '');
    const [nameSection, dateTimeSection] = name.split('_2024-');
    
    if (!dateTimeSection) return { name: name, date: '', time: '' };
    
    const formattedName = nameSection
      .replace(/_/g, ' ')
      .replace(/\+/g, ' plus ')
      .replace(/1strun/g, '1st run')
      .trim();
    
    const [date, time] = dateTimeSection.split('--');
    const formattedDate = `2024-${date}`;
    const formattedTime = time ? time.replace(/-/g, ':') : '';
    
    return {
      name: formattedName,
      date: formattedDate,
      time: formattedTime
    };
  };

  const handleFileClick = (filename) => {
    navigate(`/finished-company-table/${encodeURIComponent(filename)}`);
  };

  const handleDelete = async (filename, e) => {
    e.stopPropagation();
    try {
      const axiosInstance = await createAxiosInstance();
      await axiosInstance.delete(`/complete-file/${filename}`);
      toast.success(`Campaign deleted successfully`);
      const response = await axiosInstance.get('/finished-companies');
      setFiles(response.data);
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error(`Failed to delete campaign: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="container mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-orange-500">Ready Campaigns</h1>
          <p className="text-gray-400 mt-2">These lists are ready to be reached out to</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-white">Loading campaigns...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-red-500 text-center">
              <p className="text-xl mb-2">😕</p>
              <p>{error}</p>
            </div>
          </div>
        ) : files.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-400 text-center">
              <p className="text-xl mb-2">📭</p>
              <p>No campaigns found</p>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Companies</TableHead>
                <TableHead className="text-right">Found</TableHead>
                <TableHead className="text-right">Contacted</TableHead>
                <TableHead className="text-right">Responses</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => {
                const { name, date, time } = formatDisplayName(file.filename);
                const meta = file.meta_data || {};
                return (
                  <TableRow 
                    key={file.filename}
                    className="hover:bg-gray-800/50 cursor-pointer"
                    onClick={() => handleFileClick(file.filename)}
                  >
                    <TableCell>{name}</TableCell>
                    <TableCell>{date}</TableCell>
                    <TableCell>{time}</TableCell>
                    <TableCell className="text-right">{file.count || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col">
                        <span>📧 {meta.email_found || 0}</span>
                        <span>💼 {meta.linkedin_found || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col">
                        <span>📧 {meta.email_send || 0}</span>
                        <span>💼 {meta.linkedin_send || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col">
                        <span>📧 {meta.response_email || 0}</span>
                        <span>📞 {meta.response_call || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Campaign?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete this campaign and all its associated data. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={(e) => handleDelete(file.filename, e)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};
export default FinishedCompanyLists;