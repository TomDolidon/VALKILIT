package com.valkylit.service.dto;

import com.valkylit.domain.Author;
import com.valkylit.domain.AwardBook;
import com.valkylit.domain.BookCategory;
import com.valkylit.domain.Publisher;
import com.valkylit.domain.Review;
import com.valkylit.domain.enumeration.BookFormat;
import com.valkylit.domain.enumeration.Language;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import org.springframework.web.multipart.MultipartFile;

public class BookCreateDTO {

    private UUID id = null;
    private String title;
    private String subtitle;
    private String imageUri;
    // private MultipartFile imageFile;
    private Float price;
    private String isbn;
    private BookFormat format;
    private Integer stock;
    private String description;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public Float getPrice() {
        return price;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public BookFormat getFormat() {
        return format;
    }

    public void setFormat(BookFormat format) {
        this.format = format;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getPageCount() {
        return pageCount;
    }

    public void setPageCount(Integer pageCount) {
        this.pageCount = pageCount;
    }

    public Language getLanguage() {
        return language;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }

    public LocalDate getPublishDate() {
        return publishDate;
    }

    public void setPublishDate(LocalDate publishDate) {
        this.publishDate = publishDate;
    }

    public Set<AwardBook> getAwardBooks() {
        return awardBooks;
    }

    public void setAwardBooks(Set<AwardBook> awardBooks) {
        this.awardBooks = awardBooks;
    }

    public Set<Review> getReviews() {
        return reviews;
    }

    public void setReviews(Set<Review> reviews) {
        this.reviews = reviews;
    }

    public Publisher getPublisher() {
        return publisher;
    }

    public void setPublisher(Publisher publisher) {
        this.publisher = publisher;
    }

    public Set<BookCategory> getCategories() {
        return categories;
    }

    public void setCategories(Set<BookCategory> categories) {
        this.categories = categories;
    }

    public Set<Author> getAuthors() {
        return authors;
    }

    public void setAuthors(Set<Author> authors) {
        this.authors = authors;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getImageUri() {
        return imageUri;
    }

    public void setImageUri(String imageUri) {
        this.imageUri = imageUri;
    }

    private Integer pageCount;
    private Language language;
    private LocalDate publishDate;
    private Set<AwardBook> awardBooks = new HashSet<>();
    private Set<Review> reviews = new HashSet<>();
    private Publisher publisher;
    private Set<BookCategory> categories = new HashSet<>();
    private Set<Author> authors = new HashSet<>();
}
