package com.comfortconnect.tests.utils;

public class TestConfig {

    public static final String BASE_URL = System.getProperty("app.url", "http://localhost:3000");

    /** Hard wait cap for the 5-second processing animation + network roundtrip. */
    public static final int PROCESSING_TIMEOUT_SECONDS = 20;

    /** Default explicit-wait timeout for all page element waits. */
    public static final int DEFAULT_TIMEOUT_SECONDS = 10;

    /** Whether to run Chrome in headless mode. Override with -Dheadless=true for CI. */
    public static final boolean HEADLESS = Boolean.parseBoolean(System.getProperty("headless", "false"));

    /** Milliseconds to pause before each step. Set -Dstep.delay=1000 to slow down execution. */
    public static final int STEP_DELAY_MS = Integer.parseInt(System.getProperty("step.delay", "0"));
}
