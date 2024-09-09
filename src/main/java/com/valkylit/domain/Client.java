package com.valkylit.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Client.
 */
@Entity
@Table(name = "client")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Client implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @Column(name = "id")
    private UUID id;

    @Column(name = "birthdate")
    private LocalDate birthdate;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private User internalUser;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "client")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "client", "book" }, allowSetters = true)
    private Set<Review> reviews = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "client")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "purchaseCommandLines", "deliveryAddress", "client" }, allowSetters = true)
    private Set<PurchaseCommand> purchaseCommands = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    private Address address;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public UUID getId() {
        return this.id;
    }

    public Client id(UUID id) {
        this.setId(id);
        return this;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public LocalDate getBirthdate() {
        return this.birthdate;
    }

    public Client birthdate(LocalDate birthdate) {
        this.setBirthdate(birthdate);
        return this;
    }

    public void setBirthdate(LocalDate birthdate) {
        this.birthdate = birthdate;
    }

    public User getInternalUser() {
        return this.internalUser;
    }

    public void setInternalUser(User user) {
        this.internalUser = user;
    }

    public Client internalUser(User user) {
        this.setInternalUser(user);
        return this;
    }

    public Set<Review> getReviews() {
        return this.reviews;
    }

    public void setReviews(Set<Review> reviews) {
        if (this.reviews != null) {
            this.reviews.forEach(i -> i.setClient(null));
        }
        if (reviews != null) {
            reviews.forEach(i -> i.setClient(this));
        }
        this.reviews = reviews;
    }

    public Client reviews(Set<Review> reviews) {
        this.setReviews(reviews);
        return this;
    }

    public Client addReview(Review review) {
        this.reviews.add(review);
        review.setClient(this);
        return this;
    }

    public Client removeReview(Review review) {
        this.reviews.remove(review);
        review.setClient(null);
        return this;
    }

    public Set<PurchaseCommand> getPurchaseCommands() {
        return this.purchaseCommands;
    }

    public void setPurchaseCommands(Set<PurchaseCommand> purchaseCommands) {
        if (this.purchaseCommands != null) {
            this.purchaseCommands.forEach(i -> i.setClient(null));
        }
        if (purchaseCommands != null) {
            purchaseCommands.forEach(i -> i.setClient(this));
        }
        this.purchaseCommands = purchaseCommands;
    }

    public Client purchaseCommands(Set<PurchaseCommand> purchaseCommands) {
        this.setPurchaseCommands(purchaseCommands);
        return this;
    }

    public Client addPurchaseCommand(PurchaseCommand purchaseCommand) {
        this.purchaseCommands.add(purchaseCommand);
        purchaseCommand.setClient(this);
        return this;
    }

    public Client removePurchaseCommand(PurchaseCommand purchaseCommand) {
        this.purchaseCommands.remove(purchaseCommand);
        purchaseCommand.setClient(null);
        return this;
    }

    public Address getAddress() {
        return this.address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public Client address(Address address) {
        this.setAddress(address);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Client)) {
            return false;
        }
        return getId() != null && getId().equals(((Client) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Client{" +
            "id=" + getId() +
            ", birthdate='" + getBirthdate() + "'" +
            "}";
    }
}
