import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Mail, Loader2, Send, ChevronDown, ChevronUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Navbar from '../components/Navbar';

function EmailOverview() {
  const [emails, setEmails] = useState([]);
  const [threadMessages, setThreadMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState({});
  const [error, setError] = useState(null);
  const [replyEmail, setReplyEmail] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const { toast } = useToast();
  const [expandedThreads, setExpandedThreads] = useState(new Set());

  const fetchEmails = async () => {
    try {
        setLoading(true);
        console.log("Starting email fetch process...");

        // Step 1: Receive and process new emails
        console.log("Fetching new emails...");
        const receiveResponse = await axios.get('/api/email/receive', {
            params: { size: 10 } // Adjust size as needed
        });
        console.log("Receive response:", receiveResponse.data);

        // Step 2: Fetch all stored emails
        console.log("Fetching stored emails...");
        const storedResponse = await axios.get('/api/email/stored');
        console.log("Stored emails response:", storedResponse.data);
        
        if (!storedResponse.data || storedResponse.data.length === 0) {
            console.log("No emails found in response");
            setError('No replies found. Please check back later.');
            setEmails([]);
            return;
        }

        // Sort emails by creation date
        const sortedEmails = storedResponse.data.sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
        });

        console.log("Sorted emails:", sortedEmails);
        setEmails(sortedEmails);
        setError(null);
    } catch (err) {
        console.error('Error fetching emails:', err);
        setError('Failed to fetch emails');
        setEmails([]);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
    const interval = setInterval(fetchEmails, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchThreadDetails = useCallback(async (baseIndex) => {
    if (!baseIndex) {
      console.log("No base index provided, skipping thread fetch");
      return;
    }

    try {
      const timestamp = Date.now();
      const response = await fetch(
        `${API_BASE_URL}/api/email/thread/db/${baseIndex}?_t=${timestamp}`,
        {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'If-Modified-Since': '',
            'If-None-Match': '',
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setThreadMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Error fetching thread details:", error);
    }
  }, []);

  const handleThreadToggle = (threadId, isExpanded) => {
    if (isExpanded) {
      setExpandedThreads(prev => new Set([...prev, threadId]));
      fetchThreadDetails(threadId);
    } else {
      setExpandedThreads(prev => {
        const newSet = new Set(prev);
        newSet.delete(threadId);
        return newSet;
      });
    }
  };
  const handleSendReply = async () => {
    if (!replyEmail || !replyContent) return;
    console.log(replyEmail)
    try {
      setSendingReply(true);
      const response = await axios.post('/api/email/reply', {
        sender: replyEmail.recipient, // Replace with actual sender email
        receiver: replyEmail.sender,
        original_email_id: replyEmail.email_id,
        convo_id: replyEmail.convo_id,
        reply: {
          subject: `${replyEmail.subject}`,
          body: replyContent
        },
        time_zone: "Europe/Amsterdam"
      });

      toast({
        title: "Success",
        description: "Reply sent successfully",
      });
      
      // Refresh emails after sending reply
      await fetchEmails();
      setReplyContent("");
      setReplyEmail(null);
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive",
      });
    } finally {
      setSendingReply(false);
    }
  };

  const getInterestLevelStyle = (level) => {
    switch (level?.toLowerCase()) {
      case 'high':
        return 'bg-green-500/20 text-green-300';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'low':
        return 'bg-orange-500/20 text-orange-300';
      case 'not_interested':
      case 'rude':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getEmailList = (emailList) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      );
    }
    
    if (!emailList.length) {
      return (
        <Card className="bg-gray-800 border-2 border-gray-600">
          <CardContent className="p-8 text-center text-gray-400">
            <Mail className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            No replies found in this category
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid gap-4">
        {emailList.map((thread, index) => (
          <Collapsible 
            key={index}
            onOpenChange={(isOpen) => handleThreadToggle(thread.thread_id, isOpen)}
          >
            <Card className={`bg-gray-800 border-2 transition-colors ${
              getInterestLevelStyle(thread.level_of_interest)
            }`}>
              {/* Collapsed View - Summary */}
              <CollapsibleTrigger className="w-full">
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        {thread.messages[0]?.subject || 'No Subject'}
                      </CardTitle>
                      <div className="text-sm text-gray-400">
                        Between: {' '}
                        {Array.from(new Set(thread.messages.map(msg => msg.sender)))
                          .slice(0, 2)
                          .join(' & ')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {expandedThreads.has(thread.thread_id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>

              {/* Expanded View - Messages and Reply */}
              <CollapsibleContent>
                <CardContent className="p-4 pt-0">
                  {/* Message Bodies */}
                  <div className="space-y-4 mb-4">
                    {thread.messages.map((message, msgIndex) => (
                      <div 
                        key={msgIndex}
                        className={`p-3 rounded-lg ${
                          message.isOutbound 
                            ? 'bg-orange-500/10 ml-4' 
                            : 'bg-gray-700/50 mr-4'
                        }`}
                      >
                        {message.body}
                      </div>
                    ))}
                  </div>

                  {/* Reply Button */}
                  <div className="flex justify-end mt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="flex items-center gap-2"
                          onClick={() => {
                            // Get the last message in the thread
                            const lastMessage = thread.messages[thread.messages.length - 1];
                            setReplyEmail({
                              ...lastMessage,
                              thread_id: thread.thread_id,
                              // Include all previous messages for context
                              previous_messages: thread.messages
                            });
                          }}
                        >
                          <Send className="h-4 w-4" />
                          Reply
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reply to Email</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea
                            placeholder="Type your reply..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="min-h-[200px]"
                          />
                          <div className="flex justify-end">
                            <Button 
                              onClick={handleSendReply}
                              disabled={sendingReply}
                              className="flex items-center gap-2"
                            >
                              {sendingReply ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Send className="h-4 w-4" />
                              )}
                              Send Reply
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-3xl font-bold text-orange-500 mb-4">Email Overview</h1>
            <Button 
              onClick={fetchEmails} 
              disabled={loading}
              variant="outline"
              className="bg-gray-800 text-white border-orange-500 hover:bg-orange-500/10 hover:text-orange-500"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-500"
              >
                All Replies ({emails.length})
              </TabsTrigger>
              <TabsTrigger
                value="high"
                className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-500"
              >
                High Priority ({emails.filter(e => e.level_of_interest?.toLowerCase() === 'high').length})
              </TabsTrigger>
              <TabsTrigger
                value="medium"
                className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-500"
              >
                Medium Priority ({
                  emails.filter(e => 
                    e.level_of_interest?.toLowerCase() === 'medium' || 
                    !['high', 'low', 'rude'].includes(e.level_of_interest?.toLowerCase())
                  ).length
                })
              </TabsTrigger>
              <TabsTrigger
                value="low"
                className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-500"
              >
                Low Priority ({
                  emails.filter(e => 
                    ['low', 'rude'].includes(e.level_of_interest?.toLowerCase())
                  ).length
                })
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {getEmailList(emails)}
            </TabsContent>
            <TabsContent value="high">
              {getEmailList(emails.filter(e => e.level_of_interest?.toLowerCase() === 'high'))}
            </TabsContent>
            <TabsContent value="medium">
              {getEmailList(emails.filter(e => 
                e.level_of_interest?.toLowerCase() === 'medium' || 
                !['high', 'low', 'rude'].includes(e.level_of_interest?.toLowerCase())
              ))}
            </TabsContent>
            <TabsContent value="low">
              {getEmailList(emails.filter(e => 
                ['low', 'rude'].includes(e.level_of_interest?.toLowerCase())
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default EmailOverview;

