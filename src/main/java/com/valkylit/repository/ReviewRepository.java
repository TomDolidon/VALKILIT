package com.valkylit.repository;

import com.valkylit.domain.Review;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Review entity.
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {
    @Query("SELECT r FROM Review r WHERE r.book.id = :bookId")
    List<Review> findByBookId(@Param("bookId") UUID bookId);

    @Query("SELECT r FROM Review r WHERE r.book.id = :bookId AND r.client.id = :clientId")
    List<Review> findByBookIdAndClientId(@Param("bookId") UUID bookId, @Param("clientId") UUID clientId);
}
