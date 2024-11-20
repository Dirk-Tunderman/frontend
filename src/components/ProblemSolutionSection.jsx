import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SubsectionCard = ({ subsection }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-4 p-4 bg-gray-900 rounded-lg">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h4 className="font-semibold text-white">{subsection.title}</h4>
        {isExpanded ? 
          <ChevronUp className="h-5 w-5 text-orange-500" /> : 
          <ChevronDown className="h-5 w-5 text-orange-500" />
        }
      </div>
      
      {isExpanded && (
        <div className="mt-4 space-y-4">
          {subsection.challenge_description && (
            <p className="text-sm text-gray-300">{subsection.challenge_description}</p>
          )}
          {subsection.solution_description && (
            <p className="text-sm text-gray-300">{subsection.solution_description}</p>
          )}
          
          {/* Key Features Section */}
          {subsection.key_features && subsection.key_features.length > 0 && (
            <div className="mt-4">
              <h5 className="text-sm font-medium text-orange-500 mb-2">Key Features:</h5>
              <ul className="list-disc list-inside text-sm text-gray-300">
                {subsection.key_features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Expected Benefits Section */}
          {subsection.expected_benefits && subsection.expected_benefits.length > 0 && (
            <div className="mt-4">
              <h5 className="text-sm font-medium text-orange-500 mb-2">Expected Benefits:</h5>
              <ul className="list-disc list-inside text-sm text-gray-300">
                {subsection.expected_benefits.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Implementation Steps Section */}
          {subsection.implementation_steps && subsection.implementation_steps.length > 0 && (
            <div className="mt-4">
              <h5 className="text-sm font-medium text-orange-500 mb-2">Implementation Steps:</h5>
              <ul className="list-disc list-inside text-sm text-gray-300">
                {subsection.implementation_steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Supporting Evidence Section */}
          {subsection.supporting_evidence && (
            <div className="mt-4 border-t border-gray-800 pt-4">
              <h5 className="text-sm font-medium text-orange-500 mb-2">Supporting Evidence:</h5>
              {subsection.supporting_evidence.direct_quotes?.length > 0 && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-gray-400">Direct Quotes:</span>
                  <ul className="list-disc list-inside text-xs text-gray-300 italic ml-4">
                    {subsection.supporting_evidence.direct_quotes.map((quote, idx) => (
                      <li key={idx}>{quote}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SectionCard = ({ section }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="bg-gray-800 border-orange-500 mb-4">
      <CardHeader 
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl text-orange-500">{section.title}</CardTitle>
          {isExpanded ? 
            <ChevronUp className="h-6 w-6 text-orange-500" /> : 
            <ChevronDown className="h-6 w-6 text-orange-500" />
          }
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="space-y-4">
            {section.subsections.map((subsection, index) => (
              <SubsectionCard key={index} subsection={subsection} />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

const ProblemSolutionSection = ({ problemSolution }) => {
  if (!problemSolution || !problemSolution[0] || !problemSolution[0].sections) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-orange-500">Problem Analysis & Solutions</h2>
      <div className="space-y-4">
        {problemSolution[0].sections.map((section, index) => (
          <SectionCard key={index} section={section} />
        ))}
      </div>
    </div>
  );
};

export default ProblemSolutionSection;