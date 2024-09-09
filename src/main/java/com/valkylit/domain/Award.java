package com.valkylit.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Award.
 */
@Entity
@Table(name = "award")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Award implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @Column(name = "id")
    private UUID id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "award")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "book", "award" }, allowSetters = true)
    private Set<AwardBook> awardBooks = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public UUID getId() {
        return this.id;
    }

    public Award id(UUID id) {
        this.setId(id);
        return this;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Award name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Award description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<AwardBook> getAwardBooks() {
        return this.awardBooks;
    }

    public void setAwardBooks(Set<AwardBook> awardBooks) {
        if (this.awardBooks != null) {
            this.awardBooks.forEach(i -> i.setAward(null));
        }
        if (awardBooks != null) {
            awardBooks.forEach(i -> i.setAward(this));
        }
        this.awardBooks = awardBooks;
    }

    public Award awardBooks(Set<AwardBook> awardBooks) {
        this.setAwardBooks(awardBooks);
        return this;
    }

    public Award addAwardBook(AwardBook awardBook) {
        this.awardBooks.add(awardBook);
        awardBook.setAward(this);
        return this;
    }

    public Award removeAwardBook(AwardBook awardBook) {
        this.awardBooks.remove(awardBook);
        awardBook.setAward(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Award)) {
            return false;
        }
        return getId() != null && getId().equals(((Award) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Award{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
