package com.valkylit.repository;

import com.valkylit.domain.PurchaseCommand;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the PurchaseCommand entity.
 */
@Repository
public interface PurchaseCommandRepository extends JpaRepository<PurchaseCommand, UUID> {
    default Optional<PurchaseCommand> findOneWithEagerRelationships(UUID id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<PurchaseCommand> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<PurchaseCommand> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select purchaseCommand from PurchaseCommand purchaseCommand left join fetch purchaseCommand.deliveryAddress",
        countQuery = "select count(purchaseCommand) from PurchaseCommand purchaseCommand"
    )
    Page<PurchaseCommand> findAllWithToOneRelationships(Pageable pageable);

    @Query("select purchaseCommand from PurchaseCommand purchaseCommand left join fetch purchaseCommand.deliveryAddress")
    List<PurchaseCommand> findAllWithToOneRelationships();

    @Query(
        "select purchaseCommand from PurchaseCommand purchaseCommand left join fetch purchaseCommand.deliveryAddress where purchaseCommand.id =:id"
    )
    Optional<PurchaseCommand> findOneWithToOneRelationships(@Param("id") UUID id);
}
