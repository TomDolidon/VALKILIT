package com.valkylit.repository;

import com.valkylit.domain.AwardBook;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface AwardBookRepositoryWithBagRelationships {
    Optional<AwardBook> fetchBagRelationships(Optional<AwardBook> awardBook);

    List<AwardBook> fetchBagRelationships(List<AwardBook> awardBooks);

    Page<AwardBook> fetchBagRelationships(Page<AwardBook> awardBooks);
}
