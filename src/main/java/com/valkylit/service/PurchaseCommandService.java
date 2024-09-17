package com.valkylit.service;

import com.valkylit.domain.Book;
import com.valkylit.domain.Client;
import com.valkylit.domain.PurchaseCommand;
import com.valkylit.domain.PurchaseCommandLine;
import com.valkylit.domain.enumeration.PurchaseCommandStatus;
import com.valkylit.repository.BookRepository;
import com.valkylit.repository.PurchaseCommandLineRepository;
import com.valkylit.repository.PurchaseCommandRepository;
import com.valkylit.security.SecurityUtils;
import com.valkylit.service.dto.PurchaseCommandInvalidLineDTO;
import com.valkylit.web.rest.errors.BadRequestAlertException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.LockTimeoutException;
import jakarta.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.hibernate.PessimisticLockException;
import org.hibernate.dialect.lock.OptimisticEntityLockException;
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

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private BookService bookService;

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public boolean validateSelfCurrentDraftPurchaseCommand(UUID purchaseCommandId) {
        try {
            PurchaseCommand pc = this.entityManager.find(PurchaseCommand.class, purchaseCommandId, LockModeType.READ);
            pc
                .getPurchaseCommandLines()
                .forEach(purchaseCommandLine -> {
                    Book book = this.entityManager.find(Book.class, purchaseCommandLine.getBook().getId(), LockModeType.WRITE);
                    int futureStock = book.getStock() - purchaseCommandLine.getQuantity();
                    if (futureStock >= 0) {
                        book.setStock(futureStock);
                        this.bookRepository.save(book);
                    }
                });
            return true;
        } catch (OptimisticEntityLockException | LockTimeoutException e) {
            // doing something
            return false;
        }
    }

    public List<PurchaseCommandInvalidLineDTO> getInvalidBooksStockForSelfCurrentDraftPurchaseCommand() throws Exception {
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new Exception("Current user login not found"));
        Optional<PurchaseCommand> purchaseCommand = purchaseCommandRepository.findCurrentDraftByLogin(userLogin);

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
    public boolean validateSelfCurrentDraftPurchaseCommand() throws Exception {
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new Exception("Current user login not found"));
        Optional<PurchaseCommand> purchaseCommand = purchaseCommandRepository.findCurrentDraftByLogin(userLogin);
        if (purchaseCommand.isEmpty()) {
            throw new Exception("No purchase command found");
        }

        for (int i = 0; i < PURCHASE_ATTEMPTS_COUNT; i++) {
            try {
                purchaseCommand
                    .get()
                    .getPurchaseCommandLines()
                    .forEach(pcl -> {
                        Book book = entityManager.find(Book.class, pcl.getBook().getId(), LockModeType.PESSIMISTIC_WRITE);
                        int futureStock = book.getStock() - pcl.getQuantity();
                        if (futureStock < 0) {
                            try {
                                throw new Exception("Insufficient stock");
                            } catch (Exception e) {
                                throw new RuntimeException(e);
                            }
                        }
                        book.setStock(futureStock);
                    });
                purchaseCommand.get().setStatus(PurchaseCommandStatus.ORDERED);
                return true;
            } catch (PessimisticLockException | LockTimeoutException e) {
                // Don't throw anything. Let's try on another attempt.
            }
        }

        System.out.println();
        return false;
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
            throw new BadRequestAlertException("Item not found in the cart", "purchaseCommandLine", "itemNotFound");
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
            throw new BadRequestAlertException("Item not found in the cart", "purchaseCommandLine", "itemNotFound");
        }

        // Save updated cart
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

    private PurchaseCommand findOrCreateCartForClient(Client client) {
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
