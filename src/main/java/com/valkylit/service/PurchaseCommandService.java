package com.valkylit.service;

import com.valkylit.domain.Book;
import com.valkylit.domain.PurchaseCommand;
import com.valkylit.domain.enumeration.PurchaseCommandStatus;
import com.valkylit.repository.BookRepository;
import com.valkylit.repository.PurchaseCommandRepository;
import com.valkylit.security.SecurityUtils;
import com.valkylit.service.dto.PurchaseCommandInvalidLineDTO;
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

        return false;
    }
}
