package com.valkylit.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDate;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A AwardBook.
 */
@Entity
@Table(name = "award_book")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AwardBook implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "year", nullable = false)
    private LocalDate year;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "awardBooks", "reviews", "publisher", "categories", "authors" }, allowSetters = true)
    private Book book;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "awardBooks" }, allowSetters = true)
    private Award award;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public AwardBook id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getYear() {
        return this.year;
    }

    public AwardBook year(LocalDate year) {
        this.setYear(year);
        return this;
    }

    public void setYear(LocalDate year) {
        this.year = year;
    }

    public Book getBook() {
        return this.book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public AwardBook book(Book book) {
        this.setBook(book);
        return this;
    }

    public Award getAward() {
        return this.award;
    }

    public void setAward(Award award) {
        this.award = award;
    }

    public AwardBook award(Award award) {
        this.setAward(award);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AwardBook)) {
            return false;
        }
        return getId() != null && getId().equals(((AwardBook) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AwardBook{" +
            "id=" + getId() +
            ", year='" + getYear() + "'" +
            "}";
    }
}
