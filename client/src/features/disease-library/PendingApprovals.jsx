import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import api from '../../services/api'

const PendingApprovals = ({ onApprovalChange }) => {
    const [pending, setPending] = useState([])
    const [loading, setLoading] = useState(true)
    const [expandedId, setExpandedId] = useState(null)
    const [reviewNote, setReviewNote] = useState({})
    const [processing, setProcessing] = useState(null)

    useEffect(() => {
        fetchPending()
    }, [])

    const fetchPending = async () => {
        try {
            const res = await api.get('/diseases/pending')
            setPending(res.data)
        } catch (err) {
            console.error('Failed to fetch pending:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleReview = async (id, status) => {
        setProcessing(id)
        try {
            await api.patch(`/diseases/${id}/review`, {
                status,
                review_note: reviewNote[id] || ''
            })
            setPending(prev => prev.filter(d => d.id !== id))
            onApprovalChange?.() 
        } catch (err) {
            alert('Failed to process review. Please try again.')
        } finally {
            setProcessing(null)
        }
    }

    if (loading) return null

    if (pending.length === 0) return null

    return (
        <div className="mb-6 border border-amber-200 rounded-lg overflow-hidden">

            {/* Header */}
            <div className="bg-amber-50 px-4 py-3 flex items-center gap-2 border-b border-amber-200">
                <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <h2 className="font-semibold text-amber-800 text-sm sm:text-base">
                    Pending Approvals
                </h2>
                <span className="ml-auto bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {pending.length}
                </span>
            </div>

            {/* Pending list */}
            <div className="divide-y divide-amber-100 bg-white">
                {pending.map(disease => (
                    <div key={disease.id} className="p-4">

                        {/* Summary row */}
                        <div
                            className="flex items-center justify-between cursor-pointer gap-3"
                            onClick={() => setExpandedId(prev => prev === disease.id ? null : disease.id)}
                        >
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-medium text-gray-800 text-sm">{disease.name}</span>
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                                        {disease.species}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    Submitted by: {disease.submitted_by_email || 'Unknown'} ·{' '}
                                    {new Date(disease.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            {expandedId === disease.id
                                ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            }
                        </div>

                        {/* Expanded details*/}
                        {expandedId === disease.id && (
                            <div className="mt-4 space-y-3">

                                {/* Disease details */}
                                <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Symptoms</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {disease.symptoms?.map(s => (
                                                <span key={s} className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs capitalize">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Prevention</p>
                                            <p className="text-gray-700">{disease.prevention}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Treatment</p>
                                            <p className="text-gray-700">{disease.treatment}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Review note */}
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                                        Review Note (optional)
                                    </label>
                                    <textarea
                                        value={reviewNote[disease.id] || ''}
                                        onChange={(e) => setReviewNote(prev => ({ ...prev, [disease.id]: e.target.value }))}
                                        placeholder="Add a note for the submitter..."
                                        rows={2}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                                    />
                                </div>

                                {/* Approve / Reject buttons */}
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <button
                                        onClick={() => handleReview(disease.id, 'approved')}
                                        disabled={processing === disease.id}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReview(disease.id, 'rejected')}
                                        disabled={processing === disease.id}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PendingApprovals