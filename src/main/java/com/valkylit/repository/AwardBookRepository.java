package com.valkylit.repository;

import com.valkylit.domain.AwardBook;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the AwardBook entity.
 */
@Repository
public interface AwardBookRepository extends JpaRepository<AwardBook, Long> {
    default Optional<AwardBook> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<AwardBook> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<AwardBook> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select awardBook from AwardBook awardBook left join fetch awardBook.book left join fetch awardBook.award",
        countQuery = "select count(awardBook) from AwardBook awardBook"
    )
    Page<AwardBook> findAllWithToOneRelationships(Pageable pageable);

    @Query("select awardBook from AwardBook awardBook left join fetch awardBook.book left join fetch awardBook.award")
    List<AwardBook> findAllWithToOneRelationships();

    @Query(
        "select awardBook from AwardBook awardBook left join fetch awardBook.book left join fetch awardBook.award where awardBook.id =:id"
    )
    Optional<AwardBook> findOneWithToOneRelationships(@Param("id") Long id);
}
