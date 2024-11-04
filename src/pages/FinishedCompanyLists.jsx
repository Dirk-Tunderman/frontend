import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Trash2, Calendar, Clock, Users, ArrowRight } from "lucide-react";
import Navbar from '../components/Navbar';
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

import createAxiosInstance from '../config/axios';

const FinishedCompanyLists = () => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      console.log('Starting to fetch files...');
      setIsLoading(true);
      setError(null);
      try {
        console.log('Creating axios instance...');
        const axiosInstance = await createAxiosInstance();
        console.log('Axios instance created, making request...');
        const response = await axiosInstance.get('/finished-companies');
        console.log('Received response:', response);
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
    // Remove 'complete_' prefix and '.json' extension
    let name = filename.replace('complete_', '').replace('.json', '');
    
    // Split by date pattern
    const [nameSection, dateTimeSection] = name.split('_2024-');
    
    if (!dateTimeSection) return { name: name, date: '', time: '' };
    
    // Format the name section
    const formattedName = nameSection
      .replace(/_/g, ' ')
      .replace(/\+/g, ' plus ')
      .replace(/1strun/g, '1st run')
      .trim();
    
    // Process date and time
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
    e.stopPropagation(); // Prevent triggering the card click
    try {
      await axios.delete(`/api/delete-file/finished/${filename}`);
      toast.success(`Campaign deleted successfully`);
      // Refresh the files list
      const axiosInstance = await createAxiosInstance();
      const response = await axiosInstance.get('/finished-companies');
      setFiles(response.data);
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error(`Failed to delete campaign`);
    }
  };

  const FileCard = ({ file }) => {
    const { name, date, time } = formatDisplayName(file.filename);
    
    return (
      <Card 
        className="group bg-gray-800 border border-gray-700 hover:border-orange-500 transition-all duration-300 cursor-pointer overflow-hidden"
        onClick={() => handleFileClick(file.filename)}
      >
        <CardContent className="p-6 relative">
          {/* Top Section with Icon and Delete */}
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-orange-500 bg-opacity-20 rounded-lg">
              <FileText className="h-6 w-6 text-orange-500" />
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <Trash2 className="h-4 w-4 text-red-500 hover:text-red-400" />
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
          </div>

          {/* Campaign Name */}
          <h3 className="font-semibold text-white text-xl mb-4 line-clamp-2 min-h-[3.5rem]">
            {name}
          </h3>

          {/* Date and Time Info */}
          <div className="space-y-2">
            <div className="flex items-center text-gray-400">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm">{date}</span>
            </div>
            {time && (
              <div className="flex items-center text-gray-400">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm">{time}</span>
              </div>
            )}
          </div>

          {/* View Details Button */}
          <div className="mt-6 flex items-center text-orange-500 group-hover:translate-x-1 transition-transform duration-200">
            <span className="text-sm font-medium">View Details</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="container mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center text-orange-500">Ready Campains</h1>
          <p className="text-gray-400 text-center mt-2">These lists are ready to be reach out to</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {files.map((file, index) => (
              <FileCard key={file.filename} file={file} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinishedCompanyLists;