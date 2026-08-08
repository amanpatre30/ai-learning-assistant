import React, { useState, useEffect } from "react";
import {
 Plus,
 ChevronLeft,
 ChevronRight,
 Trash2,
 ArrowLeft,
 Sparkles,
 Brain,
} from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";

import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";
import Spinner from "../common/Spinner";
import Modal from "../common/Modal";
import Flashcard from "./Flashcard";

const FlashcardManager = ({ documentId }) => {
 const [flashcardSets, setFlashcardSets] = useState([]);
 const [selectedSet, setSelectedSet] = useState(null);
 const [loading, setLoading] = useState(true);
 const [generating, setGenerating] = useState(false);
 const [currentCardIndex, setCurrentCardIndex] = useState(0);
 const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
 const [deleting, setDeleting] = useState(false);
 const [setToDelete, setSetToDelete] = useState(null);

 const fetchFlashcardSets = async () => {
  setLoading(true);

  try {
   const response =
    await flashcardService.getFlashcardsForDocument(documentId);

   setFlashcardSets(response.data);
  } catch (error) {
   toast.error("Failed to fetch flashcard sets.");
   console.error(error);
  } finally {
   setLoading(false);
  }
 };

 useEffect(() => {
  if (documentId) {
   fetchFlashcardSets();
  }
 }, [documentId]);

 const handleGenerateFlashcards = async () => {
  setGenerating(true);

  try {
   await aiService.generateFlashcards(documentId);
   toast.success("Flashcards generated successfully!");
   fetchFlashcardSets();
  } catch (error) {
   toast.error(error.message || "Failed to generate flashcards.");
  } finally {
   setGenerating(false);
  }
 };

 const handleNextCard = () => {
  if (selectedSet) {
   handleReview(currentCardIndex);

   setCurrentCardIndex(
    (prevIndex) =>
     (prevIndex + 1) % selectedSet.cards.length
   );
  }
 };

 const handlePrevCard = () => {
  if (selectedSet) {
   handleReview(currentCardIndex);

   setCurrentCardIndex(
    (prevIndex) =>
     (prevIndex - 1 + selectedSet.cards.length) %
     selectedSet.cards.length
   );
  }
 };

 const handleReview = async (index) => {
  const currentCard = selectedSet?.cards?.[index];

  if (!currentCard) return;

  try {
   await flashcardService.reviewFlashcard(
    currentCard._id,
    index
   );

   toast.success("Flashcard reviewed!");
  } catch (error) {
   toast.error("Failed to review flashcard.");
  }
 };

 const handleToggleStar = async () => { };

 const handleDeleteRequest = (e, set) => {
  e.stopPropagation();

  setSetToDelete(set);
  setIsDeleteModalOpen(true);
 };

 const handleConfirmDelete = async () => { };

 const handleSelectSet = (set) => {
  setSelectedSet(set);
  setCurrentCardIndex(0);
 };

 const renderFlashcardViewer = () => {
  return "renderFlashcardViewer";
 };

 const renderSetList = () => {
  if (loading) {
   return (
    <div className="flex items-center justify-center py-20">
     <Spinner />
    </div>
   );
  }

  return (
   <div className="flex flex-col items-center justify-center py-16 px-6">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 mb-6">
     <Brain
      className="w-8 h-8 text-emerald-600"
      strokeWidth={2}
     />
    </div>

    <h3 className="text-xl font-semibold text-slate-900 mb-2">
     No Flashcards Yet
    </h3>

    <p className="text-sm text-slate-500 mb-8 text-center max-w-sm">
     Generate flashcards from your document to start learning and
     reinforce your knowledge.
    </p>

    <button
     onClick={handleGenerateFlashcards}
     disabled={generating}
     className="group inline-flex items-center gap-2 px-6 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
    >
     {generating ? (
      <>
       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
       Generating...
      </>
     ) : (
      <>
       <Sparkles
        className="w-4 h-4"
        strokeWidth={2}
       />
       Generate Flashcards
      </>
     )}
    </button>
   </div>
  );
 };

 return (
  <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/50 p-8">
   {selectedSet ? renderFlashcardViewer() : renderSetList()}
  </div>
 );
};

export default FlashcardManager;