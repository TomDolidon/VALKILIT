package com.valkylit.repository;

import com.valkylit.domain.PurchaseCommandLine;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the PurchaseCommandLine entity.
 */
@Repository
public interface PurchaseCommandLineRepository extends JpaRepository<PurchaseCommandLine, UUID> {
    default Optional<PurchaseCommandLine> findOneWithEagerRelationships(UUID id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<PurchaseCommandLine> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<PurchaseCommandLine> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select purchaseCommandLine from PurchaseCommandLine purchaseCommandLine left join fetch purchaseCommandLine.book",
        countQuery = "select count(purchaseCommandLine) from PurchaseCommandLine purchaseCommandLine"
    )
    Page<PurchaseCommandLine> findAllWithToOneRelationships(Pageable pageable);

    @Query("select purchaseCommandLine from PurchaseCommandLine purchaseCommandLine left join fetch purchaseCommandLine.book")
    List<PurchaseCommandLine> findAllWithToOneRelationships();

    @Query(
        "select purchaseCommandLine from PurchaseCommandLine purchaseCommandLine left join fetch purchaseCommandLine.book where purchaseCommandLine.id =:id"
    )
    Optional<PurchaseCommandLine> findOneWithToOneRelationships(@Param("id") UUID id);
}
