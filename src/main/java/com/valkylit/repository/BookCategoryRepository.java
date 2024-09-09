package com.valkylit.repository;

import com.valkylit.domain.BookCategory;
import java.util.UUID;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the BookCategory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BookCategoryRepository extends JpaRepository<BookCategory, UUID> {}
