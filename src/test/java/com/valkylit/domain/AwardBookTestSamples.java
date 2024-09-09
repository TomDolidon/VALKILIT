package com.valkylit.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class AwardBookTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static AwardBook getAwardBookSample1() {
        return new AwardBook().id(1L);
    }

    public static AwardBook getAwardBookSample2() {
        return new AwardBook().id(2L);
    }

    public static AwardBook getAwardBookRandomSampleGenerator() {
        return new AwardBook().id(longCount.incrementAndGet());
    }
}
