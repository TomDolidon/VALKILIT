package com.valkylit.repository;

import com.valkylit.domain.Book;
import com.valkylit.domain.PurchaseCommand;
import com.valkylit.domain.PurchaseCommandLine;
import com.valkylit.domain.PurchaseCommandLineTransaction;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
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

    @Query("SELECT pcl FROM PurchaseCommandLine pcl WHERE pcl.purchaseCommand = :purchaseCommand AND pcl.book = :book")
    Optional<PurchaseCommandLine> findByPurchaseCommandAndBook(
        @Param("purchaseCommand") PurchaseCommand purchaseCommand,
        @Param("book") Book book
    );

    @Query("SELECT pcl FROM PurchaseCommandLine pcl WHERE pcl.purchaseCommand = :purchaseCommand AND pcl.book.id = :bookId")
    Optional<PurchaseCommandLine> findByPurchaseCommandAndBookId(
        @Param("purchaseCommand") PurchaseCommand purchaseCommand,
        @Param("bookId") UUID bookId
    );

    @Query(
        "select new com.valkylit.domain.PurchaseCommandLineTransaction(purchaseCommandLine.book.id, purchaseCommandLine.quantity) from PurchaseCommandLine purchaseCommandLine where purchaseCommandLine.purchaseCommand.id =:purchaseCommandId order by purchaseCommandLine.book.id ASC"
    )
    List<PurchaseCommandLineTransaction> getPurchaseCommandLinesBookIdAndQuantity(@Param("purchaseCommandId") UUID purchaseCommandId);

    @Modifying
    @Query("delete from PurchaseCommandLine pcl where pcl.purchaseCommand = :purchaseCommand")
    void deleteAllByPurchaseCommand(@Param("purchaseCommand") PurchaseCommand purchaseCommand);
}
