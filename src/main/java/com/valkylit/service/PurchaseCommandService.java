package com.valkylit.service;

import com.valkylit.domain.*;
import com.valkylit.domain.enumeration.PurchaseCommandStatus;
import com.valkylit.repository.PurchaseCommandLineRepository;
import com.valkylit.repository.PurchaseCommandRepository;
import com.valkylit.security.SecurityUtils;
import com.valkylit.service.dto.PurchaseCommandInvalidLineDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.LockTimeoutException;
import jakarta.persistence.PersistenceContext;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;
import org.hibernate.PessimisticLockException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PurchaseCommandService {

    static final int PURCHASE_ATTEMPTS_COUNT = 3;

    @Autowired
    private PurchaseCommandRepository purchaseCommandRepository;

    @Autowired
    private PurchaseCommandLineRepository purchaseCommandLineRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public List<PurchaseCommandInvalidLineDTO> getInvalidBooksStockForSelfCurrentDraftPurchaseCommand() throws Exception {
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new Exception("Current user login not found"));
        Optional<PurchaseCommand> purchaseCommand = purchaseCommandRepository.findCurrentDraftWithRelationshipsByLogin(userLogin);

        List<PurchaseCommandInvalidLineDTO> invalidLines = new ArrayList<>();
        purchaseCommand.ifPresent(pc ->
            pc
                .getPurchaseCommandLines()
                .forEach(pcl -> {
                    if (pcl.getBook().getStock() - pcl.getQuantity() < 0) {
                        PurchaseCommandInvalidLineDTO invalidLine = new PurchaseCommandInvalidLineDTO();
                        invalidLine.setId(pcl.getBook().getId());
                        invalidLine.setTitle(pcl.getBook().getTitle());
                        invalidLine.setStock(pcl.getBook().getStock());
                        invalidLine.setPurchaseCommandLineId(pcl.getId());
                        invalidLine.setPurchaseCommandUnitPrice(pcl.getUnitPrice());
                        invalidLine.setPurchaseCommandQuantity(pcl.getQuantity());
                        invalidLines.add(invalidLine);
                    }
                })
        );
        return invalidLines;
    }

    @Transactional
    public PurchaseCommand validateSelfCurrentDraftPurchaseCommand() throws Exception {
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new Exception("Current user login not found"));

        // Check purchase command is existing.
        Optional<PurchaseCommand> purchaseCommandOptional = purchaseCommandRepository.findCurrentDraftByLogin(userLogin);
        PurchaseCommand purchaseCommand = purchaseCommandOptional.orElseThrow(() -> new NoSuchElementException("PurchaseCommand not found")
        );

        // Only get book id and the quantity needed by the customer.
        List<PurchaseCommandLineTransaction> orderedPurchaseCommandLinesInfo =
            purchaseCommandLineRepository.getPurchaseCommandLinesBookIdAndQuantity(purchaseCommand.getId());

        try {
            orderedPurchaseCommandLinesInfo.forEach(lineEssentialInfo -> {
                Book book = entityManager.find(Book.class, lineEssentialInfo.getBookId(), LockModeType.PESSIMISTIC_WRITE);
                int futureStock = book.getStock() - lineEssentialInfo.getQuantity();
                if (futureStock < 0) {
                    throw new RuntimeException("Insufficient stock for book " + lineEssentialInfo.getBookId());
                }
                book.setStock(futureStock);
            });

            purchaseCommand.setStatus(PurchaseCommandStatus.ORDERED);
            purchaseCommand.setExpeditionDate(LocalDate.ofInstant(Instant.now(), ZoneId.systemDefault()));
            return purchaseCommand;
        } catch (PessimisticLockException | LockTimeoutException e) {
            throw new Exception("Locking issues, can't validate the purchase command", e);
        }
    }

    /**
     * Add an item to cart
     * @param purchaseCommandLine
     * @param client
     * @return
     */
    public PurchaseCommand addItemToCart(PurchaseCommandLine purchaseCommandLine, Client client) {
        // Find or create the client cart where status = DRAFT
        PurchaseCommand purchaseCommand = findOrCreateCartForClient(client);

        // Check if item already exists in the cart
        Optional<PurchaseCommandLine> optionnalLine = purchaseCommandLineRepository.findByPurchaseCommandAndBook(
            purchaseCommand,
            purchaseCommandLine.getBook()
        );
        if (optionnalLine.isPresent()) {
            PurchaseCommandLine line = optionnalLine.get();
            line.setQuantity(line.getQuantity() + purchaseCommandLine.getQuantity());
        } else {
            purchaseCommandLine.setPurchaseCommand(purchaseCommand);
            purchaseCommand.getPurchaseCommandLines().add(purchaseCommandLine);
        }

        // Save updated cart
        return purchaseCommandRepository.save(purchaseCommand);
    }

    public PurchaseCommand removeItemFromCart(UUID bookId, Client client) {
        // Find or create the client cart where status = DRAFT
        PurchaseCommand purchaseCommand = findOrCreateCartForClient(client);
        // Find the PurchaseCommandLine for the given book in the client's cart
        Optional<PurchaseCommandLine> optionnalLine = purchaseCommandLineRepository.findByPurchaseCommandAndBookId(purchaseCommand, bookId);

        if (optionnalLine.isPresent()) {
            // Remove the item from the cart
            PurchaseCommandLine line = optionnalLine.get();
            purchaseCommand.getPurchaseCommandLines().remove(line);

            // Optionally: You might want to remove the line from the database
            purchaseCommandLineRepository.delete(line);
        } else {
            throw new Error("Item not found in the cart");
        }
        return purchaseCommandRepository.save(purchaseCommand);
    }

    public PurchaseCommand decrementItemInCart(UUID bookId, Client client) {
        // Find or create the client cart where status = DRAFT
        PurchaseCommand purchaseCommand = findOrCreateCartForClient(client);

        // Check if item already exists in the cart
        Optional<PurchaseCommandLine> optionalLine = purchaseCommandLineRepository.findByPurchaseCommandAndBookId(purchaseCommand, bookId);

        if (optionalLine.isPresent()) {
            PurchaseCommandLine line = optionalLine.get();
            int newQuantity = line.getQuantity() - 1;

            if (newQuantity > 0) {
                // Decrease the quantity
                line.setQuantity(newQuantity);
            } else {
                // If the quantity reaches 0 or below, remove the item from the cart
                purchaseCommand.getPurchaseCommandLines().remove(line);
                purchaseCommandLineRepository.delete(line);
            }
        } else {
            throw new Error("Item not found in the cart");
        }

        // Save updated cart
        return purchaseCommandRepository.save(purchaseCommand);
    }

    @Transactional
    public PurchaseCommand updateCommandLineInCart(List<PurchaseCommandLine> purchaseCommandLines, Client client) {
        PurchaseCommand purchaseCommand = findOrCreateCartForClient(client);

        // remove all associated command lines
        purchaseCommandLineRepository.deleteAllByPurchaseCommand(purchaseCommand);
        List<PurchaseCommandLine> updatedLines = new ArrayList<>();
        for (PurchaseCommandLine line : purchaseCommandLines) {
            line.setPurchaseCommand(purchaseCommand);
            // Ajouter la ligne de commande à une liste pour enregistrer ensuite
            updatedLines.add(line);
        }

        // Enregistrer les lignes de commande mises à jour
        purchaseCommandLineRepository.saveAll(updatedLines);

        return purchaseCommandRepository.save(purchaseCommand);
    }

    /**
     * Clear all items from the cart.
     * @param client the client whose cart needs to be cleared.
     * @return the updated PurchaseCommand.
     */
    public PurchaseCommand clearCart(Client client) {
        // Find or create the client cart where status = DRAFT
        PurchaseCommand purchaseCommand = findOrCreateCartForClient(client);

        purchaseCommandLineRepository.deleteAll(purchaseCommand.getPurchaseCommandLines());
        purchaseCommand.getPurchaseCommandLines().clear();
        return purchaseCommandRepository.save(purchaseCommand);
    }

    public PurchaseCommand findOrCreateCartForClient(Client client) {
        // Check if a draft cart exists for the client
        return purchaseCommandRepository.findByClientAndStatus(client, PurchaseCommandStatus.DRAFT).orElseGet(() -> createNewCart(client));
    }

    private PurchaseCommand createNewCart(Client client) {
        PurchaseCommand newCart = new PurchaseCommand();
        newCart.setClient(client);
        newCart.setStatus(PurchaseCommandStatus.DRAFT);
        return purchaseCommandRepository.save(newCart);
    }
}
