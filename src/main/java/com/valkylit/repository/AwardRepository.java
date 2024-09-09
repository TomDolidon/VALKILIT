package com.valkylit.repository;

import com.valkylit.domain.Award;
import java.util.UUID;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Award entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AwardRepository extends JpaRepository<Award, UUID> {}
