package com.valkylit.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.valkylit.domain.enumeration.PurchaseCommandStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A PurchaseCommand.
 */
@Entity
@Table(name = "purchase_command")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PurchaseCommand implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @Column(name = "id")
    private UUID id;

    @Column(name = "expedition_date")
    private LocalDate expeditionDate;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PurchaseCommandStatus status;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "purchaseCommand")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "purchaseCommand" }, allowSetters = true)
    private Set<PurchaseCommandLine> purchaseCommandLines = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    private Address deliveryAddress;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "internalUser", "reviews", "purchaseCommands", "address" }, allowSetters = true)
    private Client client;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public UUID getId() {
        return this.id;
    }

    public PurchaseCommand id(UUID id) {
        this.setId(id);
        return this;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public LocalDate getExpeditionDate() {
        return this.expeditionDate;
    }

    public PurchaseCommand expeditionDate(LocalDate expeditionDate) {
        this.setExpeditionDate(expeditionDate);
        return this;
    }

    public void setExpeditionDate(LocalDate expeditionDate) {
        this.expeditionDate = expeditionDate;
    }

    public PurchaseCommandStatus getStatus() {
        return this.status;
    }

    public PurchaseCommand status(PurchaseCommandStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(PurchaseCommandStatus status) {
        this.status = status;
    }

    public Set<PurchaseCommandLine> getPurchaseCommandLines() {
        return this.purchaseCommandLines;
    }

    public void setPurchaseCommandLines(Set<PurchaseCommandLine> purchaseCommandLines) {
        if (this.purchaseCommandLines != null) {
            this.purchaseCommandLines.forEach(i -> i.setPurchaseCommand(null));
        }
        if (purchaseCommandLines != null) {
            purchaseCommandLines.forEach(i -> i.setPurchaseCommand(this));
        }
        this.purchaseCommandLines = purchaseCommandLines;
    }

    public PurchaseCommand purchaseCommandLines(Set<PurchaseCommandLine> purchaseCommandLines) {
        this.setPurchaseCommandLines(purchaseCommandLines);
        return this;
    }

    public PurchaseCommand addPurchaseCommandLine(PurchaseCommandLine purchaseCommandLine) {
        this.purchaseCommandLines.add(purchaseCommandLine);
        purchaseCommandLine.setPurchaseCommand(this);
        return this;
    }

    public PurchaseCommand removePurchaseCommandLine(PurchaseCommandLine purchaseCommandLine) {
        this.purchaseCommandLines.remove(purchaseCommandLine);
        purchaseCommandLine.setPurchaseCommand(null);
        return this;
    }

    public Address getDeliveryAddress() {
        return this.deliveryAddress;
    }

    public void setDeliveryAddress(Address address) {
        this.deliveryAddress = address;
    }

    public PurchaseCommand deliveryAddress(Address address) {
        this.setDeliveryAddress(address);
        return this;
    }

    public Client getClient() {
        return this.client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public PurchaseCommand client(Client client) {
        this.setClient(client);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PurchaseCommand)) {
            return false;
        }
        return getId() != null && getId().equals(((PurchaseCommand) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PurchaseCommand{" +
            "id=" + getId() +
            ", expeditionDate='" + getExpeditionDate() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
