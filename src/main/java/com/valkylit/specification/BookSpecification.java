package com.valkylit.specification;

import com.valkylit.domain.Author;
import com.valkylit.domain.Book;
import com.valkylit.service.dto.BookCriteriaDTO;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

public class BookSpecification {

    public static Specification<Book> withCriteria(BookCriteriaDTO criteria) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (criteria.getAuthors() != null && !criteria.getAuthors().isEmpty()) {
                Join<Book, Author> authors = root.join("authors");
                predicates.add(authors.get("name").in(criteria.getAuthors()));
            }

            if (criteria.getFormats() != null && !criteria.getFormats().isEmpty()) {
                predicates.add(root.get("format").in(criteria.getFormats()));
            }

            if (criteria.getMinPrice() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("price"), criteria.getMinPrice()));
            }

            if (criteria.getMaxPrice() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("price"), criteria.getMaxPrice()));
            }

            if (criteria.getSearchTerm() != null && !criteria.getSearchTerm().isEmpty()) {
                predicates.add(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), "%" + criteria.getSearchTerm().toLowerCase() + "%")
                );
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
