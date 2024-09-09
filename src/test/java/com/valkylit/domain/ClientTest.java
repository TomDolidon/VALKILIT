package com.valkylit.domain;

import static com.valkylit.domain.AddressTestSamples.*;
import static com.valkylit.domain.ClientTestSamples.*;
import static com.valkylit.domain.PurchaseCommandTestSamples.*;
import static com.valkylit.domain.ReviewTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.valkylit.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ClientTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Client.class);
        Client client1 = getClientSample1();
        Client client2 = new Client();
        assertThat(client1).isNotEqualTo(client2);

        client2.setId(client1.getId());
        assertThat(client1).isEqualTo(client2);

        client2 = getClientSample2();
        assertThat(client1).isNotEqualTo(client2);
    }

    @Test
    void reviewTest() {
        Client client = getClientRandomSampleGenerator();
        Review reviewBack = getReviewRandomSampleGenerator();

        client.addReview(reviewBack);
        assertThat(client.getReviews()).containsOnly(reviewBack);
        assertThat(reviewBack.getClient()).isEqualTo(client);

        client.removeReview(reviewBack);
        assertThat(client.getReviews()).doesNotContain(reviewBack);
        assertThat(reviewBack.getClient()).isNull();

        client.reviews(new HashSet<>(Set.of(reviewBack)));
        assertThat(client.getReviews()).containsOnly(reviewBack);
        assertThat(reviewBack.getClient()).isEqualTo(client);

        client.setReviews(new HashSet<>());
        assertThat(client.getReviews()).doesNotContain(reviewBack);
        assertThat(reviewBack.getClient()).isNull();
    }

    @Test
    void purchaseCommandTest() {
        Client client = getClientRandomSampleGenerator();
        PurchaseCommand purchaseCommandBack = getPurchaseCommandRandomSampleGenerator();

        client.addPurchaseCommand(purchaseCommandBack);
        assertThat(client.getPurchaseCommands()).containsOnly(purchaseCommandBack);
        assertThat(purchaseCommandBack.getClient()).isEqualTo(client);

        client.removePurchaseCommand(purchaseCommandBack);
        assertThat(client.getPurchaseCommands()).doesNotContain(purchaseCommandBack);
        assertThat(purchaseCommandBack.getClient()).isNull();

        client.purchaseCommands(new HashSet<>(Set.of(purchaseCommandBack)));
        assertThat(client.getPurchaseCommands()).containsOnly(purchaseCommandBack);
        assertThat(purchaseCommandBack.getClient()).isEqualTo(client);

        client.setPurchaseCommands(new HashSet<>());
        assertThat(client.getPurchaseCommands()).doesNotContain(purchaseCommandBack);
        assertThat(purchaseCommandBack.getClient()).isNull();
    }

    @Test
    void addressTest() {
        Client client = getClientRandomSampleGenerator();
        Address addressBack = getAddressRandomSampleGenerator();

        client.setAddress(addressBack);
        assertThat(client.getAddress()).isEqualTo(addressBack);

        client.address(null);
        assertThat(client.getAddress()).isNull();
    }
}
