'use client'

import { useState, useEffect } from 'react'
import ResumeEditor from '@/components/ResumeEditor'
import ResumePreview from '@/components/ResumePreview'

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

function useIsLargeScreen() {
  const [isLarge, setIsLarge] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : false
  );
  useEffect(() => {
    function handleResize() {
      setIsLarge(window.innerWidth >= 1024);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isLarge;
}

export default function Home() {
  const [resumeData, setResumeData] = useState<ResumeData>({
    name: '',
    email: '',
    phone: '',
    summary: '',
    experience: [],
    education: [],
    skills: []
  })
  const [activeTab, setActiveTab] = useState<'upload' | 'edit' | 'preview'>('upload')
  const isLargeScreen = useIsLargeScreen();

  // If on desktop and preview tab is active, switch to edit
  useEffect(() => {
    if (isLargeScreen && activeTab === 'preview') {
      setActiveTab('edit');
    }
  }, [isLargeScreen, activeTab]);

  if (isLargeScreen) {
    // Desktop: side-by-side layout
    return (
      <main className="flex flex-1">
        <section className="w-full p-8 overflow-y-auto lg:w-1/2">
          <h1 className="mb-8 text-4xl font-bold text-gray-900">
            Resume Editor
          </h1>
          <ResumeEditor
            resumeData={resumeData}
            setResumeData={setResumeData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </section>
        <section className="w-full p-8 overflow-y-auto bg-white shadow-lg lg:w-1/2">
          <ResumePreview resumeData={resumeData} />
        </section>
      </main>
    );
  }

  // Mobile: stacked layout, preview appears below tabs when selected
  return (
    <main className="flex flex-col flex-1">
      <section className="w-full p-8 overflow-y-auto">
        <h1 className="mb-8 text-4xl font-bold text-gray-900">
          Resume Editor
        </h1>
        <ResumeEditor
          resumeData={resumeData}
          setResumeData={setResumeData}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </section>
    </main>
  );
} 