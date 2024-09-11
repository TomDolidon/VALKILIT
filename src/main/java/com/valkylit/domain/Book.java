package com.valkylit.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.valkylit.domain.enumeration.BookFormat;
import com.valkylit.domain.enumeration.Language;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Book.
 */
@Entity
@Table(name = "book")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Book implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @Column(name = "id")
    private UUID id;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "subtitle")
    private String subtitle;

    @Column(name = "image_uri")
    private String imageUri;

    @NotNull
    @Column(name = "price", nullable = false)
    private Float price;

    @Column(name = "isbn")
    private String isbn;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "format", nullable = false)
    private BookFormat format;

    @NotNull
    @Column(name = "stock", nullable = false)
    private Integer stock;

    @Column(name = "description")
    private String description;

    @Column(name = "page_count")
    private Integer pageCount;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "language", nullable = false)
    private Language language;

    @NotNull
    @Column(name = "publish_date", nullable = false)
    private LocalDate publishDate;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "book")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "book", "award" }, allowSetters = true)
    private Set<AwardBook> awardBooks = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "book")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "client", "book" }, allowSetters = true)
    private Set<Review> reviews = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "books" }, allowSetters = true)
    private Publisher publisher;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_book__category",
        joinColumns = @JoinColumn(name = "book_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "books" }, allowSetters = true)
    private Set<BookCategory> categories = new HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "rel_book__author", joinColumns = @JoinColumn(name = "book_id"), inverseJoinColumns = @JoinColumn(name = "author_id"))
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "books" }, allowSetters = true)
    private Set<Author> authors = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public UUID getId() {
        return this.id;
    }

    public Book id(UUID id) {
        this.setId(id);
        return this;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Book title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubtitle() {
        return this.subtitle;
    }

    public Book subtitle(String subtitle) {
        this.setSubtitle(subtitle);
        return this;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public String getImageUri() {
        return this.imageUri;
    }

    public Book imageUri(String imageUri) {
        this.setImageUri(imageUri);
        return this;
    }

    public void setImageUri(String imageUri) {
        this.imageUri = imageUri;
    }

    public Float getPrice() {
        return this.price;
    }

    public Book price(Float price) {
        this.setPrice(price);
        return this;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public String getIsbn() {
        return this.isbn;
    }

    public Book isbn(String isbn) {
        this.setIsbn(isbn);
        return this;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public BookFormat getFormat() {
        return this.format;
    }

    public Book format(BookFormat format) {
        this.setFormat(format);
        return this;
    }

    public void setFormat(BookFormat format) {
        this.format = format;
    }

    public Integer getStock() {
        return this.stock;
    }

    public Book stock(Integer stock) {
        this.setStock(stock);
        return this;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getDescription() {
        return this.description;
    }

    public Book description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getPageCount() {
        return this.pageCount;
    }

    public Book pageCount(Integer pageCount) {
        this.setPageCount(pageCount);
        return this;
    }

    public void setPageCount(Integer pageCount) {
        this.pageCount = pageCount;
    }

    public Language getLanguage() {
        return this.language;
    }

    public Book language(Language language) {
        this.setLanguage(language);
        return this;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }

    public LocalDate getPublishDate() {
        return this.publishDate;
    }

    public Book publishDate(LocalDate publishDate) {
        this.setPublishDate(publishDate);
        return this;
    }

    public void setPublishDate(LocalDate publishDate) {
        this.publishDate = publishDate;
    }

    public Set<AwardBook> getAwardBooks() {
        return this.awardBooks;
    }

    public void setAwardBooks(Set<AwardBook> awardBooks) {
        if (this.awardBooks != null) {
            this.awardBooks.forEach(i -> i.setBook(null));
        }
        if (awardBooks != null) {
            awardBooks.forEach(i -> i.setBook(this));
        }
        this.awardBooks = awardBooks;
    }

    public Book awardBooks(Set<AwardBook> awardBooks) {
        this.setAwardBooks(awardBooks);
        return this;
    }

    public Book addAwardBook(AwardBook awardBook) {
        this.awardBooks.add(awardBook);
        awardBook.setBook(this);
        return this;
    }

    public Book removeAwardBook(AwardBook awardBook) {
        this.awardBooks.remove(awardBook);
        awardBook.setBook(null);
        return this;
    }

    public Set<Review> getReviews() {
        return this.reviews;
    }

    public void setReviews(Set<Review> reviews) {
        if (this.reviews != null) {
            this.reviews.forEach(i -> i.setBook(null));
        }
        if (reviews != null) {
            reviews.forEach(i -> i.setBook(this));
        }
        this.reviews = reviews;
    }

    public Book reviews(Set<Review> reviews) {
        this.setReviews(reviews);
        return this;
    }

    public Book addReviews(Review review) {
        this.reviews.add(review);
        review.setBook(this);
        return this;
    }

    public Book removeReviews(Review review) {
        this.reviews.remove(review);
        review.setBook(null);
        return this;
    }

    public Publisher getPublisher() {
        return this.publisher;
    }

    public void setPublisher(Publisher publisher) {
        this.publisher = publisher;
    }

    public Book publisher(Publisher publisher) {
        this.setPublisher(publisher);
        return this;
    }

    public Set<BookCategory> getCategories() {
        return this.categories;
    }

    public void setCategories(Set<BookCategory> bookCategories) {
        this.categories = bookCategories;
    }

    public Book categories(Set<BookCategory> bookCategories) {
        this.setCategories(bookCategories);
        return this;
    }

    public Book addCategory(BookCategory bookCategory) {
        this.categories.add(bookCategory);
        return this;
    }

    public Book removeCategory(BookCategory bookCategory) {
        this.categories.remove(bookCategory);
        return this;
    }

    public Set<Author> getAuthors() {
        return this.authors;
    }

    public void setAuthors(Set<Author> authors) {
        this.authors = authors;
    }

    public Book authors(Set<Author> authors) {
        this.setAuthors(authors);
        return this;
    }

    public Book addAuthor(Author author) {
        this.authors.add(author);
        return this;
    }

    public Book removeAuthor(Author author) {
        this.authors.remove(author);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Book)) {
            return false;
        }
        return getId() != null && getId().equals(((Book) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Book{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", subtitle='" + getSubtitle() + "'" +
            ", imageUri='" + getImageUri() + "'" +
            ", price=" + getPrice() +
            ", isbn='" + getIsbn() + "'" +
            ", format='" + getFormat() + "'" +
            ", stock=" + getStock() +
            ", description='" + getDescription() + "'" +
            ", pageCount=" + getPageCount() +
            ", language='" + getLanguage() + "'" +
            ", publishDate='" + getPublishDate() + "'" +
            "}";
    }
}
