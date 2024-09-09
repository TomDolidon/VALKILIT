package com.valkylit.repository;

import com.valkylit.domain.AwardBook;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class AwardBookRepositoryWithBagRelationshipsImpl implements AwardBookRepositoryWithBagRelationships {

    private static final String ID_PARAMETER = "id";
    private static final String AWARDBOOKS_PARAMETER = "awardBooks";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<AwardBook> fetchBagRelationships(Optional<AwardBook> awardBook) {
        return awardBook.map(this::fetchAwards);
    }

    @Override
    public Page<AwardBook> fetchBagRelationships(Page<AwardBook> awardBooks) {
        return new PageImpl<>(fetchBagRelationships(awardBooks.getContent()), awardBooks.getPageable(), awardBooks.getTotalElements());
    }

    @Override
    public List<AwardBook> fetchBagRelationships(List<AwardBook> awardBooks) {
        return Optional.of(awardBooks).map(this::fetchAwards).orElse(Collections.emptyList());
    }

    AwardBook fetchAwards(AwardBook result) {
        return entityManager
            .createQuery(
                "select awardBook from AwardBook awardBook left join fetch awardBook.awards where awardBook.id = :id",
                AwardBook.class
            )
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<AwardBook> fetchAwards(List<AwardBook> awardBooks) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, awardBooks.size()).forEach(index -> order.put(awardBooks.get(index).getId(), index));
        List<AwardBook> result = entityManager
            .createQuery(
                "select awardBook from AwardBook awardBook left join fetch awardBook.awards where awardBook in :awardBooks",
                AwardBook.class
            )
            .setParameter(AWARDBOOKS_PARAMETER, awardBooks)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
