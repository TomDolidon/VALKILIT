package com.valkylit.service;

import com.valkylit.domain.Book;
import com.valkylit.domain.Client;
import com.valkylit.domain.Review;
import com.valkylit.repository.BookRepository;
import com.valkylit.repository.ReviewRepository;
import com.valkylit.service.dto.ReviewDTO;
import com.valkylit.web.rest.errors.BadRequestAlertException;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReviewService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    public Review createReview(Client client, UUID bookId, ReviewDTO reviewDTO) throws Exception {
        // Récupérer le livre par son ID
        Book book = bookRepository.findById(bookId).orElseThrow(() -> new Exception("Book not found"));

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
