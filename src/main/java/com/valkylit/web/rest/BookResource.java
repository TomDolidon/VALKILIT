package com.valkylit.web.rest;

import com.valkylit.domain.Book;
import com.valkylit.repository.BookRepository;
import com.valkylit.service.BookService;
import com.valkylit.service.S3bucket.AmazonS3BucketService;
import com.valkylit.service.dto.BookCreateDTO;
import com.valkylit.service.dto.BookCriteriaDTO;
import com.valkylit.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.valkylit.domain.Book}.
 */
@RestController
@RequestMapping("/api/books")
@Transactional
public class BookResource {

    private static final Logger LOG = LoggerFactory.getLogger(BookResource.class);

    private static final String ENTITY_NAME = "book";

    private final BookService bookService;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BookRepository bookRepository;

    @Autowired
    private AmazonS3BucketService amazonS3BucketService;

    public BookResource(BookRepository bookRepository, BookService bookService) {
        this.bookRepository = bookRepository;
        this.bookService = bookService;
    }

    /**
     * {@code POST  /books} : Create a new book.
     *
     * @param book the book to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new book, or with status {@code 400 (Bad Request)} if the book has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Book> createBook(@RequestParam MultipartFile file, @RequestPart BookCreateDTO bookCreate)
        throws URISyntaxException {
        LOG.debug("REST request to save Book BIMBAM : {}", bookCreate);
        if (bookCreate.getId() != null) {
            throw new BadRequestAlertException("A new book cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Book book = new Book();
        this.bookCreateDTOToBook(book, bookCreate);
        book.setImageUri(amazonS3BucketService.uploadFile(file));
        book = bookRepository.save(book);
        return ResponseEntity.created(new URI("/api/books/" + book.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, book.getId().toString()))
            .body(book);
    }

    private void bookCreateDTOToBook(Book book, BookCreateDTO bookCreate) {
        book.setAuthors(bookCreate.getAuthors());
        book.setAwardBooks(bookCreate.getAwardBooks());
        book.setCategories(bookCreate.getCategories());
        book.setDescription(bookCreate.getDescription());
        book.setFormat(bookCreate.getFormat());
        book.setIsbn(bookCreate.getIsbn());
        book.setLanguage(bookCreate.getLanguage());
        book.setPageCount(bookCreate.getPageCount());
        book.setPrice(bookCreate.getPrice());
        book.setPublishDate(bookCreate.getPublishDate());
        book.setStock(bookCreate.getStock());
        book.setPublisher(bookCreate.getPublisher());
        book.setReviews(bookCreate.getReviews());
        book.setSubtitle(bookCreate.getSubtitle());
        book.setTitle(bookCreate.getTitle());
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        // System.out.println("BONJOUR");

        // Vérifiez si le fichier est vide
        if (file.isEmpty()) {
            return new ResponseEntity<>("Le fichier est vide.", HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(this.amazonS3BucketService.uploadFile(file), HttpStatus.OK);
        // Traitez le fichier ici (sauvegarde, validation, etc.)
        // String fileName = file.getOriginalFilename();
        // // Vous pouvez sauvegarder le fichier sur le serveur ou effectuer d'autres opérations

        // return new ResponseEntity<>("Fichier reçu : " + fileName, HttpStatus.OK);
    }

    /**
     * {@code PUT  /books/:id} : Updates an existing book.
     *
     * @param id the id of the book to save.
     * @param book the book to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated book,
     * or with status {@code 400 (Bad Request)} if the book is not valid,
     * or with status {@code 500 (Internal Server Error)} if the book couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable(value = "id", required = false) final UUID id, @Valid @RequestBody Book book)
        throws URISyntaxException {
        LOG.debug("REST request to update Book : {}, {}", id, book);
        if (book.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, book.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bookRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        book = bookRepository.save(book);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, book.getId().toString()))
            .body(book);
    }

    /**
     * {@code PATCH  /books/:id} : Partial updates given fields of an existing book, field will ignore if it is null
     *
     * @param id the id of the book to save.
     * @param book the book to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated book,
     * or with status {@code 400 (Bad Request)} if the book is not valid,
     * or with status {@code 404 (Not Found)} if the book is not found,
     * or with status {@code 500 (Internal Server Error)} if the book couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Book> partialUpdateBook(
        @PathVariable(value = "id", required = false) final UUID id,
        @NotNull @RequestBody Book book
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Book partially : {}, {}", id, book);
        if (book.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, book.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bookRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Book> result = bookRepository
            .findById(book.getId())
            .map(existingBook -> {
                if (book.getTitle() != null) {
                    existingBook.setTitle(book.getTitle());
                }
                if (book.getSubtitle() != null) {
                    existingBook.setSubtitle(book.getSubtitle());
                }
                if (book.getImageUri() != null) {
                    existingBook.setImageUri(book.getImageUri());
                }
                if (book.getPrice() != null) {
                    existingBook.setPrice(book.getPrice());
                }
                if (book.getIsbn() != null) {
                    existingBook.setIsbn(book.getIsbn());
                }
                if (book.getFormat() != null) {
                    existingBook.setFormat(book.getFormat());
                }
                if (book.getStock() != null) {
                    existingBook.setStock(book.getStock());
                }
                if (book.getDescription() != null) {
                    existingBook.setDescription(book.getDescription());
                }
                if (book.getPageCount() != null) {
                    existingBook.setPageCount(book.getPageCount());
                }
                if (book.getLanguage() != null) {
                    existingBook.setLanguage(book.getLanguage());
                }
                if (book.getPublishDate() != null) {
                    existingBook.setPublishDate(book.getPublishDate());
                }

                return existingBook;
            })
            .map(bookRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, book.getId().toString())
        );
    }

    /**
     * {@code GET  /books} : get all the books.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @param criteria filtering books criterias.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of books in body.
     */
    @GetMapping("")
    public ResponseEntity<List<Book>> getAllBooks(Pageable pageable, BookCriteriaDTO criteria) {
        System.out.println(criteria.getSearchTerm());
        Page<Book> page = bookService.findAllWithEagerRelationships(pageable, criteria);

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);

        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /books/:id} : get the "id" book.
     *
     * @param id the id of the book to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the book, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBook(@PathVariable("id") UUID id) {
        LOG.debug("REST request to get Book : {}", id);
        Optional<Book> book = bookRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(book);
    }

    /**
     * {@code DELETE  /books/:id} : delete the "id" book.
     *
     * @param id the id of the book to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable("id") UUID id) {
        LOG.debug("REST request to delete Book : {}", id);
        bookRepository.deleteById(id);

        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
