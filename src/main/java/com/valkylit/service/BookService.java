package com.valkylit.service;

import com.valkylit.domain.Book;
import com.valkylit.repository.BookRepository;
import com.valkylit.service.dto.BookCriteriaDTO;
import com.valkylit.specification.BookSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public Page<Book> findAllWithEagerRelationships(Pageable pageable, BookCriteriaDTO criteria) {
        Specification<Book> spec = BookSpecification.withCriteria(criteria);
        return bookRepository.findAllWithEagerRelationships(spec, pageable);
    }
}
