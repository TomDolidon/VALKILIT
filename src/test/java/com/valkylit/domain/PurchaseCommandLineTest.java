package com.valkylit.domain;

import static com.valkylit.domain.BookTestSamples.*;
import static com.valkylit.domain.PurchaseCommandLineTestSamples.*;
import static com.valkylit.domain.PurchaseCommandTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.valkylit.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PurchaseCommandLineTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PurchaseCommandLine.class);
        PurchaseCommandLine purchaseCommandLine1 = getPurchaseCommandLineSample1();
        PurchaseCommandLine purchaseCommandLine2 = new PurchaseCommandLine();
        assertThat(purchaseCommandLine1).isNotEqualTo(purchaseCommandLine2);

        purchaseCommandLine2.setId(purchaseCommandLine1.getId());
        assertThat(purchaseCommandLine1).isEqualTo(purchaseCommandLine2);

        purchaseCommandLine2 = getPurchaseCommandLineSample2();
        assertThat(purchaseCommandLine1).isNotEqualTo(purchaseCommandLine2);
    }

    @Test
    void bookTest() {
        PurchaseCommandLine purchaseCommandLine = getPurchaseCommandLineRandomSampleGenerator();
        Book bookBack = getBookRandomSampleGenerator();

        purchaseCommandLine.setBook(bookBack);
        assertThat(purchaseCommandLine.getBook()).isEqualTo(bookBack);

        purchaseCommandLine.book(null);
        assertThat(purchaseCommandLine.getBook()).isNull();
    }

    @Test
    void purchaseCommandTest() {
        PurchaseCommandLine purchaseCommandLine = getPurchaseCommandLineRandomSampleGenerator();
        PurchaseCommand purchaseCommandBack = getPurchaseCommandRandomSampleGenerator();

        purchaseCommandLine.setPurchaseCommand(purchaseCommandBack);
        assertThat(purchaseCommandLine.getPurchaseCommand()).isEqualTo(purchaseCommandBack);

        purchaseCommandLine.purchaseCommand(null);
        assertThat(purchaseCommandLine.getPurchaseCommand()).isNull();
    }
}
