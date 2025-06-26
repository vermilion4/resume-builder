'use client'

import { useState } from 'react'

interface ResumeData {
  name: string
  email: string
  phone: string
  summary: string
  experience: Array<{
    id: string
    company: string
    position: string
    duration: string
    description: string
  }>
  education: Array<{
    id: string
    institution: string
    degree: string
    year: string
  }>
  skills: string[]
}

interface ResumeFormProps {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
}

export default function ResumeForm({ resumeData, setResumeData }: ResumeFormProps) {
  const [enhancing, setEnhancing] = useState<string | null>(null)

  const handleEnhance = async (section: string, content: string, id?: string, index?: number) => {
    setEnhancing(section)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/ai-enhance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ section, content }),
      })
      
      if (response.ok) {
        const result = await response.json()
        
        // Update the appropriate section based on the type
        if (section === 'summary') {
          setResumeData({ ...resumeData, summary: result.enhanced_content })
        } else if (section === 'experience' && id) {
          setResumeData({
            ...resumeData,
            experience: resumeData.experience.map(exp =>
              exp.id === id ? { ...exp, description: result.enhanced_content } : exp
            )
          })
        }
        alert('Section enhanced successfully!')
      } else {
        alert('Failed to enhance section')
      }
    } catch (error) {
      console.error('Error enhancing section:', error)
      alert('Error enhancing section')
    } finally {
      setEnhancing(null)
    }
  }

  const addExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      duration: '',
      description: ''
    }
    setResumeData({
      ...resumeData,
      experience: [...resumeData.experience, newExperience]
    })
  }

  const removeExperience = (id: string) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter(exp => exp.id !== id)
    })
  }

  const updateExperience = (id: string, field: string, value: string) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    })
  }

  const addEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      year: ''
    }
    setResumeData({
      ...resumeData,
      education: [...resumeData.education, newEducation]
    })
  }

  const removeEducation = (id: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter(edu => edu.id !== id)
    })
  }

  const updateEducation = (id: string, field: string, value: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    })
  }

  const addSkill = () => {
    setResumeData({
      ...resumeData,
      skills: [...resumeData.skills, '']
    })
  }

  const removeSkill = (index: number) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter((_, i) => i !== index)
    })
  }

  const updateSkill = (index: number, value: string) => {
    const newSkills = [...resumeData.skills]
    newSkills[index] = value
    setResumeData({
      ...resumeData,
      skills: newSkills
    })
  }

  return (
    <div className="space-y-8">
      <h2 className="mb-4 text-2xl font-semibold">Edit Resume</h2>
      
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium sm:text-xl">Personal Information</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={resumeData.name}
              onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={resumeData.email}
              onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              value={resumeData.phone}
              onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium sm:text-xl">Professional Summary</h3>
          <button
            onClick={() => handleEnhance('summary', resumeData.summary)}
            disabled={enhancing === 'summary'}
            className="px-4 py-2 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {enhancing === 'summary' ? 'Enhancing...' : 'Enhance with AI'}
          </button>
        </div>
        <textarea
          value={resumeData.summary}
          onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write a compelling professional summary..."
        />
      </div>

      {/* Experience */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium sm:text-xl">Work Experience</h3>
          <button
            onClick={addExperience}
            className="px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
          >
            Add Experience
          </button>
        </div>
        {resumeData.experience.map((exp, index) => (
          <div key={exp.id} className="p-4 space-y-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Experience {index + 1}</h4>
              <button
                onClick={() => removeExperience(exp.id)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Company
                </label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Position
                </label>
                <input
                  type="text"
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Duration
                </label>
                <input
                  type="text"
                  value={exp.duration}
                  onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 2020 - Present"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="flex justify-end gap-2 mb-2">
                <button
                  onClick={() => handleEnhance('experience', exp.description, exp.id)}
                  disabled={enhancing === `experience_${exp.id}`}
                  className="px-3 py-1 text-sm text-white transition-colors bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50"
                >
                  {enhancing === `experience_${exp.id}` ? 'Enhancing...' : 'Enhance with AI'}
                </button>
              </div>
              <textarea
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium sm:text-xl">Education</h3>
          <button
            onClick={addEducation}
            className="px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
          >
            Add Education
          </button>
        </div>
        {resumeData.education.map((edu, index) => (
          <div key={edu.id} className="p-4 space-y-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Education {index + 1}</h4>
              <button
                onClick={() => removeEducation(edu.id)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Institution
                </label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Degree
                </label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Year
                </label>
                <input
                  type="text"
                  value={edu.year}
                  onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 2020"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium sm:text-xl">Skills</h3>
          <button
            onClick={addSkill}
            className="px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
          >
            Add Skill
          </button>
        </div>
        <div className="space-y-2">
          {resumeData.skills.map((skill, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex flex-1 gap-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => updateSkill(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter a skill"
                />
              </div>
              <button
                onClick={() => removeSkill(index)}
                className="px-3 py-2 text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 