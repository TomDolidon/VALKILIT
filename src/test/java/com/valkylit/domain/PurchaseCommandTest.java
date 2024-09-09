package com.valkylit.domain;

import static com.valkylit.domain.AddressTestSamples.*;
import static com.valkylit.domain.ClientTestSamples.*;
import static com.valkylit.domain.PurchaseCommandLineTestSamples.*;
import static com.valkylit.domain.PurchaseCommandTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.valkylit.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class PurchaseCommandTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PurchaseCommand.class);
        PurchaseCommand purchaseCommand1 = getPurchaseCommandSample1();
        PurchaseCommand purchaseCommand2 = new PurchaseCommand();
        assertThat(purchaseCommand1).isNotEqualTo(purchaseCommand2);

        purchaseCommand2.setId(purchaseCommand1.getId());
        assertThat(purchaseCommand1).isEqualTo(purchaseCommand2);

        purchaseCommand2 = getPurchaseCommandSample2();
        assertThat(purchaseCommand1).isNotEqualTo(purchaseCommand2);
    }

    @Test
    void purchaseCommandLineTest() {
        PurchaseCommand purchaseCommand = getPurchaseCommandRandomSampleGenerator();
        PurchaseCommandLine purchaseCommandLineBack = getPurchaseCommandLineRandomSampleGenerator();

        purchaseCommand.addPurchaseCommandLine(purchaseCommandLineBack);
        assertThat(purchaseCommand.getPurchaseCommandLines()).containsOnly(purchaseCommandLineBack);
        assertThat(purchaseCommandLineBack.getPurchaseCommand()).isEqualTo(purchaseCommand);

        purchaseCommand.removePurchaseCommandLine(purchaseCommandLineBack);
        assertThat(purchaseCommand.getPurchaseCommandLines()).doesNotContain(purchaseCommandLineBack);
        assertThat(purchaseCommandLineBack.getPurchaseCommand()).isNull();

        purchaseCommand.purchaseCommandLines(new HashSet<>(Set.of(purchaseCommandLineBack)));
        assertThat(purchaseCommand.getPurchaseCommandLines()).containsOnly(purchaseCommandLineBack);
        assertThat(purchaseCommandLineBack.getPurchaseCommand()).isEqualTo(purchaseCommand);

        purchaseCommand.setPurchaseCommandLines(new HashSet<>());
        assertThat(purchaseCommand.getPurchaseCommandLines()).doesNotContain(purchaseCommandLineBack);
        assertThat(purchaseCommandLineBack.getPurchaseCommand()).isNull();
    }

    @Test
    void deliveryAddressTest() {
        PurchaseCommand purchaseCommand = getPurchaseCommandRandomSampleGenerator();
        Address addressBack = getAddressRandomSampleGenerator();

        purchaseCommand.setDeliveryAddress(addressBack);
        assertThat(purchaseCommand.getDeliveryAddress()).isEqualTo(addressBack);

        purchaseCommand.deliveryAddress(null);
        assertThat(purchaseCommand.getDeliveryAddress()).isNull();
    }

    @Test
    void clientTest() {
        PurchaseCommand purchaseCommand = getPurchaseCommandRandomSampleGenerator();
        Client clientBack = getClientRandomSampleGenerator();

        purchaseCommand.setClient(clientBack);
        assertThat(purchaseCommand.getClient()).isEqualTo(clientBack);

        purchaseCommand.client(null);
        assertThat(purchaseCommand.getClient()).isNull();
    }
}
