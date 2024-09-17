package com.valkylit.service;

import com.valkylit.domain.Book;
import com.valkylit.domain.PurchaseCommand;
import com.valkylit.domain.PurchaseCommandLineTransaction;
import com.valkylit.domain.enumeration.PurchaseCommandStatus;
import com.valkylit.repository.PurchaseCommandLineRepository;
import com.valkylit.repository.PurchaseCommandRepository;
import com.valkylit.security.SecurityUtils;
import com.valkylit.service.dto.PurchaseCommandInvalidLineDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.LockTimeoutException;
import jakarta.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import org.hibernate.PessimisticLockException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PurchaseCommandService {

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
    public boolean validateSelfCurrentDraftPurchaseCommand() throws Exception {
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
            return true;
        } catch (PessimisticLockException | LockTimeoutException e) {
            throw new Exception("Locking issues, can't validate the purchase command", e);
        }
    }
}
