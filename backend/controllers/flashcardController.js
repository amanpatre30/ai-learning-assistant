import mongoose from "mongoose";
import Flashcard from "../models/Flashcard.js";

/**
 * @desc Get flashcards for a document or a single flashcard set by ID
 * @route GET /api/flashcards/:id
 * @access Private
 */
export const getFlashcards = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid flashcard or document ID",
        statusCode: 400,
      });
    }

    const flashcardSet = await Flashcard.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("documentId", "title fileName");

    if (flashcardSet) {
      return res.status(200).json({
        success: true,
        data: flashcardSet,
      });
    }

    const flashcards = await Flashcard.find({
      userId: req.user._id,
      documentId: req.params.id,
    })
      .populate("documentId", "title fileName")
      .sort({ createdAt: -1 });

    if (!flashcards.length) {
      return res.status(404).json({
        success: false,
        error: "Flashcard set or document not found",
        statusCode: 404,
      });
    }

    res.status(200).json({
      success: true,
      count: flashcards.length,
      data: flashcards,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get all flashcard sets for a user
 * @route GET /api/flashcards
 * @access Private
 */
export const getAllFlashcardSets = async (req, res, next) => {
  try {
    const flashcardSets = await Flashcard.find({
      userId: req.user._id,
    })
      .populate("documentId", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: flashcardSets.length,
      data: flashcardSets,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Mark flashcard as reviewed
 * @route POST /api/flashcards/:cardId/review
 * @access Private
 */
export const reviewFlashcard = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid card ID",
        statusCode: 400,
      });
    }

    const flashcardSet = await Flashcard.findOne({
      "cards._id": req.params.cardId,
      userId: req.user._id,
    });

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        error: "Flashcard set or card not found",
        statusCode: 404,
      });
    }

    const card = flashcardSet.cards.id(req.params.cardId);

    if (!card) {
      return res.status(404).json({
        success: false,
        error: "Card not found",
        statusCode: 404,
      });
    }

    // Update review information
    card.lastReviewed = new Date();
    card.reviewCount += 1;

    await flashcardSet.save();

    res.status(200).json({
      success: true,
      data: flashcardSet,
      message: "Flashcard reviewed successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Toggle star/favorite on flashcard
 * @route PUT /api/flashcards/:cardId/star
 * @access Private
 */
export const toggleStarFlashcard = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid card ID",
        statusCode: 400,
      });
    }

    const flashcardSet = await Flashcard.findOne({
      "cards._id": req.params.cardId,
      userId: req.user._id,
    });

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        error: "Flashcard set or card not found",
        statusCode: 404,
      });
    }

    const card = flashcardSet.cards.id(req.params.cardId);

    if (!card) {
      return res.status(404).json({
        success: false,
        error: "Card not found",
        statusCode: 404,
      });
    }

    // Toggle star
    card.isStarred = !card.isStarred;

    await flashcardSet.save();

    res.status(200).json({
      success: true,
      data: flashcardSet,
      message: `Flashcard ${card.isStarred ? "starred" : "unstarred"} successfully`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete flashcard set
 * @route DELETE /api/flashcards/:id
 * @access Private
 */
export const deleteFlashcardSet = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid flashcard set ID",
        statusCode: 400,
      });
    }

    const flashcardSet = await Flashcard.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        error: "Flashcard set not found",
        statusCode: 404,
      });
    }

    await flashcardSet.deleteOne();

    res.status(200).json({
      success: true,
      message: "Flashcard set deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
