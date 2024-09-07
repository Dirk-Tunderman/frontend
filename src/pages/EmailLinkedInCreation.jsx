import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Upload, Send } from "lucide-react";
import Navbar from '../components/Navbar';

const EmailLinkedInCreation = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    // Handle file upload logic here
    console.log('File uploaded:', file);
  };

  const handleCreateAndSend = () => {
    // Handle email and LinkedIn request creation and sending logic here
    console.log('Creating and sending email and LinkedIn request');
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="p-8">
        <Button onClick={handleBack} className="mb-4 bg-orange-500 hover:bg-orange-600 text-white">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Company Table
        </Button>
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-8">Create Email & LinkedIn Request</h1>
        <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6">
          <div className="mb-6">
            <label htmlFor="file-upload" className="block text-white mb-2">Upload File (PDF, TXT, Word)</label>
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.txt,.doc,.docx"
              className="bg-gray-700 text-white"
            />
          </div>
          <div className="flex justify-between">
            <Button onClick={handleUpload} className="bg-orange-500 hover:bg-orange-600 text-white">
              <Upload className="mr-2 h-4 w-4" /> Upload File
            </Button>
            <Button onClick={handleCreateAndSend} className="bg-orange-500 hover:bg-orange-600 text-white">
              <Send className="mr-2 h-4 w-4" /> Create & Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailLinkedInCreation;