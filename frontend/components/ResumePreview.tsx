import React from 'react';

interface ResumeData {
  name: string;
  email: string;
  phone: string;
  summary: string;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    year: string;
  }>;
  skills: string[];
}

export default function ResumePreview({ resumeData }: { resumeData: ResumeData }) {
  return (
    <div className="max-w-2xl p-8 mx-auto text-gray-900 bg-white border border-gray-200 rounded-lg shadow-md">
      {/* Header */}
      <div className="pb-4 mb-6 border-b">
        <h1 className="text-3xl font-bold text-primary-700">{resumeData.name || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
          {resumeData.email && <span>{resumeData.email}</span>}
          {resumeData.phone && <span>{resumeData.phone}</span>}
        </div>
      </div>

      {/* Summary */}
      {resumeData.summary && (
        <div className="mb-6">
          <h2 className="mb-1 text-lg font-semibold text-primary-600">Professional Summary</h2>
          <p className="text-gray-800 whitespace-pre-line">{resumeData.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resumeData.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-1 text-lg font-semibold text-primary-600">Experience</h2>
          <ul className="space-y-4">
            {resumeData.experience.map(exp => (
              <li key={exp.id} className="">
                <div className="flex items-center justify-between">
                  <span className="font-bold">{exp.position || 'Job Title'}</span>
                  <span className="text-sm text-gray-500">{exp.duration}</span>
                </div>
                <div className="text-sm text-gray-700">{exp.company}</div>
                <div className="mt-1 text-gray-800 whitespace-pre-line">{exp.description}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-1 text-lg font-semibold text-primary-600">Education</h2>
          <ul className="space-y-2">
            {resumeData.education.map(edu => (
              <li key={edu.id}>
                <div className="flex items-center justify-between">
                  <span className="font-bold">{edu.degree || 'Degree'}</span>
                  <span className="text-sm text-gray-500">{edu.year}</span>
                </div>
                <div className="text-sm text-gray-700">{edu.institution}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <div>
          <h2 className="mb-1 text-lg font-semibold text-primary-600">Skills</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {resumeData.skills.filter(Boolean).map((skill, idx) => (
              <span key={idx} className="px-3 py-1 text-sm border rounded-full bg-primary-50 text-primary-700 border-primary-100">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 