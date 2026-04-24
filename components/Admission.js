'use client'

import { useEffect, useState } from 'react'
import { getAllAdmissions } from '@/lib/api'
import { FaCheckCircle } from 'react-icons/fa'

export default function Admission() {
  const [admission, setAdmission] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdmission = async () => {
      try {
        const response = await getAllAdmissions()
        setAdmission(response.data?.[0])
      } catch (error) {
        console.error('Error fetching admission:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAdmission()
  }, [])

  if (loading) {
    return (
      <section id="admissions" className="section-padding bg-gray-50">
        <div className="section-container text-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </section>
    )
  }

  return (
    <section id="admissions" className="section-padding bg-gray-50">
      <div className="section-container">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            {admission?.title || 'Admission Process'}
          </h2>
          <p className="text-base text-gray-600 max-w-xl mx-auto mb-2">
            {admission?.description}
          </p>
          <div className="w-16 h-0.5 bg-primary-600 mx-auto rounded-full" />
        </div>

        {/* Steps */}
        {admission?.steps && admission.steps.length > 0 && (
          <div className="max-w-3xl mx-auto mb-4">
            <div className="relative">
              {/* Timeline line - hidden on mobile */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary-200 -translate-x-1/2" />

              <div className="space-y-2 md:space-y-3">
                {admission.steps.map((step, index) => (
                  <div
                    key={index}
                    className={`relative flex flex-col md:flex-row items-center gap-6 ${
                      index % 2 === 0 ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Card */}
                    <div className="w-full md:w-5/12 animate-slide-up">
                      <div className="card p-2 hover:scale-105 transition-transform duration-300">
                        <div className="flex items-start gap-2">
                          <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-lg">
                            {step.stepNumber}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900 mb-0.5">
                              {step.title}
                            </h3>
                            <p className="text-gray-600 text-xs leading-relaxed">{step.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Center dot */}
                    <div className="hidden md:block w-2/12 flex-shrink-0">
                      <div className="relative flex items-center justify-center">
                        <div className="w-3 h-3 bg-primary-600 rounded-full border-2 border-white shadow-md" />
                      </div>
                    </div>

                    {/* Spacer */}
                    <div className="hidden md:block w-5/12" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Requirements */}
        {admission?.requirements && admission.requirements.length > 0 && (
          <div className="max-w-2xl mx-auto">
            <div className="card p-3">
              <h3 className="text-base font-bold text-gray-900 mb-2 text-center">
                Required Documents
              </h3>
              <div className="grid sm:grid-cols-2 gap-1.5">
                {admission.requirements.map((req, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1.5 bg-gray-50 p-2 rounded text-xs hover:bg-primary-50 transition-colors"
                  >
                    <FaCheckCircle className="text-primary-600 flex-shrink-0 text-xs" />
                    <span className="text-gray-700">{req}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
