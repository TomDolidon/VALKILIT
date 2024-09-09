package com.valkylit.domain;

import static com.valkylit.domain.AwardBookTestSamples.*;
import static com.valkylit.domain.AwardTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.valkylit.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class AwardTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Award.class);
        Award award1 = getAwardSample1();
        Award award2 = new Award();
        assertThat(award1).isNotEqualTo(award2);

        award2.setId(award1.getId());
        assertThat(award1).isEqualTo(award2);

        award2 = getAwardSample2();
        assertThat(award1).isNotEqualTo(award2);
    }

    @Test
    void awardBookTest() {
        Award award = getAwardRandomSampleGenerator();
        AwardBook awardBookBack = getAwardBookRandomSampleGenerator();

        award.addAwardBook(awardBookBack);
        assertThat(award.getAwardBooks()).containsOnly(awardBookBack);
        assertThat(awardBookBack.getAward()).isEqualTo(award);

        award.removeAwardBook(awardBookBack);
        assertThat(award.getAwardBooks()).doesNotContain(awardBookBack);
        assertThat(awardBookBack.getAward()).isNull();

        award.awardBooks(new HashSet<>(Set.of(awardBookBack)));
        assertThat(award.getAwardBooks()).containsOnly(awardBookBack);
        assertThat(awardBookBack.getAward()).isEqualTo(award);

        award.setAwardBooks(new HashSet<>());
        assertThat(award.getAwardBooks()).doesNotContain(awardBookBack);
        assertThat(awardBookBack.getAward()).isNull();
    }
}
