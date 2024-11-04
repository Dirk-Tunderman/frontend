// src/components/FileMergeDialog.jsx
import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import axios from 'axios';

const FileMergeDialog = ({ isOpen, onClose, selectedFiles, onMergeComplete }) => {
  const [newFileName, setNewFileName] = useState('');

  const handleMerge = async () => {
    if (!newFileName) {
      toast.error("Please enter a filename for the merged file");
      return;
    }
  
    try {
      const response = await axios.post('/api/merge-files', {
        files: selectedFiles,
        newFileName: newFileName.endsWith('.json') ? newFileName : `${newFileName}.json`
      });
  
      toast.success(`Files merged successfully in ${response.data.directory} directory!`);
      onMergeComplete();
      onClose();
    } catch (error) {
      console.error("Error merging files:", error);
      toast.error(error.response?.data?.error || "Failed to merge files");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Merge Files</AlertDialogTitle>
          <AlertDialogDescription>
            Merging the following files:
            <ul className="mt-2 list-disc list-inside">
              {selectedFiles.map(file => (
                <li key={file} className="text-sm">{file}</li>
              ))}
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4">
          <Input
            placeholder="Enter new filename"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleMerge}>Merge Files</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FileMergeDialog;