'use client'

import FileUpload from './FileUpload'
import ResumeForm from './ResumeForm'
import ResumePreview from './ResumePreview'

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

const TABS = [
  { key: 'upload', label: 'Upload', icon: '📤' },
  { key: 'edit', label: 'Edit', icon: '✏️' },
  { key: 'preview', label: 'Preview', icon: '👁️' },
]

interface ResumeEditorProps {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
  activeTab: 'upload' | 'edit' | 'preview'
  setActiveTab: (tab: 'upload' | 'edit' | 'preview') => void
}

export default function ResumeEditor({ resumeData, setResumeData, activeTab, setActiveTab }: ResumeEditorProps) {
  const handleFileUpload = (file: File) => {
    // Simulate realistic parsed data
    const mockParsedData = {
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "(555) 123-4567",
      summary: "Software developer with 2 years of experience in web development using React and Node.js. I have worked on delivering applications and helped with development teams.",
      experience: [
        {
          id: "exp_0",
          company: "Tech Solutions Inc.",
          position: "Senior Software Developer",
          duration: "2021-2023",
          description: "Led development of multiple web applications using React and Node.js. Improved application performance by 40% and mentored junior developers."
        },
        {
          id: "exp_1", 
          company: "Digital Innovations",
          position: "Full Stack Developer",
          duration: "2019-2021",
          description: "Developed and maintained e-commerce platforms. Collaborated with cross-functional teams to deliver features on time and within budget."
        }
      ],
      education: [
        {
          id: "edu_0",
          institution: "University of Technology",
          degree: "Bachelor of Science in Computer Science",
          year: "2019"
        }
      ],
      skills: ["JavaScript", "React", "Node.js", "Python", "SQL", "Git", "AWS", "Docker"]
    }
    
    // Update the resume data with mock parsed information
    setResumeData(mockParsedData)
    
    alert(`Resume "${file.name}" uploaded and parsed successfully! Please review and edit the extracted information.`)
    setActiveTab('edit') // Move to edit
  }

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:8000/save-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData),
      })
      
      if (response.ok) {
        alert('Resume saved successfully!')
      } else {
        alert('Failed to save resume')
      }
    } catch (error) {
      console.error('Error saving resume:', error)
      alert('Error saving resume')
    }
  }

  const handleDownload = () => {
    const dataStr = JSON.stringify(resumeData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'resume.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
  const desktopTabs = TABS.slice(0, 2); // Upload, Edit

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tab Navigation: always on mobile, only Upload/Edit on desktop */}
      <div className="flex mb-6 border-b border-gray-200 lg:hidden">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'upload' | 'edit' | 'preview')}
            className={`flex items-center gap-2 px-4 py-2 text-base font-medium border-b-2 transition-colors focus:outline-none flex-1
              ${activeTab === tab.key ? 'border-primary-600 text-primary-700 bg-primary-50' : 'border-transparent text-gray-500 hover:text-primary-700 hover:bg-primary-50'}`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="hidden mb-6 border-b border-gray-200 lg:flex">
        {desktopTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'upload' | 'edit' | 'preview')}
            className={`flex items-center gap-2 px-6 py-3 text-lg font-medium border-b-2 transition-colors focus:outline-none
              ${activeTab === tab.key ? 'border-primary-600 text-primary-700 bg-primary-50' : 'border-transparent text-gray-500 hover:text-primary-700 hover:bg-primary-50'}`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content: mobile shows only selected, desktop always shows editor */}
      <div className={`${activeTab !== 'preview' && 'p-6 rounded-lg shadow-lg'} mb-6 bg-white `}>
        {/* Mobile: show only selected tab, including preview */}
        <div className="lg:hidden">
          {activeTab === 'upload' && (
            <div>
              <h2 className="mb-4 text-xl font-semibold md:text-2xl">Upload Resume</h2>
              <FileUpload onFileUpload={handleFileUpload} />
            </div>
          )}
          {activeTab === 'edit' && (
            <ResumeForm 
              resumeData={resumeData} 
              setResumeData={setResumeData} 
            />
          )}
          {activeTab === 'preview' && (
            <ResumePreview resumeData={resumeData} />
          )}
        </div>
        {/* Desktop: always show editor, never show preview here */}
        <div className="hidden lg:block">
          {activeTab === 'upload' && (
            <div>
              <h2 className="mb-4 text-xl font-semibold md:text-2xl">Upload Resume</h2>
              <FileUpload onFileUpload={handleFileUpload} />
            </div>
          )}
          {activeTab === 'edit' && (
            <ResumeForm 
              resumeData={resumeData} 
              setResumeData={setResumeData} 
            />
          )}
        </div>
      </div>

      {/* Save/Download Buttons (show on Edit tab on mobile, always on desktop except upload) */}
      {((activeTab === 'edit' && isMobile) || (!isMobile && activeTab !== 'upload')) && (
        <div className="flex justify-center gap-4">
          <button
            onClick={handleSave}
            className="px-6 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Save Resume
          </button>
          <button
            onClick={handleDownload}
            className="px-6 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
          >
            Download JSON
          </button>
        </div>
      )}
    </div>
  )
} 