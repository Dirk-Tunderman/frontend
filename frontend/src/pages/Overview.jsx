import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Linkedin, Trash2 } from "lucide-react";
import Navbar from '../components/Navbar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import FileMergeDialog from '../components/FileMergeDialog';

const Overview = () => {
  const [companies, setCompanies] = useState([]);
  const [linkedinData, setLinkedinData] = useState([]);
  const [filter, setFilter] = useState('all');
  const [draggedFiles, setDraggedFiles] = useState([]);
  const [showMergeDialog, setShowMergeDialog] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const companiesResponse = await axios.get('/api/companies');
      setCompanies(companiesResponse.data);

      const linkedinFilesResponse = await axios.get('/api/linkedin-files');
      setLinkedinData(linkedinFilesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCompanyClick = (companyId) => {
    navigate(`/company/${companyId}`);
  };

  const handleLinkedinFileClick = (filename) => {
    navigate(`/linkedin/${filename}`);
  };

  const handleDelete = async (filename, type) => {
    try {
      await axios.delete(`/api/delete-file/${type}/${filename}`);
      toast.success(`${filename} deleted successfully`);
      fetchData();
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error(`Failed to delete ${filename}`);
    }
  };

  const handleDragStart = (e, filename, type) => {
    e.dataTransfer.setData('text/plain', filename);
    e.dataTransfer.setData('fileType', type);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = useCallback((e, targetFile, targetType) => {
    e.preventDefault();
    const draggedFile = e.dataTransfer.getData('text/plain');
    const draggedType = e.dataTransfer.getData('fileType');
    
    if (draggedFile === targetFile) {
      return;
    }

    if (draggedType !== targetType) {
      toast.error("You can only merge files from the same directory type");
      return;
    }

    setDraggedFiles([draggedFile, targetFile]);
    setShowMergeDialog(true);
  }, []);

  const GroupHeader = ({ title }) => (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-orange-500 mb-4">{title}</h2>
      <div className="w-full h-px bg-gray-700 mb-6"></div>
    </div>
  );

  const CompanyCard = ({ company, type = 'result' }) => {
    return (
      <Card 
        className={`bg-gray-800 border ${
          type === 'result' 
            ? 'border-orange-300 hover:border-orange-400' 
            : 'border-green-300 hover:border-green-400'
        } hover:shadow-lg transition-shadow duration-300`}
        draggable={true}
        onDragStart={(e) => handleDragStart(e, company.name, type)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, company.name, type)}
      >
        <CardContent className="p-4 relative">
          <div className="flex items-center justify-between mb-2">
            <Building2 className={`h-6 w-6 ${type === 'result' ? 'text-orange-500' : 'text-green-500'}`} />
            <div className="flex items-center gap-2">
              {/* Object count badge */}
              <span className={`px-2 py-1 rounded-full text-xs ${
                type === 'result' ? 'bg-orange-500/20 text-orange-300' : 'bg-green-500/20 text-green-300'
              }`}>
                {`${company.count} companies`}
              </span>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the file.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(company.name, 'company')}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <div onClick={() => handleCompanyClick(company.name)} className="cursor-pointer">
            <h3 className="font-semibold text-white text-lg mb-1">{company.profession}</h3>
            <p className="text-sm text-gray-300">{company.location}</p>
            <p className="text-sm text-gray-300">{company.date}</p>
            {type === 'result' && (
              <p className={`text-sm mt-2 ${company.enriched ? 'text-green-500' : 'text-red-500'}`}>
                {company.enriched ? 'Enriched' : 'Not Enriched'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };
  
  const LinkedInDataCard = ({ filename, count }) => {
    // Function to format the display name
    const formatDisplayName = (name) => {
      return name.replace(/[*]/g, ' ').replace(/_/g, ' ');
    };

    return (
      <Card 
        className="bg-gray-800 border border-blue-300 hover:border-blue-400 hover:shadow-lg transition-shadow duration-300"
        draggable={true}
        onDragStart={(e) => handleDragStart(e, filename, 'linkedin')}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, filename, 'linkedin')}
      >
        <CardContent className="p-4 relative">
          <div className="flex items-center justify-between mb-2">
            <Linkedin className="h-6 w-6 text-blue-500" />
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300">
                {`${count} companies`}
              </span>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the file.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(filename, 'linkedin')}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <div onClick={() => handleLinkedinFileClick(filename)} className="cursor-pointer">
            <h3 className="font-semibold text-white text-lg mb-1">{formatDisplayName(filename)}</h3>
            <p className="text-sm text-blue-300">LinkedIn List</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  const getFilteredFiles = (type) => {
    if (filter !== 'all' && filter !== type) {
      return [];
    }
  
    switch(type) {
      case 'maps':
        return companies.filter(company => !company.name.startsWith('result_'));
      case 'results':
        return companies.filter(company => company.name.startsWith('result_'));
      case 'linkedin':
        return linkedinData;  // linkedinData now contains objects with filename and count
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="p-8">
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-8">Lists to Prep</h1>
        <div className="mb-6 max-w-xs mx-auto">
          <Select onValueChange={setFilter} defaultValue="all">
            <SelectTrigger className="w-full bg-gray-800 text-white border-orange-500">
              <SelectValue placeholder="Filter data" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-orange-500">
              <SelectItem value="all">All Data</SelectItem>
              <SelectItem value="maps">Maps Files</SelectItem>
              <SelectItem value="results">Results Files</SelectItem>
              <SelectItem value="linkedin">LinkedIn Files</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-12">
          {/* Maps Section */}
          {(filter === 'all' || filter === 'maps') && (
            <div>
              <GroupHeader title="Maps" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {getFilteredFiles('maps').map(company => (
                  <CompanyCard 
                    key={company.name} 
                    company={company} 
                    type="map"
                  />
                ))}
              </div>
            </div>
          )}

          {(filter === 'all' || filter === 'linkedin') && (
            <div>
              <GroupHeader title="LinkedIn" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {getFilteredFiles('linkedin').map(item => (
                  <LinkedInDataCard 
                    key={item.filename} 
                    filename={item.filename}
                    count={item.count} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* Results Section */}
          {(filter === 'all' || filter === 'results') && (
            <div>
              <GroupHeader title="Results" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {getFilteredFiles('results').map(company => (
                  <CompanyCard 
                    key={company.name} 
                    company={company} 
                    type="result"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <FileMergeDialog 
        isOpen={showMergeDialog}
        onClose={() => setShowMergeDialog(false)}
        selectedFiles={draggedFiles}
        onMergeComplete={() => {
          setDraggedFiles([]);
          fetchData();
        }}
      />
    </div>
  );
};

export default Overview;