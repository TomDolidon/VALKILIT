package com.valkylit.service;

import com.valkylit.domain.Book;
import com.valkylit.domain.Client;
import com.valkylit.domain.PurchaseCommand;
import com.valkylit.domain.PurchaseCommandLine;
import com.valkylit.domain.Review;
import com.valkylit.domain.enumeration.PurchaseCommandStatus;
import com.valkylit.repository.BookRepository;
import com.valkylit.repository.PurchaseCommandLineRepository;
import com.valkylit.repository.PurchaseCommandRepository;
import com.valkylit.repository.ReviewRepository;
import com.valkylit.security.SecurityUtils;
import com.valkylit.service.dto.PurchaseCommandInvalidLineDTO;
import com.valkylit.service.dto.ReviewDTO;
import com.valkylit.web.rest.errors.BadRequestAlertException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.LockTimeoutException;
import jakarta.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.hibernate.PessimisticLockException;
import org.hibernate.dialect.lock.OptimisticEntityLockException;
import org.joda.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReviewService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    public Review createReview(Client client, UUID bookId, ReviewDTO reviewDTO) {
        // Récupérer le livre par son ID
        Book book = bookRepository
            .findById(bookId)
            .orElseThrow(() -> new BadRequestAlertException("Book not found", "book", "bookNotFound"));

        // Créer une nouvelle review
        Review review = new Review();
        review.setClient(client);
        review.setBook(book);
        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());

        // Sauvegarder la review
        return reviewRepository.save(review);
    }

    public List<Review> getReviewForBookAndClient(UUID bookId, UUID clientId) {
        return reviewRepository.findByBookIdAndClientId(bookId, clientId);
    }
}
