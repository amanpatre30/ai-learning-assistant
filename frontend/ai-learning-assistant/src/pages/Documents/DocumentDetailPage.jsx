import React, { useState, useEffect } from 'react'
import { useParams, Link } from "react-router-dom";
import documentService from "../../services/documentService"
import Spinner from "../../components/common/Spinner";
import toast from 'react-hot-toast';
import { ArrowLeft, ExternalLink } from 'lucide-react'

const DocumentDetailPage = () => {

  const { id } = useParams()
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Content')

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const data = await documentService.getDocumentById(id);
        setDocument(data);
      } catch (error) {
        toast.error('Failed to fetch document details');
        console.error(error);
      } finally {
        setLoading(false)
      }
    };

    fetchDocumentDetails();
  }, [id])

  //Helper function to get the full PDF URL

  const getPdfUrl = () => {
    if (!document?.data?.filePath) return null;

    const filePath = document.data.filePath;

    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }

    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    return `${baseUrl}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
  };

  const renderContent = () => {
    if (loading) {
      return <Spinner />
    }

    if (!document || !document.data || !document.data.filePath) {
      return <div className=''> PDF not available</div>;
    }


    const pdfUrl = getPdfUrl();

    return (
      <div className=''>
        <div className=''>
          <span className=''>Document Viewer</span>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className=''
          >
            <ExternalLink size={16} />
            Open in new tab
          </a>
        </div>
        <div className=''>
          <iframe
            src={pdfUrl}
            title="PDF Viewer"
            className=""
            frameborder="0"
            style={{ colorScheme: 'light' }}
          />
        </div>
      </div>
    );
  };
  return renderChat = () => {
    return "renderChat"
  };

  const renderAIActions = () => {
    return "renderAIActions"
  }

  const renderFlashcardsTab = () => {
    return "renderFlashcardsTab"
  }

  const renderQuizzesTab = () => {
    return "renderQuizzesTab"
  }

  const tabs = [
    { name: 'Content', label: 'Content', content: renderContent() },
    { name: 'Chat', label: 'Chat', content: renderChat() },
    { name: 'AI Actions', label: 'AI Actions', content: renderAIActions() },
    { name: 'Flashcards', label: 'Flashcards', content: renderFlashcardsTab() },
    { name: 'Quizzes', label: 'Quizzes', content: renderQuizzesTab() },
  ]

  if (loading) {
    return <Spinner />
  }

  if (!document) {
    return <div className=''>Document not found</div>
  }
  return (
    <div>DocumentDetailPage</div>
  )
}

export default DocumentDetailPage