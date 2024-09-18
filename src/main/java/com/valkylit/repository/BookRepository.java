package com.valkylit.repository;

import com.valkylit.domain.Book;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Book entity.
 *
 * When extending this class, extend BookRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface BookRepository extends BookRepositoryWithBagRelationships, JpaRepository<Book, UUID>, JpaSpecificationExecutor<Book> {
    default Optional<Book> findOneWithEagerRelationships(UUID id) {
        return this.fetchBagRelationships(this.findOneWithToOneRelationships(id));
    }

    default List<Book> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships());
    }

    default Page<Book> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships(pageable));
    }

    default Page<Book> findAllWithEagerRelationships(Specification<Book> spec, Pageable pageable) {
        return findAll(spec, pageable);
    }

    @Query(value = "select book from Book book left join fetch book.publisher", countQuery = "select count(book) from Book book")
    Page<Book> findAllWithToOneRelationships(Pageable pageable);

    @Query("select book from Book book left join fetch book.publisher")
    List<Book> findAllWithToOneRelationships();

    @Query("select book from Book book left join fetch book.publisher where book.id =:id")
    Optional<Book> findOneWithToOneRelationships(@Param("id") UUID id);

    @Query("SELECT b, AVG(r.rating) as avgRating " + "FROM Book b JOIN b.reviews r " + "GROUP BY b " + "ORDER BY avgRating DESC")
    List<Object[]> findTopBooksByAverageRating(Pageable pageable);
}
